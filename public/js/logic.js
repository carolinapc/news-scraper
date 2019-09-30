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
    location.href = "/";
  });  
}

function addComment() {
  if (event.key.toUpperCase() === "ENTER") {
    let $input = $(this);
    let id = $input.data("id");
    let data = {
      comment: $input.val().trim()
    };
    
    $.ajax({
      method: "POST",
      url: `api/comment/${id}`,
      data: data
    }).then(function (article) {
      
      renderNewComment(article.comments[article.comments.length-1], id, data.comment);
      $input.val("");

    });
  }
}

function renderNewComment(commentId, modalId, comment) {
  let $comments = $(`#modal-${modalId} .modal-content`);
  let $newP = $("<p>");
  let $newA = $("<a>");
  
  $newA.attr("class", "btn-floating btn-small waves-effect waves-light red btn-del-comment");
  $newA.append(`<i class="material-icons">delete</i>`);
  $newA.data("id", commentId);
  $newA.click(deleteComment);
  $newA.data("article-id", modalId);

  $newP.append($newA);
  $newP.append(" " + comment);
  $comments.append($newP);
  $comments.focus();
}

function openComments() {
  let id = $(this).data("id");
  let $input = $(`#modal-${id} .comment`);
  
  $input.data("id", id);
  $input.val("");
}

function deleteComment() {
  event.preventDefault();
  $comment = $(this);
  id = $comment.data("id");
  articleId = $comment.data("article-id");
  
  $.ajax({
    method: "DELETE",
    url: `api/comment/${id}/${articleId}`    
  }).then(function () {
    $comment.parent().remove();
  });
}

$(document).ready(function () {
  
  $(".btn-save-article").on("click", saveArticle);
  $(".btn-del-article").on("click", deleteArticle);
  $(".scrape").on("click", scrape);
  $(".clear-all").on("click", clearAll);
  $(".modal-trigger").on("click", openComments);
  $(".comment").on("keypress", addComment);
  $(".btn-del-comment").on("click", deleteComment);

  //LAYOUT
  $('.sidenav').sidenav();
  $('.modal').modal();
  
});