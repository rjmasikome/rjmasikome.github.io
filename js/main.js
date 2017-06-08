$(function(){
  $("nav").load("fragments/nav.html");
  $("header").load("fragments/header.html");
  $("#work").load("fragments/work.html");
  $("#timeline").load("fragments/timeline.html");
  $("#project").load("fragments/project.html");
  $("#education").load("fragments/education.html");
  $("#contact").load("fragments/contact.html");

  window.setTimeout(function() {
    $(".intro-text").typed({
      strings: ["A versatile full stack js developer", "Hail from Manado, Indonesia", "Currently in Bonn, Germany"],
      typeSpeed: 100,
      backDelay: 2000,
      loop: true
    });
  }, 1000);
});
