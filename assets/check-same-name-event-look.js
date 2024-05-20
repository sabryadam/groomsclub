//Favorite Looks API
// const APP_Token = 'Bearer ' + localStorage.getItem("customerToken")

// favorite-event-api-button Click Event 
$(document).on("click", ".favorite-event-api-button", function (e) {
  var button = $(this);

  if(window.location.pathname != '/pages/customize-your-look'){
    theme_custom.favoriteButtonEvent(button);
  }else{
    if(localStorage.getItem("editLookName")!=null && localStorage.getItem("editLookId")!=null){
      theme_custom.favoriteLookUpdate(button);
    } else {
      theme_custom.favoriteButtonEvent(button);
    }
  }
})


// Favorite Look added
theme_custom.favoriteButtonEvent = function (eventButton) {
  var error_count = 0,
    button = eventButton;
  error_count = error_count + theme_custom.textValidationWithSpacialChar(button.closest(".favourite-look-wrapper").find('[name="look-name"'));
  if (error_count > 0) {
    return false;
  } else {
    var lookName = button.closest(".favourite-look-wrapper").find("#look-name").val();
    var lookUrl = window.location.href;
    var produArray = theme_custom.prodArray;
    lookName = lookName.trim();
    let lookExist = theme_custom.favLooks.find((item)=> item.name.toLowerCase() == lookName.toLowerCase());
    if(lookExist){
      $(button).closest(".favourite-look-wrapper").find(".form-error:first").text("Look name already exist. Please Enter another Name!").addClass("active");
    }else{
      button.find(".loading-overlay").removeClass("hidden");
      button.addClass("disabled");
      button.find('.button-title').text(button.attr("data-text"));
      if(window.location.pathname != '/pages/customize-your-look'){
        lookUrl = `/pages/customize-your-look?${theme_custom.customizeURLData}`;
      }
      theme_custom.favouriteLookApi(lookName, lookUrl, produArray, button);
    }
  }
}

