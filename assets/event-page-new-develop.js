// event-new-development
theme_custom.base_url = theme_custom.api_base_url;
const APP_Token = 'Bearer ' + localStorage.getItem("customerToken");

theme_custom.lookAssignToMember = function(member_id,look_id){
  var selectedLook = look_id;
  var eventMemberId = member_id;
  
  var data = {
    "look_id": selectedLook,
    "member_id": eventMemberId
  }
  $.ajax({
    url: `${theme_custom.base_url}/api/look/assignToMember`,
    method: "POST",
    data: data,
    dataType: "json",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      $(this).addClass("disabled");
    },
    success: function (result) {
      console.log("result",result)
      console.log("Look Assign to current ")
    },
    error: function (xhr, status, error) {
      $(this).removeClass("disabled");
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        parent.find('.api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        parent.find('.api_error').show().html(xhr.responseJSON.message).css("text-align", "center");
        setTimeout(() => {
          parent.find(".api_error").hide();
        }, 3000);
      }
    }
  });
}

$(".member-added-into-event").click(function (e) {
  e.preventDefault();
  theme_custom.lookVal = $(this).closest(".add-guest-inner-wrapper").find(".look-name").attr("data-look-mapping-id")
  var parent = $(this).closest('.invite-another-member-popup-wrapper');
  var error_count = 0,
    eventId = localStorage.getItem("set-event-id"),
    button = $(this);
  error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('.member-first-name'));
  error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('.member-last-name'));
  error_count = error_count + theme_custom.emailValidation(parent.find('.member-email'));
  error_count = error_count + theme_custom.phoneValidation(parent.find('.member-phone'));
  if (error_count == 0) {
    var memberFirstName = $(".member-first-name").val();
    var memberLastName = $(".member-last-name").val();
    var memberEmail = $(".member-email").val();
    var memberPhone = $(".member-phone").val().replace('(','').replace(' ','').replace(')','').replace('-','');
    // var InviteFormradio_val = $(".field.form-wrap.custom-checkobx span.custom_checkbox input[type=radio]:checked").val();
    var hostPayInfo = $(".field.form-wrap.custom-checkobx span.custom_checkbox input[type=radio]:checked").data('val');
  }
  var member_info_data = {
    "first_name": memberFirstName,
    "last_name": memberLastName,
    "email": memberEmail,
    "phone": memberPhone,
    "is_host_paying": hostPayInfo
  }
  console.log("member_info_data",member_info_data)
  if (error_count == 0) {
    $(this).addClass("disabled");
    $.ajax({
      url: `${theme_custom.base_url}/api/event/addMember/${eventId}`,
      method: "POST",
      data: member_info_data,
      dataType: "json",
      crossDomain: true,
      headers: {
        // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        console.log("Result",result)
        theme_custom.lookAssignToMember(result.data.id,theme_custom.lookVal);
      },
      error: function (xhr, status, error) {
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          $('.invite-another-member-popup-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
            'text-align': 'center',
            'color': 'red'
          });
          setTimeout(() => {
            window.location.href = '/account/logout';
          }, 5000);
        } else {
          $('.invite-another-member-popup-wrapper .api_error').show().html(xhr.responseJSON.message);
          setTimeout(() => {
            button.removeClass("disabled");
            $('.invite-another-member-popup-wrapper .api_error').hide()
          }, 10000);
        }
      }
    });
  }
});

theme_custom.createLookHtml = (div,item) =>{
  var deleteIconShow = '';
  if(item.assign == true){
    deleteIconShow = 'hidden';
  }
  div.append(`<div class="look-card-block" data-look-mapping-id="${item.mapping_id}" data-look-id="${item.look_id}">
    <div class="look-title-and-price">
      <div class="look-title">${item.name}</div>
      <div class="look-price-wrap">
        <span class="text-lable">Starting at</span>
        <span class="look-price">$199.99</span>
      </div>
    </div>
    <div class="look-image">
      <div class="delete-icon ${deleteIconShow}" data-event-look-id="${item.mapping_id}">
        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/delete_1.png?v=1677118754" alt="delete icon" />
      </div>
      <img class="look-img" src="${item.look_image}" alt="${item.name}" />
      <button data-href="${item.url}" edit-look-id="${localStorage.getItem("set-event-id")}" look-mapping-id="${item.mapping_id}" edit-look-name="${item.name}" class="button button--secondary customise-look customise-look-button">Customise look</button>
    </div>
    <div class="pay-info-confirmation-wrap">
      <div class="title">Are you wearing this look?</div>
      <div class="confirm-box-wrap">
        <span class="active" data-value="yes">Yes</span>
        <span data-value="no">No</span>
      </div>
    </div>
    <div class="assign-look-user-wrap"></div>
    <button class="add-guest-button">+ ADD GUEST</button>
  </div>`)
}

