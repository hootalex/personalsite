$(document).ready(function() {
  $("h1").click(function() {

    $("h1").addClass("errorshake");
    setTimeout(function() {
      $("h1").removeClass('errorshake');
    }, 600);
  });

  $("h2").click(function() {

    $("article").toggleClass("hide");
    $("h2").toggleClass("hide");
    $("#folder").toggleClass("show");
  });
});
