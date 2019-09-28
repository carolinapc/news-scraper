function saveArticle() {
  event.preventDefault();
  $card = $(this).parents(".col");

  $.ajax({
    method: "POST",
    url: "/api/articles/",
    data: {
      id: $(this).attr("data-id"),
    }
  }).then(function () {
    $card.remove();
  });
}

function deleteArticle() {
  event.preventDefault();
  $card = $(this).parents(".col");

  $.ajax({
    method: "DELETE",
    url: "/api/articles/",
    data: {
      id: $(this).attr("data-id"),
    }
  }).then(function () {
    $card.remove();
  });
}

function scrape() {
  event.preventDefault();
  
  $.ajax({
    url: "/api/scrape",
    method: "GET"
  }).then(function (data) {
    location.href = "/";
  });
}

function clearAll() {
  event.preventDefault();

  $.ajax({
    method: "DELETE",
    url: "/api/articles/all"
  }).then(function () {

    $("#articles").empty();
  });  
}

$(document).ready(function () {
  
  $(".btn-save-article").on("click", saveArticle);
  $(".btn-del-article").on("click", deleteArticle);
  $(".scrape").on("click", scrape);
  $(".clear-all").on("click", clearAll);

  //LAYOUT
  $('.sidenav').sidenav();
});