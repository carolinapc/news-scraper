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

$(document).ready(function () {
  
  $(".btn-save-article").on("click", saveArticle);
  $(".btn-del-article").on("click", deleteArticle);

  //LAYOUT
  $('.sidenav').sidenav();
});