// Get Favorite Looks
theme_custom.favoriteLooks = function(){
  var favorite_api_url = `${theme_custom.base_url}/api/look/favouriteLooks`;
  var favorite_look_image = 'https://cdn.shopify.com/s/files/1/0585/3223/3402/files/product-img-3.png?v=1634963523';
  $.ajax({
    url: favorite_api_url,
    method: "GET",
    data: '',
    dataType: "json",
    headers: {
      "Authorization": APP_Token
    },
    beforeSend: function () {
    },
    success: function (result) {
      if (result.success) {
          if (result.data.length > 0) {
            var append_fav_html = "";
            $('#choose-form-favorite .product-wrapper').html(append_fav_html);
            var edit_link = '';
            for (var i = 0; i < result.data.length; i++) {   
              var productArray = result.data[i].items;
              var itemData = '';
              for(var items = 0; items < productArray.length ; items++){
                itemData += `<div class="product-data-card">
                  <input type="hidden" class="looks-product-id" value="${productArray[items].product_id}" />
                  <input type="hidden" class="looks-product-var-id" value="${productArray[items].variant_id}" />
                  <input type="hidden" class="looks-product-handle" value="${productArray[items].handle}" />
                </div>`
              }        
              if (result.data[i].look_image) {
                favorite_look_image = result.data[i].look_image;
              }
              if (result.data[i].url) {
                edit_link = `<span data-href="${result.data[i].url}" class="link edit-favorite-look-button">Edit look</span><span class="break"> | </span>`;
              } else {
                edit_link = ``;
              }
              append_fav_html += `<div class="product-card">
              <div class="img">
                <img src="${favorite_look_image}" alt="favourite-look-img">
              </div>
              <div class="product-info">
                <div class="item-data-wrapper">${itemData}</div>
                <h4 class="product-title">${result.data[i].name}</h4>
                <p class="product-price">Starting at $199.99</p>
                <p class="taxes-text">Price includes suit jacket and pants</p>
                <button class="button button--secondary look-added-into-event" data-text="Adding...">Add To Event</button>
              </div>
            </div>`;
          }
          $('#choose-form-favorite .product-wrapper').html(append_fav_html);
        } else {
          var html = `<div class="empty-message text_center"> You haven't saved any Favorite Looks yet.</div>`;
          $('#choose-form-favorite .product-wrapper').html(html);
          $("#choose-form-favorite").addClass("empty-fav-look-wrapper")
        }
      } else {
        // alert(result.data.success);
      }
    },
    error: function (xhr, status, error) {
      $('.feature-looks-slider-loader').hide();
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.feature-looks-slider').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.feature-looks-slider').html(xhr.responseJSON.message);
      }
    }
  });
} 

theme_custom.checkLooks = (id) =>{
  fetch(`${theme_custom.base_url}/api/event/${id}`,{
    method: "GET",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
  }).then((data)=> data.json())
  .then((data)=>{
    data.data.event_looks = data.data.event_looks.reverse();
    if(data.data.event_looks && data.data.event_looks.length > 0){
      const looksDiv = $('.show-look-from-event-wrapper .event-look-inner-wrapper, .guest-top-looks .event-look-inner-wrapper');
      looksDiv.empty();
      for(let i = 0; i<data.data.event_looks.length;i++){
        let item = data.data.event_looks[i];
        theme_custom.createLookHtml(looksDiv, item);
      }
      $(".close-icon").click();
      $(".step-content-wrapper.create-event-look .event-block-wrap").hide();
      $('.show-look-from-event-wrapper').show();
      if(looksDiv.hasClass("slick-initialized")){
        looksDiv.removeClass("slick-initialized").removeClass("slick-slider");
      }
      setTimeout(() => {
        theme_custom.eventLookSlider();
      }, 2000);
    }else{
      $(".event-block-wrap").show();
      $('.show-look-from-event-wrapper').hide();
    }
  });
}

