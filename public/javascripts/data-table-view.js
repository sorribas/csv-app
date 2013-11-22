CsvApp.DataTableView = Backbone.View.extend({
  el: '#data',

  initialize: function(options) {
    this.template = _.template($("#dataTable").html());
    this.options = options;
    this.render();
  },

  render: function() {
    var self = this;
    self.$el.html(this.template());
    self.$el.find('table').html('');

    _.each(this.options.data, function(row, i) {
      var $html = $('<tr></tr>');
      if (i === 0) {
        row.forEach(function(val) {
          $html.append('<th>'+val.replace(/^\"|\"$|^\'|\'$/g, "")+'</th>');
        });
      } else {
        row.forEach(function(val) {
          $html.append('<td>'+val.replace(/^\"|\"$|^\'|\'$/g, "")+'</td>');
        });
      }
      self.$el.find('table').append($html);
    });
    this.$el.find('table').fadeIn();
  }
});
