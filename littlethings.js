$(document).ready(function() {
  // $("h1").click(function() {
  //
  //   $("h1").addClass("errorshake");
  //   setTimeout(function() {
  //     $("h1").removeClass('errorshake');
  //   }, 600);
  // });

  var windowheight = $(window).height();
  $(window).scroll(function() {
    if (($(this).scrollTop() > windowheight)) {
        $(window).scrollTop(0);
        $('.fullscreen').css({
            'display': 'none'
        });
    }
});

  $("h2").click(function() {

    $("div").toggleClass("hide");
    $("h2").toggleClass("hide");
    $("#explorer").toggleClass("hide flyin");
    $("#folder").toggleClass("show");
  });
  $(".playbutton").click(function() {

    $("#playandpause").toggleClass("fa fa-play fa-lg");
    $("#playandpause").toggleClass("fa fa-pause fa-lg");
  });

  $("h1").click(function() {

    $("div").toggleClass("hide");
    $("h2").toggleClass("hide");
    $("#explorer").toggleClass("hide flyin");
    $("#folder").toggleClass("show");
  });

  $(".selected").click(function() {

    $("div").toggleClass("hide");
    $("h2").toggleClass("hide");
    $("#explorer").toggleClass("hide flyin");
    $("#folder").toggleClass("show");
  });
});
