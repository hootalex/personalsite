$(function() {
  $('img').each( function() {
    var o = $(this);
    if( ! o.attr('title') && o.attr('alt') ) o.attr('title', o.attr('alt') );
  });
});
