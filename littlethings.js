$(document).ready(function() {
  $(function() {
      $.stellar({
        horizontalScrolling: false
      });
    });

//   $(window).scroll(function() {
//     if (($(this).scrollTop() > $('.fullscreen').height())) {
//         $(window).scrollTop(0);
//         $('.fullscreen').css({
//             'display': 'none'
//         });
//     }
// });

  // $("h2").click(function() {
  //
  //   $("div").toggleClass("hide");
  //   $("h2").toggleClass("hide");
  //   $("#explorer").toggleClass("hide flyin");
  //   $("#folder").toggleClass("show");
  // });
  $(".playbutton").click(function() {

    $("#playandpause").toggleClass("fa fa-play fa-lg");
    $("#playandpause").toggleClass("fa fa-pause fa-lg");
    $(".song").toggleClass("musicplay");
  });
  $(".album").click(function() {

    $("#playandpause").toggleClass("fa fa-play fa-lg");
    $("#playandpause").toggleClass("fa fa-pause fa-lg");
    $(".song").toggleClass("musicplay");
  });
  //
  // $("h1").click(function() {
  //
  //   $("div").toggleClass("hide");
  //   $("h2").toggleClass("hide");
  //   $("#explorer").toggleClass("hide flyin");
  //   $("#folder").toggleClass("show");
  // });

  $(".selected").click(function() {

    $("div").toggleClass("hide");
    $("h2").toggleClass("hide");
    $("#explorer").toggleClass("hide flyin");
    $("#folder").toggleClass("show");
  });
});
