$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
       `<div class="main_chat__message-list__table" data-message-id=${message.id}>
          <div class="main_chat__message-list__table__top">
            <div class="main_chat__message-list__table__top__name">
              ${message.user_name}
            </div>
            <div class="main_chat__message-list__table__top__date">
              ${message.created_at}
            </div>
          </div>
          <div class="main_chat__message-list__table__text">
            <p class="main_chat__message-list__table__text__content">
              ${message.content}
            </p>
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html =
       `<div class="main_chat__message-list__table" data-message-id=${message.id}>
          <div class="main_chat__message-list__table__top">
            <div class="main_chat__message-list__table__top__name">
              ${message.user_name}
            </div>
            <div class="main_chat__message-list__table__top__date">
              ${message.created_at}
            </div>
          </div>
          <div class="main_chat__message-list__table__text">
            <p class="main_chat__message-list__table__text__content">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }
  $('#new_message').submit(function () {
    alert("2度押しです");
    $(":submit", this).prop("disabled", true);
    return false;
  });
  $('#new_message').on('submit', function(e){
      e.preventDefault();
      var formData = new FormData(this);
      var url = $(this).attr('action');
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.main_chat__message-list').append(html);
        $('.main_chat__message-list').animate({ scrollTop: $('.main_chat__message-list')[0].scrollHeight});
        $('.main_chat__message-form__new-message__submit').prop('disabled', false);
        $('form')[0].reset();
      })
      .fail(function() {
        alert("メッセージ送信に失敗しました");      
    });
  })
  var reloadMessages = function() {
    var last_message_id = $('.main_chat__message-list__table:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.main_chat__message-list').append(insertHTML);
        $('.main_chat__message-list').animate({ scrollTop: $('.main_chat__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});