// Favorite Look Update
theme_custom.favoriteLookUpdate = function (eventButton) {
  var error_count = 0,
    button = eventButton;
  error_count = error_count + theme_custom.textValidationWithSpacialChar(button.closest(".favourite-look-wrapper").find('[name="look-name"'));
  if (error_count > 0) {
    button.removeClass("disabled");
    button.find(".loading-overlay").addClass("hidden");
    button.find(".button-title").text("Add to Favorite");
    return false;
  } else {
    button.find(".loading-overlay").removeClass("hidden");
    button.find(".button-title").text(button.attr("data-text"));
    var lookName = button.closest(".favourite-look-wrapper").find("#look-name").val(),
      lookUrl = window.location.href;
    produArray = theme_custom.prodArray;
    if(localStorage.getItem('editLookId')!='' && localStorage.getItem('editLookName')!=''){
      var favid = localStorage.getItem('editLookId');
      favorite_api_url = `${theme_custom.base_url}/api/look/removeFromFavourite/${favid}`;  
      $.ajax({
        url: favorite_api_url,
        method: "DELETE",
        data: '',
        dataType: "json",
        headers: {
          "Authorization": APP_Token
        },
        beforeSend: function () {},
        success: function (result) {
          theme_custom.favouriteLookApi(lookName, lookUrl, produArray, button);
        },
        error: function (xhr, status, error) {
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
    } else {
      theme_custom.favouriteLookApi(lookName, lookUrl, produArray, button);
    }
  }
} 

// theme_custom.favouriteLookApi
theme_custom.favouriteLookApi = function (lookName, lookUrl, produArray, button) {
  eventData = {
    "look_name": lookName,
    "url": lookUrl,
    "favourite": "1",
    "items": produArray
  }
  button.addClass("disabled");
  $.ajax({
    url: `${theme_custom.api_base_url}/api/look/favourite`,
    method: "POST",
    data: eventData,
    dataType: "json",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      var lookID = result.data.lookId;
      theme_custom.favoriteLookImageCustomizer(lookID, button);
    },
    error: function (xhr, status, error) {
      button.removeClass("disabled").text("Add Favorite Look");
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.favourite-look-api-message').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').removeClass("hidden").show().css({
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
          if (xhr.responseJSON.data.favourite != undefined) {
            for (let i = 0; i < xhr.responseJSON.data.favourite.length; i++) {
              event_date_msg += `<span>${xhr.responseJSON.data.favourite[i]}</span>`;
            }
          } else {
            event_date_msg += `<span class="normal-error">${xhr.responseJSON.data}</span>`;
          }
        } else {
          event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
        }
        $('.favourite-look-api-message').html(event_date_msg).removeClass("hidden").show();
        setTimeout(() => {
          $(".favourite-look-api-message").addClass("hidden").hide();
        }, 3000);
      }
    }
  });
}

theme_custom.getFavoriteLooks = function(callback) {
  var favorite_api_url = theme_custom.api_base_url + '/api/look/favouriteLooks';
  $.ajax({
    url: favorite_api_url,
    method: "GET",
    data: '',
    dataType: "json",
    headers: {
        "Authorization": APP_Token
    },
    success: function (result) {
      callback(result.data)
      // theme_custom.favLooks = result.data;
    },
    error: function (xhr, status, error) {
      callback([])
    }
  });
}
  
  
// add-event-look-api-button Click Event 
$(document).on("keyup", ".create-event-look .custom-text-filed", function(e){
  $(this).closest(".create-event-look").find(".form-error").removeClass("active");
});
$(document).on("click", ".add-event-look-api-button", function (e) {
  var button = $(this);
  theme_custom.addLookToEvent(button);
})

theme_custom.addLookToEvent = function (eventButton) {
  var error_count = 0,
    button = eventButton;
  error_count = error_count + theme_custom.textValidationWithSpacialChar(eventButton.closest(".create-event-look").find('[name="look-name"'));
  if (eventButton.closest(".create-event-look").find("#event-id").val() == '') {
    eventButton.closest(".create-event-look").find("select").next(".form-error").text("Please Select Event Name!").addClass("active");
    error_count = 1;
  }
  if (error_count > 0) {
    button.removeClass("disabled")
    button.find(".loading-overlay").addClass("hidden");
    button.find(".button-title").text("Add to Event");
    return false;
  } else {

    // if(window.location.pathname != '/pages/customize-your-look'){
      var productDataCardArr = $(".product-data-card");
      theme_custom.customizeURLData  = '';
      if(window.location.pathname != '/pages/customize-your-look'){
        theme_custom.customizeURLData += $(`.product-data-card-wrap[data-product-type="looks"]`).find(".looks-product-handle").val() + '=' + $(`.product-data-card-wrap[data-product-type="looks"]`).find(".product-variant-id").val() + '&';
      }
      $.each(productDataCardArr, function(index, value) {
        var customizeURL = ''
        var isLastElement = index == productDataCardArr.length -1;
        if (isLastElement) {
          customizeURL = $(this).find(".looks-product-handle").val() + '=' + $(this).find(".product-variant-id").val();
        } else {
          customizeURL = $(this).find(".looks-product-handle").val() + '=' + $(this).find(".product-variant-id").val() + '&';
        }
        theme_custom.customizeURLData += customizeURL;
      });
    // }

    var lookName = eventButton.closest(".create-event-look").find("#look-name").val(),
      eventId = eventButton.closest(".create-event-look").find("#event-id").val(),
      // lookUrl = window.location.href;
      lookUrl = `/pages/customize-your-look?${theme_custom.customizeURLData}`;
      produArray = theme_custom.newArray;
      lookName = lookName.trim(0);
    let lookNameExist = theme_custom.selectedEventLooks.find((item)=> item.name.toLowerCase() == lookName.toLowerCase());
    if($(".template-page-customize-your-look").length > 0) {
      if(localStorage.getItem("customize-from-event") != null){
        lookNameExist = false;
      }
    }
    if(lookNameExist){
      $(eventButton).closest(".create-event-look").find("select").next(".form-error").text("Look name already exist. Please Select another Event Name!").addClass("active");
    }else{
      button.addClass("disabled")
      button.find(".loading-overlay").removeClass("hidden");
      button.find(".button-title").text(button.attr("data-text"));
      theme_custom.customizeLookAPI(lookName, eventId, lookUrl, produArray, button);
      // theme_custom.createLookAPI(lookName,eventId,lookUrl,produArray,button);
    }
  }
}

$(document).on("change",".create-event-look #event-id", function() {
  $(this).next(".form-error").removeClass("active")
  theme_custom.getEventDetailsByID($('#event-id').val());
});
theme_custom.getEventDetailsByID = function (eventId) {
  $('.page-loader').css({'z-index': '100000'})
  $('.page-loader').removeClass('hidden')
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
      theme_custom.selectedEventLooks = result.data.event_looks;
      $('.page-loader').css({'z-index': '1200'})
      $('.page-loader').addClass('hidden')
    },
    error: function (xhr, status, error) {
      $('.page-loader').css({'z-index': '1200'});
      $('.page-loader').addClass('hidden');
    }
  });
}

