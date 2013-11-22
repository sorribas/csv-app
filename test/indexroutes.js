var should = require('should');
var index = require('../routes/index');

describe('index', function() {
  describe('.index', function() {
    it('should render the index page', function(done) {
      res = {
        render: function(viewname, data) {
          viewname.should.eql('index');
          done();
        }
      };

      index.index({}, res);
    });
  });
});
