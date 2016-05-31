var api = 'http://localhost:3000';

// Initialize your app
var App = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = App.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

mainView.router.loadPage('top-cards.html');

// Callbacks to run specific code for specific pages, for example for About page:
App.onPageInit('top-cards', function (page) {
  var cardHeaderSource   = $("#card-header-template").html();
  var cardHeaderTemplate = Handlebars.compile(cardHeaderSource);

  var cardSource   = $("#card-template").html();
  var cardTemplate = Handlebars.compile(cardSource);

  var lists = {
    current_op:      $(cardHeaderTemplate({ title: "Current Operations" })).appendTo('#top-cards'),
    upcoming_event:  $(cardHeaderTemplate({ title: "Upcoming Events" })).appendTo('#top-cards'),
    region:          $(cardHeaderTemplate({ title: "Regions" })).appendTo('#top-cards'),
    past_op:         $(cardHeaderTemplate({ title: "Past Operations" })).appendTo('#top-cards'),
    past_event:      $(cardHeaderTemplate({ title: "Past Events" })).appendTo('#top-cards'),
  };

  $.getJSON(api + '/files', function(files) {
    $.each(files, function(_, file) {
      file.header_pic = $.grep(file.items, function(obj) { return $.inArray('cover-image', obj.tags) > -1 })[0];
      var fileTemplate = cardTemplate(file);
      $.each(file.tags, function(_, tag) {
        $(lists[tag]).append(fileTemplate);
      });
    });

    initializeDates();
  });
});

function initializeDates() {
  $('.datetime').each(function(index, ele) {
    var obj = $(ele);
    var time = moment.utc(obj.text());
    if(time.isValid()) {
      obj.text(time.format(obj.data('strftime')));
    }
  });
}


$(function() {
  initializeDates();
});
