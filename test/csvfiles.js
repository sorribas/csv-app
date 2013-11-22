var should = require('should');
var csvfiles = require('../routes/csvfiles');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

describe('csvfiles', function() {
  describe('.upload', function() {
    it('should correctly show the data on an uploaded file', function(done) {
      req = {};
      req.busboy = new EventEmitter();
      req.pipe = function() { req.busboy.emit('file', null, fs.createReadStream('./fixtures/sample4.csv')) }

      res = {};
      res.send = function(data) {
        data[0][0].should.eql('Bogført');
        data[2][1].should.eql('Dankort-nota Elite Købmand  27039');
        done();
      };

      csvfiles.upload(req, res);
    });
  });
});