theme_custom.changeStep = (index) =>{
  $('.step-content-wrapper').removeClass('active');
  $(`.step-content-wrapper[data-step-content-wrap="${index}"]`).addClass("active");
  $(`.step-wrap[data-step-label-wrap="${index}"]`).addClass("active");
  setTimeout(() => {
    $(".event-step-wrapeper").removeClass("hidden");
    $(".loader-wrapper").addClass("hidden");
  }, 2000);
}

theme_custom.updateEventAPI = function(btn){
  var button = btn;
  var error_count = 0, button = btn,
  error_count = error_count +  theme_custom.eventReminderTitleValidation($(".event-page-new-design-wrapper").find(".event-name"));
  if (error_count > 0) {
    $('html, body').animate({
      scrollTop: $('.event-type-block-wrap').offset().top - 120
    }, 1000);
    return false; 
  }
  if ($('[name="event-type"]:checked').length == 0) {
    $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-type-section-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-page-new-design-wrapper #event_date').val() == '' ) {
    $('.event-page-new-design-wrapper .event-date-wrap .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .event-date-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('[name="event-role"]:checked').length == 0) {
    $('.event-page-new-design-wrapper .role-in-event-wrap .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .role-in-event-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-phone-number .phone-number').val() == '') {
    $('.event-page-new-design-wrapper .event-phone-number .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .event-phone-number').offset().top - 120
    }, 1000);
    return false;
  }
  if (error_count == 0) {
    button.addClass('loading')
    var event_name = $('.event-page-new-design-wrapper .event-name').val();
    var event_type = $('.event-page-new-design-wrapper [name="event-type"]:checked').attr('data-event-type-id');
    var event_date = $('.event-page-new-design-wrapper #event_date').val();
    var event_role = $('.event-page-new-design-wrapper [name="event-role"]:checked').attr('data-event-role-id');
    var event_phone = $('.event-page-new-design-wrapper .phone-number').val().replace('(','').replace(' ','').replace(')','').replace('-','');
    var event_data = {
      "name": event_name,
      "event_type_id": event_type,
      "event_date": event_date,
      "event_role_id": event_role,
      "owner_phone_number":event_phone
    }
    var eventId = localStorage.getItem("set-event-id")
    $.ajax({
      url: `${theme_custom.base_url}/api/event/edit/${eventId}`,
      method: 'PUT',
      data: event_data,
      dataType: "json",
      headers: {
        "Authorization": APP_Token
      },
      beforeSend: function () {
        $(this).addClass("disable");
      },
      success: function (result) {
        if (result.success) {
          btn.find(".label").text("Event Updated");
          setTimeout(() => {
            btn.removeClass('loading');
            btn.find(".label").text("Update Event");
            $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
            theme_custom.checkLooks(localStorage.getItem("set-event-id"));
          }, 1000);
        }
      },
      error: function (xhr, status, error) {
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          $('.api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
            'text-align': 'center',
            'color': 'red'
          });
          setTimeout(() => {
            theme_custom.removeLocalStorage();
            window.location.href = '/account/logout';
          }, 5000);
        } else {
          var event_date_msg = '';
          if (xhr.responseJSON.data) {
            if (xhr.responseJSON.data.event_date != undefined) {
              for (let i = 0; i < xhr.responseJSON.data.event_date.length; i++) {
                event_date_msg += `<span>${xhr.responseJSON.data.event_date[i]}</span>`;
              }
            } else {
              for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                var errorMsg = xhr.responseJSON.data[i];
                var membererror = '';
                $.each(errorMsg, function (key, value) {
                  membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                })
                event_date_msg += `<div>${membererror}</div>`;
              }
            }
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.api_error').fadeOut();
            button.removeClass("disable");
          }, 10000);
        }
      }
    });
  }
}

