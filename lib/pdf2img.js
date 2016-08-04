var exec    = require('child_process').exec;
var fs      = require('fs');
var path    = require('path');
var http    = require('http');
var uuid    = require('node-uuid');
var Promise = require('bluebird');
var Config  = require('./config');

/**
 * @constructor
 * @param {Object} user_config
 */
var Pdf2img = function(user_config){
  this.config = new Config(user_config);
};

module.exports = Pdf2img;

/**
 * Transform pdf to image from file path or buffer
 *
 * @param {Buffer,String} buffer_or_file_path
 * @param {Object} custom_config Special config for this file
 * @return {Promise}
 */
Pdf2img.prototype.fromFile = function(buffer_or_file_path, custom_config){
  var self = this;

  return new Promise(function(resolve, reject){

    custom_config = custom_config || {};

    if(typeof(buffer_or_file_path) == 'string'){
      fs.readFile(buffer_or_file_path, function(err, file){
        if(err)
          return reject(err);

        self.handle(buffer_or_file_path, custom_config).then(resolve, reject);
      });

    } else if (typeof(buffer_or_file_path) == 'object'){

      var source_path = self.getTempFileName('pdf');
      fs.writeFile(source_path, buffer_or_file_path, function(err){
        if(err)
          reject(err);

        custom_config.destroy_source = true;

        self.handle(source_path, custom_config).then(resolve, reject);
      });
    } else {
      reject(new Error('Invalid parameter'));
    }
  });
};

/**
 * Transform pdf to image from uri
 *
 * @param {String} uri
 * @param {Object} custom_config Special config for this file
 * @return {Promise}
 */
Pdf2img.prototype.fromUri = function(uri, custom_config){
  var self = this;

  return new Promise(function(resolve, reject){

    custom_config = custom_config || {};

    http.get(uri, function(response) {
      response.on('error', reject);

      var source_path = self.getTempFileName('pdf');
      var source_file = fs.createWriteStream(source_path);

      response.pipe(source_file);

      response.on('end', function(){
        custom_config.destroy_source = true;
        self.handle(source_path, custom_config).then(resolve, reject);
      });
    });
  });
};

/**
 * Transform pdf in image, and return read stream
 *
 * @param {String} source_path
 * @param {Object} custom_config
 * @return {Promise}
 */
Pdf2img.prototype.handle = function(source_path, custom_config){
  var self = this;

  return new Promise(function(resolve, reject){

    var target_path       = self.getTempFileName('png');
    var command_line_opts = self.configToOpts(source_path, target_path, custom_config);

    self.exec(command_line_opts).then(function(){

      if(custom_config.destroy_source === true)
        fs.unlink(source_path);

      var read_stream = fs.createReadStream(target_path);

      read_stream.on('end', function(){
        fs.unlink(target_path);
      });

      resolve(read_stream);
    }, reject);
  });
};

/**
 * Get tmp file path
 *
 * @param {String} ext file extention
 * @return {String}
 */
Pdf2img.prototype.getTempFileName = function(ext){
  var file_name = uuid.v4();

  if(ext)
    file_name += '.' + ext;

  return [this.config.tmp_path, file_name].join(path.sep);
};

/**
 * Parse options from config for 'convert' command
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} custom_config
 * @return {String}
 */
Pdf2img.prototype.configToOpts = function(source, target, custom_config){
  var opts = [];

  if(custom_config.page){
    custom_config.page--;
  } else {
    custom_config.page = 0;
  }

  opts.push('-density 150');
  opts.push('-trim');
  opts.push(source + '[' + custom_config.page + ']');
  opts.push(['-quality', custom_config.quality || this.config.quality].join(' '));
  opts.push('-sharpen 0x1.0');
  opts.push(target);

  return opts.join(' ');
};

/**
 * Exec 'convert' command on system
 *
 * @param {String} opts options to passs for 'convert' command
 * @return {Promise}
 */
Pdf2img.prototype.exec = function(opts){
  var self = this;

  return new Promise(function(resolve, reject){
    var cmd = [self.config.convert_bin, opts].join(' ');

    exec(cmd, function(err, stdout, stderr){
      if(err)
        return reject(err);

      resolve();
    });
  });
};
