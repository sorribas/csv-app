CsvApp.FileUploadView = Backbone.View.extend({
  el: '#content',

  events: {
    'change input': 'uploadFile'
  },

  initialize: function() {
    this.template = _.template($("#fileform").html());
  },

  render: function() {
    this.$el.html(this.template());
    this.$el.find('form').ajaxForm(function(data) {
      new CsvApp.DataTableView({data: data});
    });
    this.$el.find('input[type=file]').bootstrapFileInput();
    this.$el.find('.file-input-wrapper').addClass('btn-primary');
  },

  uploadFile: function() {
    $("#data").html('<img src="/images/ajax-loader.gif" />');
    this.$el.find('form').submit();
  }
});