// theme_custom.customizeLookAPI
theme_custom.customizeLookAPI = function (lookName, eventId, lookUrl, produArray, button) {
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
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      var lookID = result.data.lookId;
      theme_custom.LookImageCustomizer(getEventId, lookID, button);
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
        button.removeClass("disabled").text("Add Event");
        $(".look-api-message").text(xhr.responseJSON.message).removeClass("hidden");
        setTimeout(() => {
          $(".look-api-message").addClass("hidden");
        }, 3000);
      }
    }
  });
}

// theme_custom.LookImageCustomizer
theme_custom.LookImageCustomizer = function (getEventId, lookID, button) {
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
      if(localStorage.getItem("customize-from-event") != null){
        $(".look-api-message").text("Look Updated Successfully ").addClass("sucess-msg").removeClass("hidden").show();
        setTimeout(() => {
          $(".look-api-message").addClass("hidden");
          localStorage.removeItem("customize-from-event");
          localStorage.removeItem("eventLookId");
          localStorage.removeItem("eventLookName");
          localStorage.removeItem("customizerlookUrl");
          localStorage.removeItem("customise-look-button-for-add-look-into-event");
          button.removeClass("disabled");
          button.find(".button-title").text("Look Updated");
          button.find(".loading-overlay").addClass("hidden");
          localStorage.setItem("back-to-event-page","true");
          window.location.href = `/pages/create-event`;
        }, 5000);
      }else if(localStorage.getItem("customise-look-button-for-add-look-into-event") != null){
        setTimeout(() => {
          localStorage.removeItem("customise-look-button-for-add-look-into-event");
          localStorage.removeItem("customizerlookUrl");
          button.removeClass("disabled");
          button.find(".button-title").text("Look Added");
          button.find(".loading-overlay").addClass("hidden");
          localStorage.setItem("back-to-event-page","true");
          window.location.href = `/pages/create-event`;
        }, 5000);
      } else { 
        $(".look-api-message").text("Look Successfully added to Event").addClass("sucess-msg").removeClass("hidden").show();
        setTimeout(() => {
          localStorage.setItem("set-event-id",$("#event-id").val())
          localStorage.setItem("set-event-id",getEventId);
          localStorage.setItem("go-to-event-page","true")
          localStorage.removeItem("customizerlookUrl");
          $(".look-api-message").addClass("hidden");
          button.removeClass("disabled");
          button.find(".loading-overlay").addClass("hidden");
          button.find(".button-title").text("Added To Event");
          window.location.href = `/pages/create-event`;
        }, 5000);
      }
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