theme_custom.createEventAPI = function(btn){
  var button = btn;
  var error_count = 0, button = btn,
  error_count = error_count +  theme_custom.eventReminderTitleValidation($(".event-page-new-design-wrapper").find(".event-name"));
  if (error_count > 0) {
    $('html, body').animate({
      scrollTop: $('.event-type-block-wrap').offset().top - 120
    }, 1000);
    return false; 
  }
  if ($('[name="event-type"]:checked').length == 0) {
    $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-type-section-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-page-new-design-wrapper #event_date').val() == '' ) {
    $('.event-page-new-design-wrapper .event-date-wrap .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .event-date-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('[name="event-role"]:checked').length == 0) {
    $('.event-page-new-design-wrapper .role-in-event-wrap .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .role-in-event-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-phone-number .phone-number').val() == '') {
    $('.event-page-new-design-wrapper .event-phone-number .form-error').addClass('active');
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .event-phone-number').offset().top - 120
    }, 1000);
    return false;
  }
  if (error_count == 0) {
    button.addClass('loading')
    var event_name = $('.event-page-new-design-wrapper .event-name').val();
    var event_type = $('.event-page-new-design-wrapper [name="event-type"]:checked').attr('data-event-type-id');
    var event_date = $('.event-page-new-design-wrapper #event_date').val();
    var event_role = $('.event-page-new-design-wrapper [name="event-role"]:checked').attr('data-event-role-id');
    var event_phone = $('.event-page-new-design-wrapper .phone-number').val().replace('(','').replace(' ','').replace(')','').replace('-','');
    var event_data = {
      "name": event_name,
      "event_type_id": event_type,
      "event_date": event_date,
      "event_role_id": event_role,
      "owner_phone_number":event_phone
    }
    $.ajax({
      url: `${theme_custom.base_url}/api/event/create`,
      method: 'POST',
      data: event_data,
      dataType: "json",
      headers: {
        "Authorization": APP_Token
      },
      beforeSend: function () {
        $(this).addClass("disable");
      },
      success: function (result) {
        if (result.success) {
          btn.removeClass('loading');
          if(result.message == 'Event updated successfully.'){
            btn.find(".label").text("Event Updated");
            setTimeout(() => {
              btn.find(".label").text("Update Event");
            }, 1000);
          } else {
            localStorage.setItem("set-event-id", result.data.eventId);
            $(".create-event-button").addClass("next-button").removeClass("create-event-button");    
            $("#event-id").val(result.data.eventId);
            $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
          }
        }
      },
      error: function (xhr, status, error) {
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          $('.api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
            'text-align': 'center',
            'color': 'red'
          });
          setTimeout(() => {
            theme_custom.removeLocalStorage();
            window.location.href = '/account/logout';
          }, 5000);
        } else {
          var event_date_msg = '';
          if (xhr.responseJSON.data) {
            if (xhr.responseJSON.data.event_date != undefined) {
              for (let i = 0; i < xhr.responseJSON.data.event_date.length; i++) {
                event_date_msg += `<span>${xhr.responseJSON.data.event_date[i]}</span>`;
              }
            } else {
              for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                var errorMsg = xhr.responseJSON.data[i];
                var membererror = '';
                $.each(errorMsg, function (key, value) {
                  membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                })
                event_date_msg += `<div>${membererror}</div>`;
              }
            }
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.api_error').fadeOut();
            button.removeClass("disable");
          }, 10000);
        }
      }
    });
  }
}
theme_custom.lookImage = function (look_image, lookID, button) {
  var button = button,
      form_data = new FormData(),
      fileVal = theme_custom.ImageURL,
      imageType = /image.*/;

  if (!fileVal.type.match(imageType)) {
      return;
  } else {
      form_data.append('lookImage', fileVal);
  }
  $.ajax({
      url: `${theme_custom.base_url}/api/look/picture/${lookID}`,
      method: "POST",
      timeout: "0",
      data: form_data,
      dataType: "json",
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      headers: {
          // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {

      },
      success: function (result) {
        button.removeClass("disabled").text("Look Added");
        theme_custom.checkLooks(localStorage.getItem("set-event-id"));
      },
      error: function (xhr, status, error) {
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
              $(".look-api-message").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                  'text-align': 'center',
                  'color': 'red'
              });
              setTimeout(() => {
                  theme_custom.removeLocalStorage();
                  window.location.href = '/account/logout';
              }, 5000);
          } else {
              button.addClass("disabled").css("margin-top", "15px");
              button.removeClass("disabled").text("Add Look");
              $(".look-api-message").html(xhr.responseJSON.message).removeClass("look-api-message");
              setTimeout(() => {
                  $('.update-profile-image-popup-wrapper .api_error').hide();
                  $(".look-api-message").removeClass("look-api-message");
              }, 3000);
          }
      }
  });
}
theme_custom.createLookAPI = function(lookName,eventId,lookUrl,produArray,button){
  var getEventId = eventId;
  eventData = {
    "look_name": lookName,
    "event_id": eventId,
    "url": lookUrl,
    "items": produArray
  }
  button.addClass("disabled");
  $.ajax({
    url: `${theme_custom.api_base_url}/api/look/createLook`,
    method: "POST",
    data: eventData,
    dataType: "json",
    headers: {
      "Authorization": 'Bearer '+localStorage.getItem("customerToken")
    },
    beforeSend: function() {
    }, 
    success: function(result){
      var lookID = result.data.lookId;
      theme_custom.lookImage(getEventId,lookID,button);
    },
    error:function(xhr,status,error){
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $(".look-api-message").text('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        button.removeClass("disabled").text("Add Event");
        $(".look-api-message").text(xhr.responseJSON.message).removeClass("hidden");
        setTimeout(() => {
          $(".look-api-message").addClass("hidden");
        }, 3000);
      }
    }
  });
}
theme_custom.toDataURL = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
theme_custom.dataURLtoFile = function (dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
theme_custom.lookAddedIntoEvent = function(){
  $(document).on("click", ".look-added-into-event", function(e){
    e.preventDefault();
    var button = $(this);
    button.text($(this).data("text"));
    var lookName = $(this).closest(".product-card").find(".product-title").text(),
        eventId = $(this).closest(".event-page-new-design-wrapper").find("#event-id").val();
    var custom_look_new_url = '/pages/customize-your-look?';
    $(this).closest(".product-card").find(`.item-data-wrapper .product-data-card`).each(function(){
      var productHandle = $(this).find(".looks-product-handle").val();
      var productVarId = $(this).find(".looks-product-var-id").val();
      if($(this).closest(".product-card").find(`.item-data-wrapper .product-data-card`).length > 1) {
        if(custom_look_new_url.indexOf("=") > -1) {
          custom_look_new_url += "&"+productHandle+'='+productVarId;
        }else{
          custom_look_new_url += productHandle+'='+productVarId;
        }
      } else {
        custom_look_new_url += productHandle+'='+productVarId;
      }
    });
    lookUrl = custom_look_new_url;
    var productDataCardArr = $(this).closest(".product-card").find(`.item-data-wrapper .product-data-card`),
        dataObj = {};
    theme_custom.newArray = [],
    productDataCardArr.each(function(){
      if($(this).closest(".product-card").find(`.item-data-wrapper .product-data-card .looks-product-var-id`).val() != ''){
        dataObj = {
          "product_id": $(this).find(".looks-product-id").val(),
          "variant_id": $(this).find(".looks-product-var-id").val(),
          "product_handle": $(this).find(".looks-product-handle").val(),
          "type": "looks"
        }
        theme_custom.newArray.push(dataObj);
      }
    })
    produArray = theme_custom.newArray;
    var productImageUrl = $(this).closest(".product-card").find(".img img").attr("src");
    theme_custom.toDataURL(productImageUrl, function(dataUrl) {
      theme_custom.image_url = dataUrl;
      theme_custom.ImageURL = theme_custom.dataURLtoFile(theme_custom.image_url,'custom-look.png');
    })
    theme_custom.createLookAPI(lookName,eventId,lookUrl,produArray,button);
  })
}
theme_custom.eventPageClickEvent = function(){

  $(document).on('click', '.custom-paginate-next', function(event) {
    event.preventDefault();
  
    var url = $(this).attr('data-href');
    $.ajax({
      url: url,
      dataType: 'html',
      success: function(data) {
        $("#browser-top-looks").find(".product-wrapper").html(data)
      }
    });
  });

  theme_custom.lookAddedIntoEvent()
  
  // customise-look-button 
  $(document).on("click", ".customise-look-button", function(){
    localStorage.setItem("customizerlookUrl",$(this).attr("data-href").split('?')[1]);
    localStorage.setItem("customize-from-event","true");
    localStorage.setItem("eventLookId",$(this).attr("look-mapping-id"));
    localStorage.setItem("eventLookName",$(this).attr("edit-look-name"));
    window.location.href = $(this).attr("data-href");
  })
  
  // Create Event API Functionality
  $(document).on("click", ".event-page-new-design-wrapper .create-event-button", function(){
    theme_custom.createEventAPI( $(this));
  });

  // update Event API Functionality
  $(document).on("click",".event-page-new-design-wrapper .event-update-button",function(){
    theme_custom.updateEventAPI($(this));
  })
  
  // Next button 
  $(document).on("click", ".event-page-new-design-wrapper .next-button", function(){
    $(".event-step-wrapeper").addClass("hidden");
    $(".loader-wrapper").removeClass("hidden");
    var target = $(this);
    var nextTarget = target.closest(".step-content-wrapper").next(".step-content-wrapper").attr("data-step-content-wrap");
    if($(this).closest(`.step-content-wrapper[data-step-content-wrap="1"]`).length > 0){
      $(`.step-content-wrapper[data-step-content-wrap="2"]`).find(".event-block-wrap").hide();
      theme_custom.checkLooks(localStorage.getItem("set-event-id"));
    }
    theme_custom.changeStep(nextTarget);
  });

  // Previous Button
  $(document).on("click", ".event-page-new-design-wrapper .previous-button", function(){
    var target = $(this);
    var currentTabHead = target.closest(".step-content-wrapper").attr("data-step-content-wrap");
    var prevTarget = target.closest(".step-content-wrapper").prev(".step-content-wrapper").attr("data-step-content-wrap");
    prevTarget = parseInt(prevTarget);
    theme_custom.changeStep(prevTarget);
    $(`.step-wrap[data-step-label-wrap="${currentTabHead}"]`).removeClass("active");
  })
  
  // Change Event role on base on event type
  $(document).on("click", ".event-type-section-wrap .Squer-radio-button-inner", function () {
    var selectEventType = $(this).find(`[name="event-type"]`).val();
    selectEventType = selectEventType.toLowerCase();
    $(".event-page-new-design-wrapper .role-in-event-wrap .Squer-radio-button-inner").addClass("hidden");
    $(`.event-page-new-design-wrapper .role-in-event-wrap .Squer-radio-button-inner[data-class="${selectEventType}"]`).removeClass("hidden");
  })

  // popup open
  $(document).on("click",".popup-button",function(){
    var targetEl = $(this).attr("data-title");
    $(`.modal-wrapper`).removeClass("active");
    $(`.modal-wrapper[data-target="${targetEl}"]`).addClass("active");
    $(`html,body`).css({
      "overflow" : "hidden"
    })
  })

  // popup close 
  $(".modal-wrapper .close-icon").click(function(){
    $(this).closest(".modal-wrapper").removeClass("active");
    $(".show-look-from-event-wrapper").show();
    $(".create-event-look .event-block-wrap").hide();
    $(`html,body`).css({
      "overflow" : "auto"
    })
  })

  // Add new Look into event 
  $(document).on("click",".show-look-from-event-wrapper .add-look-wrapper",function(){
    $(this).closest(".show-look-from-event-wrapper").hide();
    $(this).closest(".step-content-wrapper").find(".event-block-wrap").show();
  })

  // open add guest member popup  
  $(document).on("click",".add-guest-button", function(){
    $(".look-dropdown").find(".look-name").attr("data-look-mapping-id",'').text('');
    $(`.modal-wrapper[data-target="add-guest-popup"]`).addClass("active");
    $(`[name="is_host_paying"]`).prop('checked', false);
    $(`[type="text"],[type="tel"]`).val('');
    var look_id = $(this).closest(".look-card-block").attr("data-look-id");
    var look_title = $(this).closest(".look-card-block").find(".look-title").text();
    $(".look-dropdown").find(".look-name").attr("data-look-mapping-id",look_id).text(look_title);
  })
}
theme_custom.calender = function(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();        
  today = yyyy + '-' + mm + '-' + dd;
  $('#event_date').attr('min',today);
}
theme_custom.eventLookSlider = function(){
  if($('.create-event-look .event-look-inner-wrapper .look-card-block').length > 2){
    $('.create-event-look .event-look-inner-wrapper').slick({
      slidesToShow: 2,
      slidesToScroll: 2,
      infinite: false,
      speed: 300,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    });
  }
}
theme_custom.guestLooksSlider = function(){
  if($('.guest-top-looks .event-look-inner-wrapper .look-card-block').length > 2){
    setTimeout(() => {
      $('.guest-top-looks .event-look-inner-wrapper').slick({
        adaptiveHeight: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: false,
        speed: 300,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            }
          }
        ]
      });
    }, 200);
  }
}
theme_custom.changeFilled = function() {
  $(document).on(`change`, `#EventForm-EventName, [name="event-type"], #event_date, [name="event-role"], .phone-number`, function() {
    console.log($(this).val());
    theme_custom.checkUpdateEvent("event_name",$(this).val(),$(this).attr("data-id"));
  });
}
theme_custom.event_init_page = function(){
  theme_custom.eventPageClickEvent();
  theme_custom.calender();
  theme_custom.favoriteLooks();
  // theme_custom.changeFilled();
  $('.event-page-new-design-wrapper .event-name').bind("keypress keyup keydown", function (e) {
    theme_custom.eventReminderTitleValidation($(this));
  });
  $(document).on('change', 'input[name="event-type"]', function () {
    $('.event-type-section-wrap .form-error').removeClass('active');
  });
  $(document).on('change', 'input[name="event-role"]', function () {
    $('.role-in-event-wrap .form-error').removeClass('active');
  });
  $(document).on('change', '#event_date', function () {
    $('.event-date-wrap .form-error').removeClass('active');
  });
}
theme_custom.getEventDetails = function(){
  $(".step-content-wrapper").removeClass("active");
  var eventId = localStorage.getItem("set-event-id");
  $("#event-id").val(localStorage.getItem("set-event-id"));
  $.ajax({
    url: `${theme_custom.base_url}/api/event/${eventId}`,
    method: "GET",
    data: '',
    dataType: "json",
    headers: {
      // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      console.log("Rsult",result);
      eventDataObj.eventName = result.data.event_name;
      eventDataObj.eventType = result.data.event_type;
      eventDataObj.eventDate = result.data.event_date;
      eventDataObj.eventRole = result.data.event_role;
      // set Event Data
      $("#event-name").val(result.data.event_name);
      $("#event-type").val(result.data.event_type);
      $("#event-date").val(result.data.event_date);
      $("#event-role").val(result.data.event_role);

      $('#EventForm-EventName').val(result.data.event_name);
      $('#EventForm-id').val(result.data.event_id);
      if(result.data.event_type == 'Special Event'){
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="special event"]`).removeClass("hidden");
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="wedding"]`).addClass("hidden");
      }else{
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="wedding"]`).removeClass("hidden");
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="special event"]`).addClass("hidden");
      }
      $(`.Squer-radio-button-inner input[name="event-type"][value="${result.data.event_type}"]`).prop('checked', true);
      $(`.Squer-radio-button-inner input[name="event-role"][data-value="${result.data.event_role}"]`).prop('checked', true);
      $('#event_date').val(result.data.event_date);
      $.each(result.data.event_members,function(index,value){
        if(value.is_host == "1"){
          eventDataObj.eventPhone = value.phone.replace("+1","");
          $("#event-phone-number").val(value.phone.replace("+1",""));
          $('#EventForm-EventOwnerContactNumber').val(value.phone.replace("+1","")).trigger("keyup");
        }
      });  
      $(".create-event-button").addClass("next-button").removeClass("create-event-button");    
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapeper").removeClass("hidden");
      $(`.step-content-wrapper[data-step-content-wrap="1"]`).addClass("active");
      $(`.step-content-wrapper[data-step-content-wrap="1"]`).find(".event-update-button").removeClass("disabled").removeClass("hidden")
      // theme_custom.checkLooks(eventId);
      console.log("eventData",eventDataObj);
    },
    error: function (xhr, status, error) {
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.getapi_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        var erroData = '';
        erroData = '<p>' + xhr.responseJSON.message + '</p>';
        $('.getapi_error').show().html(erroData);
      }
    }
  });
}
theme_custom.deleteTheLooksItem = function () {
  $(document).on('click', '.delete-icon', function() {
    var eventLookId = $(this).data('event-look-id'),
      confirms = confirm("Are you sure you want to remove this?"),
      removeSelectedLook = $(this).closest(`.look-card-block[data-look-mapping-id="${eventLookId}"]`);
    if (eventLookId && confirms) {
      if (eventLookId) {
        $(".event-page-new-design-wrapper").find(".loader-wrapper").removeClass("hidden");
        $(".event-page-new-design-wrapper").find(".event-step-wrapeper").addClass("hidden");
        $.ajax({
          url: `${theme_custom.base_url}/api/look/removeFromEvent/${eventLookId}`,
          method: "DELETE",
          data: '',
          dataType: "json",
          headers: {
            "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
          },
          beforeSend: function () {
            // $('.favorite-looks-wrapper').css('cursor','not-allowed');
          },
          success: function () {
            removeSelectedLook.remove();
            if($(".show-look-from-event-wrapper").find(".look-card-block").length == 0){
              $(".step-content-wrapper.create-event-look").find(".event-block-wrap").show();
              $(".step-content-wrapper.create-event-look").find(".show-look-from-event-wrapper").hide();
            }
            setTimeout(() => {
              $(".event-page-new-design-wrapper").find(".loader-wrapper").addClass("hidden");
              $(".event-page-new-design-wrapper").find(".event-step-wrapeper").removeClass("hidden");
              theme_custom.checkLooks(localStorage.getItem("set-event-id"));
            }, 1000);
          },
          error: function (xhr, status, error) {
            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
              alert('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>');
              setTimeout(() => {
                theme_custom.removeLocalStorage();
                window.location.href = '/account/logout';
              }, 5000);
            } else {
              alert(xhr.responseJSON.message);
            }
          }
        });
      }
    }
  });
}
theme_custom.checkUpdateEvent = function(checkEventData,value,selector){
  console.log("selector",selector, "value",value);
  if((selector == 'event-name' && (checkEventData == "event_name" && eventDataObj.eventName != value)) || (selector == 'event-date' && (checkEventData == "event_name" && eventDataObj.eventDate != value)) || (selector == 'event-type' && (checkEventData == "event_name" && eventDataObj.eventType != value)) || (selector == 'event-phone' && (checkEventData == "event_name" && eventDataObj.eventPhone != value)) || (selector == 'event-role' && (checkEventData == "event_name" && eventDataObj.eventRole != value))){
    $(".event-update-button").removeClass("disabled");
  } else {
    $(".event-update-button").addClass("disabled");
  }
}
$(document).ready(function() {
  // theme_custom.updateEvent();
  window.eventDataObj = {};
  theme_custom.deleteTheLooksItem();
  theme_custom.event_init_page(); 
  if(localStorage.getItem("set-event-id") != null) {
    theme_custom.getEventDetails();
  } else {
    setTimeout(() => {
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapeper").removeClass("hidden");
    }, 1000);
  }
  if(localStorage.getItem("back-to-event-page") != null){
    setTimeout(() => {
      $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
      localStorage.removeItem("back-to-event-page");
    }, 2000);
  }
  if(localStorage.getItem("go-to-event-page") != null){
    setTimeout(() => {
      $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
      localStorage.removeItem("go-to-event-page");
    }, 2000);
  }
})
