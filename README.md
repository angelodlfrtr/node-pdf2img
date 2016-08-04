# NODE PDF2IMAGE

Convert pdf to image with imagemaick.

## Intallation

In root folder of your project : `npm install angelodlfrtr/node-pdf2img`

Then import it : `var PDF2img = require('node-pdf2img');`

## Usage

### Configuration

When you create a new PDF2img instance, you can pass config object :
```js
var default_config = {
  tmp_path: "/tmp",
  quality: 90,
  convert_bin: "/usr/bin/convert"
};

var instance = new PDF2img(default_config);
```

### Convert from URI

```js
var pdfinstance = new PDF2img();

pdfinstance.fromUri('http://somepdfuri').then(function(response_stream){

  // Response stream is png file read stream
  // Temp png source file is destroyed when 'end' event is fired on stream

  response_stream.on('data', function(data){
    // do something with data
  });

  response_stream.on('end', function(){
    console.log('end');
  });

}, function(err){
  console.log(err);
});
```

### Convert from file path

```js

pdf.fromFile('/tmp/test.pdf').then(function(response_stream){

  // In this case, source file is not destroyed

}, function(err){
  console.log(err);
});

```

### Convert from buffer

```js
var fs = require('fs');

fs.readFile('/tmp/test.pdf', function(err, buf){

  pdf.fromFile(buf).then(function(response_stream){

    // ...

  }, function(err){
    console.log(err);
  });
});

```

### Additionnal options

For `fromFile` and `fromUri` methods, you can pass as second argument a config object :

```js
var custom_config = {
  quality: 100,
  destroy_source: true // Destroy source file (Default unless source is a file path)
};

var promise = pdf.fromFile('/tmp/test.pdf', custom_config);

```

## LICENSE

Copyright (c) 2016 Angelo Delefortrie

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
