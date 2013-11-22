var csv = require('csv');
var Iconv = require('iconv').Iconv;
var jschardet = require("jschardet");
var fs = require('fs');

var detectSeparator = function(buf) {
  var delims = {',':0, '|': 0, ';': 0, ':': 0, '\t': 0 };
  for (var i = 0; i < buf.length; i++) {
    var chr = String.fromCharCode(buf[i])
    if(typeof delims[chr] != 'undefined') delims[chr]++;
  }

  var sortedKeys = Object.keys(delims).sort(function(a, b) {
    if (delims[a] > delims[b]) return  1;
    if (delims[a] < delims[b]) return -1;
    if (delims[a] == delims[b]) return 0;
  }).reverse();
  return sortedKeys[0];
};

var isWhitespace = function(code) {
  var c = String.fromCharCode(code);
  return c === ' ' || c === '\n' || c === '\r' || c === '\t'; 
};

var removeLeadingWhitespace = function(file) {
  var c, chunk;
  do {
    chunk = file.read(1);
    c = chunk[0];
  } while(isWhitespace(c));
  file.unshift(chunk);
};

var convertFileToUtf8 = function(file, done) {
  var finished = false;
  file.on('readable', function() {
    if (finished) return;
    finished = true;

    var converter;
    var chunk = file.read(100);
    var cd = jschardet.detect(chunk.toString('binary'));
    converter = new Iconv(cd.encoding, 'utf8//TRANSLIT//IGNORE');
    file.unshift(chunk);

    var filename = '/tmp/csvapp'+(new Date()).getTime();
    var fws = fs.createWriteStream(filename);
    file.pipe(converter).pipe(fws);
    fws.on('finish', function() { done(filename); });
  });
};

exports.upload = function(req, res) {
  req.busboy.on('file', function(field, file, filename) {

    convertFileToUtf8(file, function(fname) {
      var fl = fs.createReadStream(fname);
      fl.on('readable', function() {
        // Read a chunk to detect the separator since node-csv doesn't detect it
        var chunk = fl.read(50);
        var separator = detectSeparator(chunk);
        fl.unshift(chunk);
        removeLeadingWhitespace(fl);

        // Parse the csv and delete the temp file
        csv().from.stream(fl, {delimiter: separator, quote: ''}).to.array(function(data){
          res.send(data);
          fs.unlink(fname, function() {});
        })
      });
    });

  });

  req.pipe(req.busboy);
};
