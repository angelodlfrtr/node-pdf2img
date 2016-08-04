"use strict";

/**
 * @constructor
 * @param {Object} user_config
 */
var Config = function(user_config){

  // Parse config
  var config_parsed = this.parse(user_config);

  // Store keys in object
  for(var k in config_parsed){
    this[k] = config_parsed[k];
  }
};

module.exports = Config;

// Set default config
Config.default_config = {
  convert_bin: '/usr/bin/convert',
  quality: 90,
  tmp_path: '/tmp'
};

/**
 * Parse user config with default_config
 *
 * @param {Object} user_config
 * @return {Object} Config parsed
 */
Config.prototype.parse = function(user_config){
  if(!user_config)
    return Config.default_config;

  for(var k in Config.default_config){
    if(!user_config[k])
      user_config[k] = Config.default_config[k];
  }

  return user_config;
};
