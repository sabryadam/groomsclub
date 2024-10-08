// event-new-development
theme_custom.base_url = theme_custom.api_base_url;
theme_custom.eventFavLooks = [];
theme_custom.allEvents = [];
theme_custom.globalEventData = null;
theme_custom.eventExpire = false;
const APP_Token = 'Bearer ' + localStorage.getItem("customerToken");
theme_custom.reminder = function (sendReminderDataObj, button) {
  $.ajax({
    url: `${theme_custom.base_url}/api/reminder/create`,
    method: "POST",
    data: sendReminderDataObj,
    dataType: "json",
    async: true,
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      button.addClass("disabled");
    },
    success: function (result) {
      button.addClass("disabled");
      $('.api_error').addClass("success-event").show().html(result.message);
      setTimeout(() => {
        $('.api_error').removeClass("success-event").html('').hide();
        button.removeClass("disabled");
        $(".send-via-main .send-via").prop("checked",false);
        $('.modal-wrapper.reminder-redesign-popup').removeClass("active");
      }, 3000);
      $('html,body').css({
        'overflow' : "auto"
      })
    },
    error: function (xhr, status, error) {
      button.removeClass('disabled')
      $('html,body').css({
        'overflow' : "auto"
      })
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
        if(xhr.responseJSON.message == 'Internal server error.'){
          alert(`${xhr.responseJSON.data} !`)
        } else {
          alert(`${xhr.responseJSON.message} !`)
        }
      }
    }
  });
};

theme_custom.lookAssignToMember = function (member_id, look_id) {
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
    async: true,
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      $(this).addClass("disabled");
    },
    success: function (result) {
      theme_custom.checkLooks(localStorage.getItem("set-event-id"));
      $('[data-target="add-guest-popup"]').removeClass('active');
      $('.member-added-into-event').removeClass('disabled');
      $.ajax({
        url: `${theme_custom.base_url}/api/event/${localStorage.getItem("set-event-id")}`,
        method: "GET",
        data: '',
        dataType: "json",
        async: true,
        headers: {
          // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        beforeSend: function () {
        },
        success: function (result) {
          var memerData = '';
          var total = result.data.event_members.length;
          var event_member = '';
          $.each(result.data.event_members, function (index, value) {
            if(value.is_host == 1){
              event_member = '';
            } else {
              event_member = 'event-member';
            }
            if (value.is_host == 1) {
              eventDataObj.eventPhone = value.phone.replace("+1", "");
              $("#event-phone-number").val(value.phone.replace("+1", ""));
              $('#EventForm-EventOwnerContactNumber').val(value.phone.replace("+1", "")).trigger("keyup");
            }
            if (index === total - 1) {
              memerData += `<span type="text" class="reminderMember ${event_member}" name="reminderMember" data-member-id="${value.event_member_id}" style="font-size: 14px;">${value.first_name} ${value.last_name}</span>`
            } else {
              memerData += `<span type="text" class="reminderMember ${event_member}" name="reminderMember" data-member-id="${value.event_member_id}" style="font-size: 14px;">${value.first_name} ${value.last_name},</span>`
            }
          });
          $('.reminder-redesign-popup .event-member-data').html('');
          $('.reminder-redesign-popup .event-member-data').append(memerData);
          $('html,body').css({
            'overflow' : "auto"
          })
        }
      });
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
        alert(xhr.responseJSON.message);
      }
      $('html,body').css({
        'overflow' : "auto"
      })
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapper").removeClass("hidden");
    }
  });
}

$(".member-added-into-event").click(function (e) {
  e.preventDefault();

  theme_custom.lookVal = $(this).closest(".add-guest-inner-wrapper").find(".look-name").attr("data-look-mapping-id")
  var parent = $(this).closest('.invite-another-member-popup-wrapper');
  var updateGuest = false;
  if ($(this).hasClass('update-guest')) {
    updateGuest = true
  }
  var error_count = 0,
    eventId = localStorage.getItem("set-event-id"),
    button = $(this);
  if($(`.custom-checkobx`).find(`[type="radio"]:checked`).length == 0){
    $('.custom-checkobx').find(".form-error").show();
    error_count = error_count + 1;
  } else {
    $('.custom-checkobx').find(".form-error").hide();
    if($(this).hasClass('update-guest') && error_count == 1){
      error_count = 1;
    } else {
      error_count = 0;
    }
  }
  error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('.member-first-name'));
  error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('.member-last-name'));
  error_count = error_count + theme_custom.emailValidation(parent.find('.member-email'));
  error_count = error_count + theme_custom.phoneValidation(parent.find('.member-phone'));
  
  if(error_count == 1) {
    return
  }
  if (error_count == 0) {
    var memberFirstName = $(".member-first-name", parent).val();
    var memberLastName = $(".member-last-name", parent).val();
    var memberEmail = $(".member-email", parent).val();
    var memberPhone = $(".member-phone", parent).val().replace('(', '').replace(' ', '').replace(')', '').replace('-', '');
    var hostPayInfo = $(".field.form-wrap.custom-checkobx span.custom_checkbox input[type=radio]:checked", parent).data('val');
  }
  var member_info_data = {
    "first_name": memberFirstName,
    "last_name": memberLastName,
    "email": memberEmail,
    "phone": memberPhone,
    "is_host_paying": hostPayInfo
  }

  let url = `${theme_custom.base_url}/api/event/addMember/${eventId}`;
  let method = "POST"
  if (updateGuest) {
    method = 'PUT';
    url = `${theme_custom.base_url}/api/event/editMember/${eventId}/${$(this).attr('data-member-id')}`;
  }
  if (error_count == 0) {
    $(this).addClass("loading");

    $.ajax({
      url: url,
      method: method,
      data: member_info_data,
      dataType: "json",
      crossDomain: true,
      async: true,
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        if(result.message == 'Member already exist in event.'){
          $(`<p class="member-error-msg" style="display: block;color: #fff!important;background-color: #7dce80!important;padding: 10px 5px;line-height: 1;text-align: center;border-radius: 5px;">${result.message}</p>`).insertAfter($(`[data-step-content-wrap="2"] [data-target="add-guest-popup"] .custom-checkobx.paying-wrap`));
          setTimeout(function() {
            $(`p.member-error-msg`).remove();
            $('.event-step-wrapper').addClass('hidden');
            theme_custom.globalLoaderShow();
            theme_custom.lookAssignToMember(result.data.id, theme_custom.lookVal);
          },5000)
        } else {
          $('.event-step-wrapper').addClass('hidden');
          theme_custom.globalLoaderShow();
          theme_custom.lookAssignToMember(result.data.id, theme_custom.lookVal);
        }
      },
      error: function (xhr, status, error) {
        let div = $('.invite-another-member-popup-wrapper .member-added-into-event').closest('.field');
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          $(div).prepend('<p class="error-member-added-into-event api_error" style="width: 100%;">Something went wrong <a class="try-again-link" href="/account/login">Please try again</a></p>').css({
            'text-align': 'center',
            'color': 'red'
          });
          setTimeout(() => {
            window.location.href = '/account/logout';
          }, 5000);
        } else {
          $(div).prepend(`<p class="error-member-added-into-event api_error" style="width: 100%;">${xhr.responseJSON.message}</p>`);
        }
        setTimeout(() => {
          let error = $('.invite-another-member-popup-wrapper .error-member-added-into-event')
          if (error) {
            error.fadeOut()
          }
          $(`.invite-another-member-popup-wrapper .member-added-into-event,[data-target="update-guest-popup"] .member-added-into-event,[data-target="add-guest-popup"] .member-added-into-event`).removeClass('loading')
        }, 5000);
      }
    });
  }
});

theme_custom.user = (user) => {
  var status_class = '';
  let { email, first_name, last_name, phone, status, is_host_paying, is_host } = user;
  var phone_val;
  if(phone != null) {
    if (phone.indexOf('+1') == -1){
      phone_val = `+1${phone}`
    } else {
      phone_val = phone
    }
  }
  let whoPay = "", eventOwner = '';
  if (is_host_paying.toLowerCase() == "self") {
    whoPay = "I pay";
  } else {
    whoPay = "They Pay";
  }
  if(is_host == 1 ){
    eventOwner = 'event-owner';
  } else {
    eventOwner = '';
  }
  // console.log("user.order_number",user.order_number);
  // if(status == 'In Progress'){
  //   status = 'Not Ordered'
  //   status_class = 'not-ordered'
  // } else {
  //   status = 'Ordered',
  //   status_class = 'ordered'
  // }

  if(user.order_number == null){
    status = 'Not Ordered'
    status_class = 'not-ordered';
  } else {
    status = 'Ordered',
    status_class = 'ordered';
  }

  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var showCurrentDate = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day  + '/' + d.getFullYear();  
  var currentDate = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
  const deleteIcon = `<div class="member-delete-icon payment-${status_class}" data-member-id="${user.event_member_id}">
      <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/delete.png" alt="delete icon" />
    </div>`
  return `<div class="user-card-block ${eventOwner}">
    <div class="action-icon">
      <span class="edit-icon">
        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/pencil.png?v=1678738737" alt="Edit Icon">
      </span>
      ${user.is_host == 0 ? deleteIcon : ''}
    </div>
    <h3 class="user-name">${first_name} ${last_name}</h3>
    <div class="user-email-phone">
      <span class="user-email">${email}</span>
      <span class="user-phone"> | ${phone_val}</span>
    </div>
    <div class="size-selected-info">
      <div class="size-selected-wrap">
        <span class="size-select-check ">status : <span class="${status_class}">${status}</span></span>
        <span class="reminder-wrap user-${status_class}" data-member-id="${user.event_member_id}">REMINDER</span>
      </div>
      <spa class="pay-status" pay-info="${whoPay}">${whoPay}</span>
    </div>
    <script type="application/json" class='user-data-script'> ${JSON.stringify(user)} </script>
  </div>`
}
theme_custom.createLookHtml = (index, div, item, eventMembers, event_id) => {
  var lookHaveMember = '';
  if (item.assign == true) {
    lookHaveMember = 'look-have-member';
  }
  let users = "";
  if (item.look_id) {
    for (let i = 0; i < eventMembers.length; i++) {
      let user = eventMembers[i];
      if (user.look_id) {
        if (parseInt(user.look_id) == item.look_id) {
          users = users + theme_custom.user(user);
        }
      }
    }
  }
  let host = eventMembers.find((member) => member.is_host == 1);
  let lookAssignedUser = false;

  if (parseInt(host.look_id) == item.look_id) {
    lookAssignedUser = true;
  }


  let hostLookHTML = `<div class="pay-info-confirmation-wrap">
    <div class="title">Are you wearing this look?</div>
    <div class="confirm-box-wrap">
      <span class="update-host-look ${lookAssignedUser ? 'active' : ''}" data-value="yes">Yes</span>
      <span class="update-host-look no" data-value="no">No</span>
    </div>
  </div>`

  div.append(`<div class="look-card-block-${index} look-card-block" data-event-id="${event_id}" data-look-name="${item.name}" data-host-id="${host.event_member_id}" data-look-mapping-id="${item.mapping_id}" data-look-id="${item.look_id}">
    <div class="look-title-and-price">
      <div class="look-title">${item.name}</div>
      <div class="look-price-wrap">
        <span class="look-price">$199.99</span>
      </div>
    </div>
    <div class="look-image">
      <div class="delete-icon ${lookHaveMember}" data-event-look-id="${item.mapping_id}">
        <span>Delete</span>
      </div>
      <img class="look-img" src="${item.look_image}" alt="${item.name}" />
      <button data-href="${item.url}" edit-look-id="${localStorage.getItem("set-event-id")}" look-mapping-id="${item.mapping_id}" edit-look-name="${item.name}" class="button button--primary customise-look customise-look-button ${lookHaveMember}">Edit look</button>
    </div>
    ${hostLookHTML}
    <div class="assign-look-user-wrap">${users}</div>
    <div class="text-center">
      <button class="add-guest-button">+ ADD GUEST</button>
    </div>
  </div>`)
}

// Get Favorite Looks
theme_custom.favoriteLooks = function () {
  var favorite_api_url = `${theme_custom.base_url}/api/look/favouriteLooks`;
  var favorite_look_image = 'https://cdn.shopify.com/s/files/1/0585/3223/3402/files/product-img-3.png?v=1634963523';
  $.ajax({
    url: favorite_api_url,
    method: "GET",
    data: '',
    dataType: "json",
    async: true,
    headers: {
      "Authorization": APP_Token
    },
    beforeSend: function () {
    },
    success: function (result) {
      if (result.success) {
        theme_custom.eventFavLooks = result.data;
        if (result.data.length > 0) {
          var append_fav_html = "";
          $('#choose-form-favorite .product-wrapper').html(append_fav_html);
          var edit_link = '';
          for (var i = 0; i < result.data.length; i++) {
            var productArray = result.data[i].items;
            var itemData = '';
            var productType = ''
            for (var items = 0; items < productArray.length; items++) {
              if (productArray[items].handle.includes('suit')) {
                productType = `looks`
              } else if (productArray[items].handle.includes('jacket')) {
                productType = 'jacket'
              } else if (productArray[items].handle.includes('pants')) {
                productType = 'pants'
              } else if (productArray[items].handle.includes('vest')) {
                productType = 'vest'
              } else if (productArray[items].handle.includes('shoes')) {
                productType = 'shoes'
              } else if (productArray[items].handle.includes('neckties')) {
                productType = 'neckties'
              } else if (productArray[items].handle.includes('hanky')) {
                productType = 'hanky'
              } else if (productArray[items].handle.includes('shirt')) {
                productType = 'shirt'
              } else if (productArray[items].handle.includes('bow-ties')) {
                productType = 'bow-ties'
              } else if (productArray[items].handle.includes('belt')) {
                productType = 'belt'
              }

              itemData += `<div class="product-data-card" data-product-handle="${productArray[items].handle}" data-product-type="${productType}">
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
            append_fav_html += `<div class="product-card" data-id="${result.data[i].id}" data-name="${result.data[i].name}">
              <div class="img">
                <img src="${favorite_look_image}" alt="favourite-look-img">
              </div>
              <div class="product-info">
                <div class="bundle-product-wrapper">${itemData}</div>
                <h4 class="product-title">${result.data[i].name}</h4>
                <p class="product-price">Starting at $199.99</p>
                <p class="taxes-text">Price Includes Jacket and Pants</p>
                <button class="button button--secondary added-look-into-event" data-text="Adding...">Add To Event</button>
              </div>
            </div>`;
          }
          $('#choose-form-favorite .product-wrapper').html(append_fav_html);
        } else {
          var html = `<div class="empty-message text_center"> You haven't saved any Favorite Looks yet.</div>`;
          $('#choose-form-favorite .product-wrapper').html(html);
          $("#choose-form-favorite").addClass("empty-fav-look-wrapper");
          $("#choose-form-favorite").css({
            "height" : "auto"
          })
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

theme_custom.checkLooks = (id, nextTarget, trigger = true) => {
  if (!trigger) {
    theme_custom.globalEventData.data.event_looks = theme_custom.globalEventData.data.event_looks.reverse();
    theme_custom.successCallback(theme_custom.globalEventData, nextTarget)
    return
  }

  fetch(`${theme_custom.base_url}/api/event/${id}`, {
    method: "GET",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
  }).then((data) => data.json())
    .then((data) => {
      var eventLooks = data.data.event_looks;
      if(eventLooks.length > 0){
        $(".create-event-look").find(".next-button").removeClass("event-has-not-look");
        $(".create-event-look .event-block-wrap").find(".error-message").removeClass("error-show");
      }
      theme_custom.globalEventData = data
      theme_custom.successCallback(data, nextTarget);
    });
}

theme_custom.successCallback = (data, nextTarget) => {
  data.data.event_looks = data.data.event_looks.reverse();
  let eventMembers = data.data.event_members;
  if (data.data.event_looks && data.data.event_looks.length > 0) {
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).removeClass("active");
    $('html,body').css({
      "overflow" : "auto"
    })
    const looksDiv = $('.show-look-from-event-wrapper .event-look-inner-wrapper, .guest-top-looks .event-look-inner-wrapper');
    looksDiv.empty();
    if (looksDiv.hasClass("slick-initialized")) {
      looksDiv.removeClass("slick-initialized").removeClass("slick-slider");
    }
    $(`.invite-another-member-popup-wrapper .member-added-into-event,[data-target="update-guest-popup"] .member-added-into-event,[data-target="add-guest-popup"] .member-added-into-event`).removeClass('loading');
    for (let i = 0; i < data.data.event_looks.length; i++) {
      let item = data.data.event_looks[i];
      let index = i;
      theme_custom.createLookHtml(index, looksDiv, item, eventMembers, data.data.event_id);
      if($(".look-card-block .user-card-block.event-owner").length > 0){
        $(".look-card-block").find(".update-host-look.no").addClass('not-assign-event-owner')
        $(".look-card-block .user-card-block.event-owner").each(function(){
          $(this).closest(".look-card-block").find(".update-host-look.no").removeClass('not-assign-event-owner').addClass('assign-event-owner')
        })
      }
    }
    theme_custom.eventExpired(data.data);
    $(".close-icon").click();
    setTimeout(() => {
      theme_custom.lookItemsData(data);
      if ($('.create-event-look .event-look-inner-wrapper .look-card-block, .guest-top-looks .event-look-inner-wrapper .look-card-block').length > 2) {
        theme_custom.eventLookSlider();
      }
      $(`[data-target="remove-data-for-user"]`).removeClass("active");
      $(".step-content-wrapper.create-event-look .event-block-wrap").hide();
      $('.show-look-from-event-wrapper,.guest-top-looks').show();
      $('.guest-top-looks').removeClass("event-has-no-look").addClass("event-has-look");
      $(`.show_look_list`).addClass("event_has_look");
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapper").removeClass("hidden");
      if (nextTarget) {
        theme_custom.changeStep(nextTarget);
        // if($('.event-look-inner-wrapper').find(".look-card-block").length > 2){
        //   $('.event-look-inner-wrapper').slick('refresh');
        // }
      }
      $(".next-button.disabled").removeClass("disabled");
      if ($('.event-look-inner-wrapper').find(".look-card-block").length > 2) {
        $('.event-look-inner-wrapper').slick('refresh');
      }
      theme_custom.globalLoaderhide();
      $(".event-page-new-design-wrapper").find(".loader-wrapper").addClass("hidden");
      $(".event-page-new-design-wrapper").find(".event-step-wrapper").removeClass("hidden");
      if ($(`[data-step-content-wrap="2"] .user-card-block .pay-status[pay-info="I pay"]`).length > 0) {
        $(`[data-step-content-wrap="2"]`).find(".btn-wrap.next-button").removeClass("disabled");
        $(`.member-summary-wrapper`).find(".heading").text("Summary");
        $(".event-page-new-design-wrapper .button-wrapper").removeClass("active")
      } else {
        $(`.member-summary-wrapper`).find(".heading").addClass("text-center").text("You don't have any look for payment!");
        $(".event-page-new-design-wrapper .button-wrapper").addClass("active")
        $(`[data-step-content-wrap="2"]`).find(".btn-wrap.next-button").removeClass("disabled");
      }
      if($(`.step-content-wrapper[data-step-content-wrap="1"]`).length > 0){
        if ($('.event-step-1 .event-block-wrap .suit-color-wrapper').hasClass('slick-initialized')){
          $('.event-step-1 .event-block-wrap .suit-color-wrapper').slick('unslick');
        }      
        theme_custom.EventSuitColorWrapper();
      }
    }, 2000);
  } else {
    $(`[data-target="remove-data-for-user"]`).removeClass("active");
    $(".step-content-wrapper.create-event-look .event-block-wrap").show();
    $('.show-look-from-event-wrapper,.guest-top-looks').hide();
    $('.guest-top-looks').addClass("event-has-no-look");
    $(".loader-wrapper").addClass("hidden");
    $(`.show_look_list`).removeClass("event_has_look");
    $(".event-step-wrapper").removeClass("hidden");
    if (nextTarget) {
      theme_custom.changeStep(nextTarget);
      if ($('.event-look-inner-wrapper').find(".look-card-block").length > 2) {
        $('.event-look-inner-wrapper').slick('refresh');
      }
    }
    // $(".next-button.disabled").removeClass("disabled");
    theme_custom.globalLoaderhide();
  }
  // Check Event in Guest available or not 
  var checkTheyOtherUser = data.data.event_members;
  for (let i = 0; i < checkTheyOtherUser.length; i++) {
    if(checkTheyOtherUser[i].is_host == '0'){
      $(`.open-reminder-popup`).removeClass("disabled")
    } else {
      $(`.open-reminder-popup`).addClass("disabled")
    }
  }
}

theme_custom.changeStep = (index) => {
  $('.event-step-wrapper').removeClass('hidden');
  $(`.step-content-wrapper`).removeClass("acrive");
  $(`.step-content-wrapper[data-step-content-wrap="${index}"]`).addClass("active");
  $(`.step-wrap[data-step-label-wrap="${index}"]`).addClass("active");
}



theme_custom.updateEventAPI = function (btn) {
  var button = btn;
  var error_count = 0, button = btn,
    error_count = error_count + theme_custom.eventReminderTitleValidation($(".event-page-new-design-wrapper").find(".event-name"));
  if (error_count > 0) {
    $('html, body').animate({
      scrollTop: $('.event-type-block-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('[name="event-type"]:checked').length == 0) {
    $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').addClass('active');
    setTimeout(() => {
      $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').removeClass('active');
    }, 500);
    $('html, body').animate({
      scrollTop: $('.event-type-section-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-page-new-design-wrapper #event_date').val() == '') {
    $('.event-page-new-design-wrapper .event-date-wrap .form-error').addClass('active');
    setTimeout(() => {
      $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').removeClass('active');
    }, 500);
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .event-date-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('[name="event-role"]:checked').length == 0) {
    $('.event-page-new-design-wrapper .role-in-event-wrap .form-error').addClass('active');
    setTimeout(() => {
      $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').removeClass('active');
    }, 500);
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .role-in-event-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-phone-number .phone-number').val() == '') {
    $('.event-page-new-design-wrapper .event-phone-number .form-error').addClass('active');
    setTimeout(() => {
      $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').removeClass('active');
    }, 500);
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper .event-phone-number').offset().top - 120
    }, 1000);
    return false;
  }
  if (error_count == 0) {
    button.addClass('loading');
    var event_name = $('.event-page-new-design-wrapper .event-name').val();
    var event_type = $('.event-page-new-design-wrapper [name="event-type"]:checked').attr('data-event-type-id');
    var eventDate = $('.event-page-new-design-wrapper #event_date').val();
    var changeEventDateArr = eventDate.split('-');
    var changeEventDate = changeEventDateArr[2] + "-" + changeEventDateArr[0] + "-" + changeEventDateArr[1];
    var event_date = changeEventDate;
    var event_role = $('.event-page-new-design-wrapper [name="event-role"]:checked').attr('data-event-role-id');
    var event_phone = $('.event-page-new-design-wrapper .phone-number').val().replace('(', '').replace(' ', '').replace(')', '').replace('-', '');
    var event_suit_color = $(".suit-color-wrap.active").find(".suit-color-value").attr("data-value");
    var event_data = {
      "name": event_name,
      "event_type_id": event_type,
      "event_date": event_date,
      "event_role_id": event_role,
      "owner_phone_number": event_phone,
      "event_suit_color" : event_suit_color
    }
    var eventId = localStorage.getItem("set-event-id")
    $.ajax({
      url: `${theme_custom.base_url}/api/event/edit/${eventId}`,
      method: 'PUT',
      data: event_data,
      dataType: "json",
      async: true,
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
              if (xhr.responseJSON.data.length > 0) {
                for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                  var errorMsg = xhr.responseJSON.data[i];
                  var membererror = '';
                  $.each(errorMsg, function (key, value) {
                    membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                  })
                  event_date_msg += `<div>${membererror}</div>`;
                }
              } else {
                if(xhr.responseJSON.data.members != undefined){
                  for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                    event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
                  }
                } else {
                    event_date_msg += `<span>${xhr.responseJSON.data.owner_phone_number[0]}</span>`;
                }
                
              }
            }
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.api_error').fadeOut();
            btn.removeClass('loading');
            btn.find(".label").text("Update Event");
          }, 5000);
        }
      }
    });
  }
}

theme_custom.createEventAPI = function (btn) {
  var button = btn;
  var error_count = 0, button = btn,
    error_count = error_count + theme_custom.eventReminderTitleValidation($(".event-page-new-design-wrapper").find(".event-name"));
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
  if ($('.event-page-new-design-wrapper #event_date').val() == '') {
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
  let eventName = $(".event-page-new-design-wrapper").find(".event-name").val();
  if(eventName){
    eventName = eventName.trim();
    let eventExist = theme_custom.allEvents.find((item)=> item.name.toLowerCase() == eventName.toLowerCase());
    if(eventExist){
      $('#EventForm-EventName').next(".form-error").text(`Event name already exist. Please Select another Event Name!`).addClass("active");
      $('html, body').animate({
        scrollTop: $('.event-type-block-wrap').offset().top - 100
      }, 1000);
      return;
    }
  }
  
  if (error_count == 0) {
    button.addClass('loading disabled');
    var event_name = $('.event-page-new-design-wrapper .event-name').val();
    var event_type = $('.event-page-new-design-wrapper [name="event-type"]:checked').attr('data-event-type-id');
    var eventDate = $('.event-page-new-design-wrapper #event_date').val();
    var changeEventDateArr = eventDate.split('-');
    var changeEventDate = changeEventDateArr[2] + "-" + changeEventDateArr[0] + "-" + changeEventDateArr[1];
    var event_date = changeEventDate;
    var event_role = $('.event-page-new-design-wrapper [name="event-role"]:checked').attr('data-event-role-id');
    var event_phone = $('.event-page-new-design-wrapper .phone-number').val().replace('(', '').replace(' ', '').replace(')', '').replace('-', '');
    var event_suit_color = $(".suit-color-wrap.active").find(".suit-color-value").attr("data-value");
    var event_data = {
      "name": event_name,
      "event_type_id": event_type,
      "event_date": event_date,
      "event_role_id": event_role,
      "owner_phone_number": event_phone,
      "event_suit_color" : event_suit_color
    }
    $.ajax({
      url: `${theme_custom.base_url}/api/event/create`,
      method: 'POST',
      data: event_data,
      dataType: "json",
      async: true,
      headers: {
        "Authorization": APP_Token
      },
      beforeSend: function () {
        $(this).addClass("disable");
      },
      success: function (result) {
        if (result.success) {
          if (result.message == 'Event updated successfully.') {
            $('.step-content-wrapper.event-step-1 .api_error').show().html(result.message).css({
              "background-color": "#DFF2BF",
              "color": "#270"
            });
            button.find(".label").text("Event Updated");
            setTimeout(() => {
              localStorage.setItem("set-event-id", result.data.eventId);
              $(".create-event-button").addClass("next-button").removeClass("create-event-button").find(".look-add-btn").removeClass("hidden");
              $("#event-id").val(result.data.eventId);
              $(`.step-content-wrapper[data-step-content-wrap="1"]`).find(".api_error").addClass('hidden');
              $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
              button.find(".label").text("Update Event");
              button.removeClass('loading disabled');              
            }, 2500);
          } else {
            $('.step-content-wrapper.event-step-1 .api_error').show().html(result.message).css({
              "background-color": "#DFF2BF",
              "color": "#270"
            });
            localStorage.setItem("set-event-id", result.data.eventId);
            $("#event-id").val(result.data.eventId);
            setTimeout(() => {
              $(".create-event-button").addClass("next-button").removeClass("create-event-button").find(".look-add-btn").removeClass("hidden");
              $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
              button.removeClass('loading disabled');
              $(`.step-content-wrapper[data-step-content-wrap="1"]`).find(".api_error").addClass('hidden');
            }, 2500);
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
        } else if(xhr.responseJSON.message == 'Internal server error.'){
          event_date_msg += `<span>Internal server error.</span>`;
          $('.step-content-wrapper.event-step-1 .api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.step-content-wrapper.event-step-1 .api_error').fadeOut();
            $(".step-content-wrapper.event-step-1 .button-wrapper").find("button").removeClass("loading").removeClass("disabled");
          }, 5000);
        } else {
          var event_date_msg = '';
          if (xhr.responseJSON.data) {
            if (xhr.responseJSON.data.event_date != undefined) {
              for (let i = 0; i < xhr.responseJSON.data.event_date.length; i++) {
                event_date_msg += `<span>${xhr.responseJSON.data.event_date[i]}</span>`;
              }
            } else {
              if (xhr.responseJSON.data.length > 0) {
                for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                  var errorMsg = xhr.responseJSON.data[i];
                  var membererror = '';
                  $.each(errorMsg, function (key, value) {
                    membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                  })
                  event_date_msg += `<div>${membererror}</div>`;
                }
              } else {
                if(xhr.responseJSON.data.members != undefined){
                  for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                    event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
                  }
                } else {
                    event_date_msg += `<span>${xhr.responseJSON.data.owner_phone_number[0]}</span>`;
                }
              }
            }
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.step-content-wrapper.event-step-1 .api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.step-content-wrapper.event-step-1 .api_error').fadeOut();
            $(".step-content-wrapper.event-step-1 .button-wrapper").find("button").removeClass("loading").removeClass("disabled");
          }, 5000);
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
    async: true,
    headers: {
      // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {

    },
    success: function (result) {
      button.text("Look Added");
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
      theme_custom.checkLooks(localStorage.getItem("set-event-id"));
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
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
theme_custom.createLookAPI = function (lookName, eventId, lookUrl, produArray, button) {
  var getEventId = eventId;
  eventData = {
    "look_name": lookName,
    "event_id": eventId,
    "url": lookUrl,
    "items": produArray
  }
  button.addClass("disabled");
  $.ajax({
    url: `${theme_custom.base_url}/api/look/createLook`,
    method: "POST",
    data: eventData,
    dataType: "json",
    async: true,
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      var lookID = result.data.lookId;
      theme_custom.lookImage(getEventId, lookID, button);
    },
    error: function (xhr, status, error) {
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $(".look-api-message").text('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
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
theme_custom.toDataURL = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
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
theme_custom.lookAddedIntoEvent = function () {
  $('.send-via-main input:checkbox').change(function() {
    var parent = $(this).closest(".reminder-redesign-popup");
    if(parent.find(`[value="email"]`).is(':checked') || parent.find(`[value="text-sms"]`).is(':checked')){
      parent.find('.api_error').hide();
    } else {
      parent.find('.api_error').css({
        "background":"transparent",
        "text-align":"left",
        "padding-left":"0"
      }).text("Please select Email / SMS required*").show();
      return false;
    }
  })

  // Reminder send API 
  $(document).on("click", ".send-reminder", function (e) {
    e.preventDefault();
    var button = $(this);
    var parent = $(this).closest('.reminder-redesign-popup');
    var is_email_data = is_sms_data = 0;
    if($(`.send-via-main input`).is(':checked')){
    } else {
      parent.find('.api_error').css({
        "background":"transparent",
        "text-align":"left",
        "padding-left":"0"
      }).text("Please select Email / SMS required*").show();
      return false;
    }
    if(parent.find('[value="email"]').prop('checked')){
      is_email_data = 1;
    }
    if(parent.find('[value="text-sms"]').prop('checked')){
      is_sms_data = 1;
    }
    var reminderMemberArray = [];
    var member_id = '';
    $('.reminderMember.active').each(function() {
      member_id = $(this).attr("data-member-id");
      reminderMemberArray.push(member_id);
    })
    var sendReminderDataObj = {
      "name": parent.find("#remiderName").val(),
      "event_id": localStorage.getItem("set-event-id"),
      "scheduled_date": parent.find("#reminderDate").attr("data-current-data"),
      "message": parent.find("#reminderMessage").text(),
      "members": reminderMemberArray,
      "is_email": is_email_data,
      "is_sms": is_sms_data,
    }
    theme_custom.reminder(sendReminderDataObj, button);
  });

  // Reminder Option change
  $(document).on('change','#remiderName', function() {
    var targetMessage = $(this).find('option:selected').attr("data-message");
    if(targetMessage == 'Please select title ...') {
      $(this).closest('.reminder-redesign-popup').find('.send-reminder').addClass("disabled");
    } else {
      $(this).closest('.reminder-redesign-popup').find('.send-reminder').removeClass("disabled");
    }
    $(this).closest(".reminder-redesign-popup").find("#reminderMessage").text(targetMessage)
  });
  // open All Member send reminder popup
  $(document).on("click", ".open-reminder-popup", function (e) {
    e.preventDefault();
    var targetReminder = $(this).closest(".reminder-block-wrap").find('.message-wrap').attr("data-value")
    var addReminder = $(".reminder-redesign-popup");
    $('.all-member-reminder-title .reminder-title').text(targetReminder);
    $(".loading-overlay__spinner,.all-member-reminder-title").removeClass("hidden");
    $(".add-remider-outer-wrapper,.add-remider-outer-wrapper .remiderName").addClass("hidden");
    $(".form-error").removeClass("active");
    $('.reminder-redesign-popup').find('.send-reminder').addClass("disabled");
    $('.reminder-redesign-popup').find('.api_error').hide();
    $('.reminder-redesign-popup').find('.api_error').hide();
    // $.fancybox.open(addReminder);
    $(addReminder).addClass("active");
    $("#remiderName").addClass("hidden").val(targetReminder).trigger("change");
    $(`.reminder-redesign-popup .reminderMember.event-member`).addClass('active');
    $(`.send-via-main input`).prop("checked",false);
    setTimeout(() => {
      $(".reminder-redesign-popup .loading-overlay__spinner").addClass("hidden");
      $(".add-remider-outer-wrapper").removeClass("hidden");
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapper").removeClass("hidden");
    }, 1500);
  })

  // Open Individual member send reminder popup
  $(document).on("click", ".reminder-wrap", function (e) {
    e.preventDefault();
    var addReminder = $(".reminder-redesign-popup");
    var selecteMember = $(this).attr("data-member-id");
    $('.all-member-reminder-title').addClass("hidden");
    $(".loading-overlay__spinner, .remiderName, #remiderName").removeClass("hidden");
    $(".add-remider-outer-wrapper").addClass("hidden");
    $(".form-error").removeClass("active");
    $('.reminder-redesign-popup').find('.api_error').hide();
    $(addReminder).addClass("active");
    $("#remiderName").val('Select Title').trigger("change");
    $(`.send-via-main input`).prop("checked",false);
    $('html,body').css({
      'overflow' : "hidden"
    })
    setTimeout(() => {
      $(".reminder-redesign-popup .loading-overlay__spinner").addClass("hidden");
      $(".add-remider-outer-wrapper").removeClass("hidden");
      $(`.reminder-redesign-popup .reminderMember`).removeClass('active');
      $(`.reminder-redesign-popup .reminderMember[data-member-id="${selecteMember}"]`).addClass("active");
    }, 1500);
  })

  $(document).on("click", ".look-added-into-event", function (e) {
    e.preventDefault(); 
    var productTitle = $(this).closest(`.product-info`).find(`.product-title`).text();
    var TargetValue = "Silver Suit";
    if(productTitle.indexOf(TargetValue) != -1) {
      $(`.event-page-sliver-suit-coming-soon-msg`).show();
    } else {
    $(`.event-page-sliver-suit-coming-soon-msg`).hide();
    var button = $(this);
    button.text($(this).data("text"));
    var lookName = $(this).closest(".product-card").find(".product-title").text(),
      eventId = $(this).closest(".event-page-new-design-wrapper").find("#event-id").val();
    var productDataCardArr = $(this).closest(".product-card").find(`.product-data-card`),
      dataObj = {};
    theme_custom.newArray = [],
      productDataCardArr.each(function () {
        dataObj = {
          "product_id": $(this).find(".looks-product-id").val(),
          "variant_id": $(this).find(".looks-product-var-id").val(),
          "product_handle": $(this).find(".looks-product-handle").val(),
          "type": $(this).attr("data-product-type")
        }
        theme_custom.newArray.push(dataObj);
      });
    produArray = theme_custom.newArray;
    var custom_look_new_url = '/pages/customize-your-look?';
    productDataCardArr.each(function (i) {
      var productVarId = $(this).find(".looks-product-var-id").val();
      var productHandle = $(this).find(".looks-product-handle").val();
      if (i === 0) {
        custom_look_new_url += productHandle + '=' + productVarId;
      } else {
        custom_look_new_url += "&" + productHandle + '=' + productVarId;
      }
    })
    var lookUrl = custom_look_new_url;

    var productImageUrl = $(this).closest(".product-card").find(".img img").attr("src");
    theme_custom.toDataURL(productImageUrl, function (dataUrl) {
      theme_custom.image_url = dataUrl;
      theme_custom.ImageURL = theme_custom.dataURLtoFile(theme_custom.image_url, 'custom-look.png');
    });
    theme_custom.createLookAPI(lookName, eventId, lookUrl, produArray, button);
    }
  })

  // added-look-into-event
  $(document).on('click', '.added-look-into-event', function () {
    var productTitle = $(this).closest(`.product-info`).find(`.product-title`).text();
    var TargetValue = "Silver Suit";
    if(productTitle.indexOf(TargetValue) != -1) {
      $(`.event-page-sliver-suit-coming-soon-msg`).show();
    } else {
    $(`.event-page-sliver-suit-coming-soon-msg`).hide();
    var add_event_api_url = `${theme_custom.base_url}/api/look/addToEvent`;
    var eventid = localStorage.getItem('set-event-id');
    var favid = $(this).closest(".product-card").attr("data-id");
    button = $(this);
    button.text("Adding...")
    var data = {
        "event_id": eventid,
        "look_id": favid
    };
    $.ajax({
      url: add_event_api_url,
      method: "POST",
      data: data,
      dataType: "json",
      headers: {
        "Authorization": APP_Token
      },
      beforeSend: function () {
        button.addClass("disabled");
      },
      success: function (result) {
        button.text("Look Added");
        $('.event-step-wrapper').addClass('hidden');
        theme_custom.globalLoaderShow();
        theme_custom.checkLooks(localStorage.getItem("set-event-id"));
        $('.event-step-wrapper').addClass('hidden');
        theme_custom.globalLoaderShow();
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
  });
}
theme_custom.globalLoaderShow = () => {
  // $('.site-global-loader').removeClass('hidden'); 
  $('.loader-wrapper').removeClass('hidden')

}
theme_custom.globalLoaderhide = () => {
  // $('.site-global-loader').addClass('hidden'); 
  $('.loader-wrapper').addClass('hidden')
}

// remove Event member form Look
theme_custom.removeUserFromLook = (eventId, memberId) => {
  //  confirms = confirm("Are you sure you want to remove this?");
  if (eventId) {
    theme_custom.globalLoaderShow();
    if (eventId) {
      $.ajax({
        url: `${theme_custom.base_url}/api/event/removeMember/${eventId}/${memberId}`,
        method: "DELETE",
        data: '',
        dataType: "json",
        async: true,
        headers: {
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        success: function (result) {
          theme_custom.checkLooks(localStorage.getItem("set-event-id"));
        },
        error: function (xhr, status, error) {
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
            alert('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>');
            setTimeout(() => {
              theme_custom.removeLocalStorage();
              window.location.href = '/account/logout';
            }, 5000);
          } else {
            $(".site-global-loader").addClass("hidden");
            $(`[data-target="remove-data-for-user"]`).removeClass("active");
            alert(xhr.responseJSON.message);
            $('html,body').css({
              'overflow' : "auto"
            })
            $(".loader-wrapper").removeClass("hidden");
            $(".step-content-wrapper").removeClass("active");
          }
          // theme_custom.globalLoaderhide();
        }
      });
    }
  }
} 

// remove Event Owener from Look
theme_custom.removeOwnerFromLook = (look_id,event_id, event_member_id) => {
  //  confirms = confirm("Are you sure you want to remove this?");
  if (event_id) {
    theme_custom.globalLoaderShow();
    if (event_id) {
      $.ajax({
        url: `${theme_custom.base_url}/api/look/removeMemberOwner/${look_id}/${event_id}/${event_member_id}`,
        method: "DELETE",
        data: '',
        dataType: "json",
        async: true,
        headers: {
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        success: function (result) {
          theme_custom.checkLooks(localStorage.getItem("set-event-id"));
        },
        error: function (xhr, status, error) {
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
            alert('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>');
            setTimeout(() => {
              theme_custom.removeLocalStorage();
              window.location.href = '/account/logout';
            }, 5000);
          } else {
            $(".site-global-loader").addClass("hidden");
            $(`[data-target="remove-data-for-user"]`).removeClass("active");
            alert(xhr.responseJSON.message);
            $('html,body').css({
              'overflow' : "auto"
            })
            $(".loader-wrapper").removeClass("hidden");
            $(".step-content-wrapper").removeClass("active");
          }
          // theme_custom.globalLoaderhide();
        }
      });
    }
  }
}

theme_custom.ProductData = function (productItemsArr, lookName, lookId, memberId) {
  var productSubTotalPrice = "",
    subTotal = 0;
  $.map(productItemsArr, function (productItems, index) {
    jQuery.ajax({
      type: 'GET',
      async: true,
      url: `/products/${productItems.product_handle}.json`,
      success: function (response) {
        for (i = 0; i < response.product.variants.length; i++) {
          var var_id = response.product.variants[i];
          if (var_id.id == productItems.variant_id) {
            var_has_available = true;
            break;
          } else {
            var_has_available = false;
          }
        }
        if (var_has_available) {
          $.each(response.product.variants, function (key, value) {
            var variantSelected = value;
            var subtotalVarPrice = (variantSelected.price) * 100;
            if (value.id == productItems.variant_id) {
              subTotal = subTotal + parseInt(subtotalVarPrice) * 100;
            }
          });
        }
        var productTitle = response.product.title;
        theme_custom.productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal) / 100, theme_custom.money_format);
      },
      error: function (xhr, status, error) {
        alert(xhr.responseJSON.message);
      }
    });
  });
}

// theme_custom.productBlockDataWrap
theme_custom.productBlockDataWrap = function (orderItemsObj, orderItems, index, lookDetails, isHostCheck, lookImagePath, lookTitle) {
  $(`.look-card-block[data-look-id="${orderItems.look_id}"] .look-price,.order-wrap-${index} .product-card-wrap`).hide();
  var productDataArrayData = orderItemsObj.filter((x) => { return (x.type != "looks" || !x.product_handle.includes("suit"))});
  var subTotal = 0, productItemHTML = productLookList = productLookItemList = '',
      lookImagePath = lookImagePath,
      lookTitle = lookTitle;
  var productItemsArrayLooks = productDataArrayData;
  var product_ids = '';
  $.map(productDataArrayData, function (productItems, index) {
    if (index == 0) {
      product_ids = `id:${productItems.product_id}`
    } else {
      product_ids += ` OR id:${productItems.product_id}`
    }
  });
  $.ajax({
    url: `/search/?view=getData&q=${product_ids}`,
    dataType: "json",
    async: true,
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () { },
    success: function (result) {
      var productsArray = result.products;
      if(result.products.length > 0){
      $.map(productItemsArrayLooks, function (productItemInfo, index) {
        var product = productsArray.find((item) => item.id == parseInt(productItemInfo.product_id));
        var selectedVar = product.variants.find((variant) => variant.id == parseInt(productItemInfo.variant_id));
        productItemsArrayLooks[index]["selectedVar"] = selectedVar;
        productItemsArrayLooks[index]["product"] = product;
      });
      if(isHostCheck == 1){
        $.map(productItemsArrayLooks, function(productItem,index) {
          var productType = productItem.product.type;
          productType = productType.toLowerCase();
          var variantNotFound = errorMsg = showErrorClass = '';
          if(productItem.selectedVar.inventory_policy == 'deny' && parseInt(productItem.selectedVar.inventory_quantity) <= 0){
            variantNotFound = 'variant-not-found';
            errorMsg = theme_custom.product_out_of_stock
            showErrorClass = 'error-show'
            ctaBtnText = 'Out of stock'
            ctaBtnTextDisable = "disabled"
          } else {
            ctaBtnText = 'Update',
            ctaBtnTextDisable = ''
          }
          var productOptionsList = productItem.product.options;
          var variantTitle = swatches = '';
          if(productItem.product.options){
            var productOption = productItem.product.options;
            var customSwatchWap = '';
            for (let optionVal = 0; optionVal < productOption.length; optionVal++) {
              var element = productOption[optionVal];
              var customSwatch = '';
              var elementValues = element.values;
              for (let selectVar = 0; selectVar < elementValues.length; selectVar++) {
                var swatchValue = elementValues[selectVar];
                if(productOption[optionVal].name == 'Color' || productOption[optionVal].name == 'color'){
                  var color_name = swatchValue.toLowerCase().replace(" ","-");
                  customSwatch += `<div data-swatch-title="${swatchValue}" data-value="${swatchValue}" class="swatch-product-wrapper swatch-element ${swatchValue}">
                                    <input id="${productItem.product.handle}-${color_name}" type="radio" data-name="${productOption[optionVal].name}" name="${productItem.product.handle}-${productOption[optionVal].name}" value="${swatchValue}" data-value="${swatchValue.toLowerCase()}" />
                                    <label style="background-image:url(//cdn.shopify.com/s/files/1/0585/3223/3402/files/color_${color_name}.png?v=13538939889425418844)" for="${productItem.product.handle}-${color_name}"><span>${color_name}</span></label>
                                  </div>`;
                } else {
                  customSwatch += `<div data-swatch-title="${swatchValue}" data-value="${swatchValue}" class="swatch-product-wrapper swatch-element ${swatchValue}">
                                    <input id="${productItem.product.handle}-${productOption[optionVal].name}-${swatchValue}" type="radio" data-name="${productOption[optionVal].name}" name="${productItem.product.handle}-${productOption[optionVal].name}" value="${swatchValue}" data-value="${swatchValue.toLowerCase()}" />
                                    <label data-option-value="${swatchValue}" for="${productItem.product.handle}-${productOption[optionVal].name}-${swatchValue}">${swatchValue}</label>
                                  </div>`;
                }
              }
              var optionNameHandle = (productOption[optionVal].name).toLowerCase().replace(/ /g,'-');
              customSwatchWap += `<div class="swatch swatch-wrap clearfix swatch-${optionNameHandle}" data-option-index="${optionVal}">
                                    <p class="swatch-title">${productOption[optionVal].name} :</p>
                                    <div class="swatch" data-option-index="${optionVal}">
                                      ${customSwatch}
                                    </div>
                                  </div>`;
            }
          }
          var prodOptionArray = [];
          $.each(productItem.product.variants, function (key, value) {
            if(!value.title == ''){
              if(key == 0){
                prodOptionArray += `<option data-variant-title="${value.title}" data-product-id="${productItem.product.id}" value="${value.id}" data-variant-price="${value.price}" data-variant-image="${value.featured_image}" data-variant-inventory-policy="${value.inventory_policy}" data-variant-inventory-quantity="${value.inventory_quantity}" data-variant-estimate-date="${value.esimate_to_ship_date}" selected="selected">${value.title}</option>`;
              } else {
                prodOptionArray += `<option data-variant-title="${value.title}" data-product-id="${productItem.product.id}" value="${value.id}" data-variant-price="${value.price}" data-variant-image="${value.featured_image}" data-variant-inventory-policy="${value.inventory_policy}" data-variant-inventory-quantity="${value.inventory_quantity}" data-variant-estimate-date="${value.esimate_to_ship_date}">${value.title}</option>`;
              }
            }
          });
          $(productOptionsList).each(function(index, item){
            if(productType == 'jacket' || productType == 'Jacket'){
              theme_custom.suit_image = productItem.selectedVar.featured_image;
              theme_custom.suit_title = productItem.selectedVar.option3 + ' Suit';

              theme_custom.jacket_option_one = productItem.selectedVar.option1;
              theme_custom.jacket_option_second = productItem.selectedVar.option2;
              theme_custom.jacket_option_third = productItem.selectedVar.option3;
              
            }
            if(productType == 'pants' || productType == 'Pants'){
              theme_custom.pants_option_one = productItem.selectedVar.option1;
              theme_custom.pants_option_second = productItem.selectedVar.option2;
              theme_custom.pants_option_third = productItem.selectedVar.option3;
            }
            if(productType == 'vest' || productType == 'Vest'){
              theme_custom.vest_option_one = productItem.selectedVar.option1;
              theme_custom.vest_option_second = productItem.selectedVar.option2;
              theme_custom.vest_option_third = productItem.selectedVar.option3;
            }
            if(index == 0) {
              variantTitle += `<span class="option-name option-1 ${item.name}" data-value="${productItem.selectedVar.option1}">${productItem.selectedVar.option1}</span>`
            }
            if(index == 1){
              variantTitle += `<span class="break"> / </span><span class="option-name option-2 ${item.name}" data-value="${productItem.selectedVar.option2}">${productItem.selectedVar.option2}</span>`
            }
            if(index == 2){
              variantTitle += `<span class="break"> / </span><span class="option-name option-3 ${item.name}" data-value="${productItem.selectedVar.option3}">${productItem.selectedVar.option3}</span>`              
            }
          });
          productLookItemList += `<div class="edit-product-data-card product-data-card ${variantNotFound}" data-product-type="${productType}" data-prod-handle="${productItem.product.handle}">
                                  <input type="hidden" class="product_handle" value="${productItem.product.handle}" /> 
                                  <input type="hidden" class="product_id" value="${productItem.product.id}" />
                                  <input type="hidden" class="product_varariant_id" value="${productItem.selectedVar.id}" data-inventory-policy="${productItem.selectedVar.inventory_policy}" data-inventory-quantity="${productItem.selectedVar.inventory_quantity}" />
                                  <input type="hidden" class="product_variant_title" value="${productItem.selectedVar.title}" />
                                  <div class="product-block-wrap">
                                    <div class="product-image">
                                      <img src="${productItem.selectedVar.featured_image}" alt="${productItem.product.title}">
                                    </div>
                                    <div class="product-variant-info">
                                      <h4 class="product-title">${productItem.product.title}</h4>
                                      <div class="variant-title">
                                        ${variantTitle}                                            
                                      </div>
                                      <div class="cta-button-wrap product-variant-wrap">
                                        <span class="open-product-edit-popup" data-button-label="edit-item">Edit Item</span>
                                      </div>
                                      <span class="error-message ${showErrorClass}">${errorMsg}</span>
                                      <div class="estimated-variant-error-block-wrap" style="margin-top:5px;"><span class="information-icon">!</span> <span class="estimated-date"></span></div>
                                    </div>
                                    <div class="product-price">
                                      <span class="money" data-price="${productItem.selectedVar.price}">
                                        ${theme_custom.Shopify.formatMoney(productItem.selectedVar.price, theme_custom.money_format)}
                                      </span>
                                    </div>
                                  </div>
                                  <div class="product-edit-popup-wrap edit-item-popup" data-product-handle="${productItem.product.handle}" data-product-id="${productItem.product.id}" data-line-item-id="${productItem.selectedVar.id}" data-product-type="${productType}">
                                    <select class="product-variant-option hidden">${prodOptionArray}</select>
                                    <div class="swatch-wrapper-options"><h4>${productItem.product.title}</h4>${customSwatchWap}</div>
                                    <span class="error-message ${showErrorClass}">${errorMsg}</span>
                                    <button type="button" name="pdp-updates-button" class="button button--full-width button--primary pdp-updates-button ${ctaBtnTextDisable}" data-product-type="${productType}" data-text="Updating..">${ctaBtnText}</button>
                                  </div>
                                </div>`;
          productItemHTML += `<div class="product-card-data ${variantNotFound}" data-product-type="${productType}">
                                <input type="hidden" class="product_handle" value="${productItem.product.handle}" /> 
                                <input type="hidden" class="product_id" value="${productItem.product.id}" />
                                <input type="hidden" class="product_varariant_id" value="${productItem.selectedVar.id}" data-variant-inventory-policy="${productItem.selectedVar.inventory_policy}" data-variant-inventory-quantity="${productItem.selectedVar.inventory_quantity}" />
                                <input type="hidden" class="product_variant_title" value="${productItem.selectedVar.title}" />
                              </div>`;
          subTotal += productItem.selectedVar.price;
        });
        productLookList = `<td colspan="4" class="look-list">
                            <div class="look-product-details show">
                              <div class="look-info-wrapper">
                                <div class="look-img">
                                  <img src="${lookImagePath}" alt="${lookTitle}" />
                                </div>
                                <h3 class="look-title">${lookTitle}</h3>
                              </div>
                              <div class="look-products-list-wrapper">
                                <div class="suit-product-data-info-card-wrapper product-data-card" data-product-type="suit-info">
                                  <div class="product-block-wrap">
                                    <div class="product-image">
                                      <img src="${theme_custom.suit_image}" alt="${theme_custom.suit_title}">
                                    </div>
                                    <div class="product-variant-info">
                                      <h4 class="product-title">${theme_custom.suit_title}</h4>
                                      <div class="jacket-variant-title product-variant-wrap" data-product-type="jacket">
                                        <div>
                                          Jacket <span class="break">:</span> <span class="option-name option-1">${theme_custom.jacket_option_one}</span> <span class="break">/</span> <span class="option-name option-2">${theme_custom.jacket_option_second}</span> <span class="break">/</span> <span class="option-name option-3">${theme_custom.jacket_option_third}</span> - <span class="combo-block-edit-item" data-product-type="jacket">Edit Item</span>
                                        </div>
                                        <span class="error-message"></span>
                                        <div class="estimated-variant-error-block-wrap" style="margin-top:5px;"><span class="information-icon">!</span> <span class="estimated-date"></span></div>
                                      </div>
                                      <div class="pants-variant-title product-variant-wrap" data-product-type="pants">
                                        <div>
                                          Pant <span class="break">:</span> <span class="option-name option-1">${theme_custom.pants_option_one}</span> <span class="break">/</span> <span class="option-name option-2">${theme_custom.pants_option_second}</span> <span class="break">/</span> <span class="option-name option-3">${theme_custom.pants_option_third}</span> - <span class="combo-block-edit-item" data-product-type="pants">Edit Item</span>
                                        </div>
                                        <span class="error-message"></span>
                                        <div class="estimated-variant-error-block-wrap" style="margin-top:5px;"><span class="information-icon">!</span> <span class="estimated-date"></span></div>
                                      </div>
                                    </div>
                                    <div class="product-price">
                                      <span class="money">
                                        $199.99
                                      </span>
                                    </div>
                                  </div> 
                                </div>
                                ${productLookItemList}
                              </div>
                            </div>
                          </td>`;
        $(`.event-owner-look-product-list.order-wrap-block.look-product-list-wrapper`).html(productLookList);
        if($(".event-owner-look-product-list.look-product-list-wrapper").find(".error-message.error-show").length > 0){
          $(".event-owner-look-product-list").find(".view-look").attr("data-text","View Look").text("Hide Look");
          setTimeout(() => {
            $(".event-owner-look-product-list.look-product-list-wrapper").find(".look-product-details").addClass("show");
          }, 1500);
        }
        if(getCookie("fit-finder-data") != "") {  
          theme_custom.setFitFinderProduct();
        }
      } else {
        $.map(productItemsArrayLooks, function(productItem,index) {
          var productType = productItem.product.type;
          productType = productType.toLowerCase();
          productItemHTML += `<div class="product-card-data" data-product-type="${productType}">
                                <input type="hidden" class="product_handle" value="${productItem.product.handle}" /> 
                                <input type="hidden" class="product_id" value="${productItem.product.id}" />
                                <input type="hidden" class="product_varariant_id" value="${productItem.selectedVar.id}" data-variant-inventory-policy="${productItem.selectedVar.inventory_policy}" data-variant-inventory-quantity="${productItem.selectedVar.inventory_quantity}" />
                                <input type="hidden" class="product_variant_title" value="${productItem.selectedVar.title}" />
                              </div>`;
          subTotal += productItem.selectedVar.price;
        });
      }      
      productSubTotalPrice = theme_custom.Shopify.formatMoney(subTotal, theme_custom.money_format);
      $(`.order-wrap-${index} .look-price`).text(productSubTotalPrice);
      $(`.order-wrap-${index} .look-price`).attr("data-price", subTotal / 100);
      $(`.order-wrap-${index} .button`).attr("data-look-price", subTotal / 100).attr("data-look-total-price", subTotal);
      $(`.look-card-block[data-look-id="${orderItems.look_id}"] .look-price`).text(productSubTotalPrice).fadeIn();
      $(`.order-wrap-${index} .product-card-wrap`).html(productItemHTML);
      }
    }
  });
}

theme_custom.lookItemsData = function (result) {
  var lookItemsData = result.data.event_looks;
  $.map(lookItemsData, function (orderItems, index) {
    var orderItemsObj = orderItems.items;
    theme_custom.productBlockDataWrap(orderItemsObj, orderItems, index);
  })
}

theme_custom.lookInfoData = function (result) {
  var paymentInfo = result.data.payment_info;
  var lookDetails = result.data.event_looks;
  var paymentInfoHTMLtarget = $(".summary-table-wrapper tbody");
  if (result.data.payment_info == '') {
    $(".summary-table-wrapper").addClass("hidden");
  } else {
    $(".summary-table-wrapper").removeClass("hidden");
  }
  $.map(paymentInfo, function (orderItems, index) {
    var isHostCheck = orderItems.is_host; 
    var productHTML = item_data = product_data_for_host = '';
    var orderItemsObj = orderItems.items;    
    for (let i = 0; i < lookDetails.length; i++) {
      const element = lookDetails[i];
      if (element.look_id == orderItems.look_id) {
        var lookImagePath = element.look_image;
        var lookTitle = element.name;
      }
    }
    if (getCookie("fit-finder-data") == "") {  
      var checkFitFinderData = `fit-finder-blank`;
    } else {
      var checkFitFinderData = ``
    }
    if (orderItems.payment_status != "Complete") {
      var actionButton = payInfo = "";
      if (orderItems.is_host == 1) {
        payInfo = 'I pay';
        product_data_for_host = ''
        actionButton = `<button class="button btn-wrap button--secondary cta-action-add-to-cart ${checkFitFinderData}" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}" data-look-image="${lookImagePath}"  data-look-price="215.90">
                          Proceed to Cart
                        </button>
                        <span class="view-look" data-text="View Look">Hide Look</span>`;
      } else {
        payInfo = 'I Pay';
        product_data_for_host = 'hidden';
        actionButton = `<button class="button btn-wrap button--secondary event-payment-for-guest" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}" data-look-image="${lookImagePath}"  data-look-price="215.90">
                          Pay for Guest
                        </button>`
      }
    } else {
      var actionButton = payInfo = "";
      if (orderItems.is_host == 1) {
        payInfo = 'I pay';
        actionButton = `<button class="disabled button btn-wrap button--primary cta-action-add-to-cart ${checkFitFinderData}" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}"  data-look-price="215.90">
                          Payment Completed
                        </button>`;
      } else {
        payInfo = 'I pay';
        actionButton = `<button class="disabled button btn-wrap button--primary event-payment-for-guest" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}"  data-look-price="215.90">
                          Payment Completed
                        </button>`
      }
    }
    if (orderItems.is_host == 1) {
      productHTML += `<tr class="event-owner-look-product-list order-wrap-block order-wrap-${index}">
                        <td class="look-name-wrap">
                          <span class="look_name">${orderItems.look_name}</span>
                        </td>
                        <td class="member-name-wrapper">
                          <span class="member-number">
                            For ${orderItems.member_name}
                          </span>
                        </td>
                        <td class="pay-info-wrap">
                          <span class="pay-info" >${payInfo}</span>
                          <span class="look-price" data-price=""></span>  
                        </td>
                        <td class="action-button">
                          <div class="product-data ${product_data_for_host}">
                            <div class="product-card-wrap">
                              <input type="hidden" class="product_id" data-product-id="" data-product-price="" data-product-var-id="" />
                            </div>
                          </div>
                          ${actionButton}
                        </td>
                      </tr>
                      <tr class="event-owner-look-product-list order-wrap-block look-product-list-wrapper multi-item-add-to-cart"></tr>`;
    } else {
      productHTML += `<tr class="guest-memeber-look-product-list order-wrap-block order-wrap-${index}">
                        <td class="look-name-wrap">
                          <span class="look_name">${orderItems.look_name}</span>
                        </td>
                        <td class="member-name-wrapper">
                          <span class="member-number">
                            For ${orderItems.member_name}
                          </span>
                        </td>
                        <td class="pay-info-wrap">
                          <span class="pay-info" >${payInfo}</span>
                          <span class="look-price" data-price=""></span>  
                        </td>
                        <td class="action-button">
                          <div class="product-data ${product_data_for_host}">
                            <div class="product-card-wrap">
                              <input type="hidden" class="product_id" data-product-id="" data-product-price="" data-product-var-id="" />
                            </div>
                          </div>
                          ${actionButton}
                        </td>
                      </tr>`;
    }                
    theme_custom.productBlockDataWrap(orderItemsObj, orderItems, index, lookDetails, isHostCheck, lookImagePath, lookTitle);
    paymentInfoHTMLtarget.append(productHTML);
    $('.event-step-wrapper').removeClass('hidden');
    theme_custom.globalLoaderhide();
    theme_custom.changeStep(3);
    $(`.summary-table-wrapper tfoot`).hide();
    setTimeout(() => {
      if($(".guest-memeber-look-product-list.order-wrap-block").length > 0){
        var totalPrice = 0;
        $(".guest-memeber-look-product-list.order-wrap-block").each(function () {
          totalPrice = totalPrice + ($(this).find("button").attr("data-look-total-price") * 1);
        })
        var lookTotalPrice = theme_custom.Shopify.formatMoney(totalPrice, theme_custom.money_format)
        $(`.summary-table-wrapper tfoot`).fadeIn().find('.total-price').text(lookTotalPrice);
      }
    }, 3000);
    theme_custom.eventExpired(result.data);
  })
  $(".loader-wrapper").addClass("hidden");
  $(".event-step-wrapper").removeClass("hidden");
  $(".final-summary-wrapper").addClass("active");
}

theme_custom.eventMemberData = function () {
  var summaryTableWrapper = $(".summary-table-wrapper");
  summaryTableWrapper.find('tbody').empty();
  const eventId = localStorage.getItem("set-event-id");
  $.ajax({
    url: `${theme_custom.base_url}/api/event/${eventId}`,
    method: "GET",
    data: '',
    dataType: "json",
    async: true,
    headers: {
      // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      theme_custom.lookInfoData(result);
    },
    error: function (xhr, status, error) {
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.reminder-added-part .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 3000);
      } else {
        var event_date_msg = '';
        if (xhr.responseJSON.data) {
          if (xhr.responseJSON.data.event_id != undefined) {
            for (let i = 0; i < xhr.responseJSON.data.event_id.length; i++) {
              event_date_msg += `<span>${xhr.responseJSON.data.event_id[i]}</span>`;
            }
          } else {
            if (xhr.responseJSON.data.length > 0) {
              for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                var errorMsg = xhr.responseJSON.data[i];
                var membererror = '';
                $.each(errorMsg, function (key, value) {
                  membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                })
                event_date_msg += `<div>${membererror}</div>`;
              }
            } else {
              if(xhr.responseJSON.data.members != undefined){
                  for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                    event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
                  }
                } else {
                    event_date_msg += `<span>${xhr.responseJSON.data.owner_phone_number[0]}</span>`;
                }
            }
          }
        } else {
          event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
        }
        $('.reminder-added-part .api_error').show().html(event_date_msg);
        setTimeout(() => {
          $('.reminder-added-part .api_error').html('').hide();
        }, 5000);
      }
    }
  });
}

theme_custom.setFitFinderProduct = function(){
  var getFitFinderData = JSON.parse(getCookie("fit-finder-data"));
  if (getFitFinderData.jacketSize != '') {
    var jacketSize = getFitFinderData.jacketSize.split(":")[0];
    var jacketType = getFitFinderData.jacketSize.split(":")[1], jacketTypeVal = '';
    if (jacketType == "S") {
      jacketTypeVal = 'Short'
    } else if (jacketType == "R") {
      jacketTypeVal = 'Regular'
    } else if (jacketType == "L") {
      jacketTypeVal = 'Long'
    }
    $(`.jacket-variant-title .option-1, .vest-variant-title .option-1`).text(jacketSize);
    $(`.jacket-variant-title .option-2, .vest-variant-title .option-2`).text(jacketTypeVal);
    $(`[data-product-type="jacket"] [data-option-index="1"],[data-product-type="vest"] [data-option-index="1"]`).find(`[data-value="${jacketSize}"]`).click();
    $(`[data-product-type="jacket"] [data-option-index="2"],[data-product-type="vest"] [data-option-index="2"]`).find(`[data-value="${jacketTypeVal}"]`).click();
  }
  if (getFitFinderData.pants_waist != '') {
    $(`.pants-variant-title .option-1`).text(getFitFinderData.pants_waist);
    $(`[data-product-type="pants"] [data-option-index="0"]`).find(`[data-value="${getFitFinderData.pants_waist}"]`).click();
  }
  if (getFitFinderData.pants_hight != '') {
    $(`.pants-variant-title .option-2`).text(getFitFinderData.pants_hight);
    $(`[data-product-type="pants"] [data-option-index="1"]`).find(`[data-value="${getFitFinderData.pants_hight}"]`).click();
  }
  if (getFitFinderData.shirt_sleeve != '') {
    $(`[data-product-type="shirt"] .option-1`).text(getFitFinderData.shirt_sleeve);
    $(`[data-product-type="shirt"] [data-option-index="0"]`).find(`[data-value="${getFitFinderData.shirt_sleeve}"]`).click();
  }
  if (getFitFinderData.shirt_neck != '') {
    $(`[data-product-type="shirt"] .option-1`).text(getFitFinderData.shirt_neck);
    $(`[data-product-type="shirt"] [data-option-index="1"]`).find(`[data-value="${getFitFinderData.shirt_neck}"]`).click();
  }
  if (getFitFinderData.shoe_size != '') {
    $(`[data-product-type="shoes"] .option-2`).text(getFitFinderData.shoe_size);
    $(`[data-product-type="shoes"] [data-option-index="1"]`).find(`[data-value="${getFitFinderData.shoe_size}"]`).click();
  }
  $(".edit-product-data-card.product-data-card").each(function () {
    var parentEl = $(this);
    var productType = $(this).attr("data-product-type").toLowerCase();
    if (getFitFinderData.jacketSize && productType == 'jacket' || getFitFinderData.jacketSize && productType == 'vest') {
      var jacketType = getFitFinderData.jacketSize.split(":");
      var jacketTypeVal = '';
      if (jacketType[1] == "S") {
        jacketTypeVal = 'Short'
      } else if (jacketType[1] == "R") {
        jacketTypeVal = 'Regular'
      } else if (jacketType[1] == "L") {
        jacketTypeVal = 'Long'
      }
      if(productType == 'jacket'){
        $(`.jacket-variant-title,.edit-product-data-card[data-product-type="jacket"]`).find(`.option-name.option-1`).text(jacketType[0]).attr("data-value",jacketType[0]);
        $(`.jacket-variant-title,.edit-product-data-card[data-product-type="jacket"]`).find(`.option-name.option-2`).text(jacketTypeVal).attr("data-value",jacketTypeVal);
      }
      if(productType == 'vest'){
        $(`.vest-variant-title,.edit-product-data-card[data-product-type="vest"]`).find(`.option-name.option-1`).text(jacketType[0]).attr("data-value",jacketType[0]);
        $(`.vest-variant-title,.edit-product-data-card[data-product-type="vest"]`).find(`.option-name.option-2`).text(jacketTypeVal).attr("data-value",jacketTypeVal);
      }
      parentEl.find(`.swatch-product-wrapper input[data-name='Chest Size']:checked`).prop("checked",false)
      parentEl.find(`.swatch-product-wrapper input[data-name='Chest Size'][value="${jacketType[0]}"]`).prop("checked",true);
      parentEl.find(`.swatch-product-wrapper input[data-name='Style']:checked`).prop("checked",false);
      parentEl.find(`.swatch-product-wrapper input[data-name='Style'][value="${jacketTypeVal}"]`).prop("checked",true);
      setTimeout(function(){
        theme_custom.getProductVariantData(parentEl);
      },1000)
    }
    if (getFitFinderData.pants_waist && getFitFinderData.pants_hight && productType == 'pants') {
      var pants_waist = getFitFinderData.pants_waist;
      var pants_hight = getFitFinderData.pants_hight;
      $(`.pants-variant-title,.edit-product-data-card[data-product-type="pants"]`).find(`.option-name.option-1`).text(pants_waist).attr("data-value",pants_waist);
      $(`.pants-variant-title,.edit-product-data-card[data-product-type="pants"]`).find(`.option-name.option-2`).text(pants_hight).attr("data-value",pants_hight);
      parentEl.find(`.swatch-product-wrapper input[data-name='Waist']:checked`).prop("checked",false);
      parentEl.find(`.swatch-product-wrapper input[data-name='Waist'][value="${pants_waist}"]`).prop("checked",true);
      parentEl.find(`.swatch-product-wrapper input[data-name='Length']:checked`).prop("checked",false);
      parentEl.find(`.swatch-product-wrapper input[data-name='Length'][value="${pants_hight}"]`).prop("checked",true);
      setTimeout(function(){
        theme_custom.getProductVariantData(parentEl);
      },1000)
    }
    if (getFitFinderData.shirt_neck && getFitFinderData.shirt_sleeve && getFitFinderData.fit && productType == 'shirt') {
      // var shirt_size =  getFitFinderData.shirt_sleeve + ' | ' + getFitFinderData.shirt_neck;
      var shirt_size = getFitFinderData.shirt_neck + ' ' + getFitFinderData.shirt_sleeve;
      var shirt_fit = getFitFinderData.fit;
      parentEl.find(`.swatch-product-wrapper input[data-name='Size']:checked`).prop("checked",false);
      parentEl.find(`.swatch-product-wrapper input[data-name='Size'][value="${shirt_size}"]`).prop("checked",true);
      parentEl.find(`.swatch-product-wrapper input[data-name='Style']:checked`).prop("checked",false);
      parentEl.find(`.swatch-product-wrapper input[data-name='Style'][value="${shirt_fit}"]`).prop("checked",true);
      parentEl.find(`.option-name.option-1`).text(`${shirt_size}`).attr("data-value", shirt_size);
      parentEl.find(`.option-name.option-2`).text(`${shirt_fit}`).attr("data-value", shirt_fit);
      setTimeout(function(){
        theme_custom.getProductVariantData(parentEl);
      },1000)
    }
    if (getFitFinderData.shoe_size && productType == 'shoes') {
      parentEl.find(`.swatch-product-wrapper input[data-name='Size']:checked`).prop("checked",false);
      parentEl.find(`.swatch-product-wrapper input[data-name='Size'][value="${getFitFinderData.shoe_size}"]`).prop("checked",true);
      parentEl.find(`.option-name.option-2`).text(`${getFitFinderData.shoe_size}`).attr("data-value", getFitFinderData.shoe_size);
      setTimeout(function(){
        theme_custom.getProductVariantData(parentEl);
      },1000)
    }
    if (productType == 'neckties' || productType == 'hanky' || productType == 'bow-ties' || productType == 'tie bar' || productType == 'belts') {
      setTimeout(function(){
        theme_custom.getProductVariantData(parentEl);
      },1000)
    }
  })
}

theme_custom.setFitFinder = function () {
  if (getCookie("fit-finder-data") != "") {
    var getFitFinderData = JSON.parse(getCookie("fit-finder-data"));
    if (getFitFinderData.jacketSize != '') {
      var jacketSize = getFitFinderData.jacketSize.split(":")[0];
      var jacketType = getFitFinderData.jacketSize.split(":")[1], jacketTypeVal = '';
      if (jacketType == "S") {
        jacketTypeVal = 'Short'
      } else if (jacketType == "R") {
        jacketTypeVal = 'Regular'
      } else if (jacketType == "L") {
        jacketTypeVal = 'Long'
      }
      $("#jacket-size").attr('data-val', jacketSize);
      $("#jacket-size").val(jacketSize);
      $("#jacket-type").attr('data-val', jacketTypeVal);
      $("#jacket-type").val(jacketTypeVal);
    }
    if (getFitFinderData.pants_hight != '') {
      $("#pants-length").val(getFitFinderData.pants_hight);
      $("#pants-length").attr('data-val', getFitFinderData.pants_hight);
    }
    if (getFitFinderData.pants_waist != '') {
      $("#pants-waist").val(getFitFinderData.pants_waist);
      $("#pants-waist").attr('data-val', getFitFinderData.pants_waist);
    }
    if (getFitFinderData.shirt_sleeve != '') {
      $("#shirt-sleeve").val(getFitFinderData.shirt_sleeve);
      $("#shirt-sleeve").attr('data-val', getFitFinderData.shirt_sleeve);
    }
    if (getFitFinderData.shirt_neck != '') {
      $("#shirt-neck").val(getFitFinderData.shirt_neck);
      $("#shirt-neck").attr('data-val', getFitFinderData.shirt_neck);
    }
    if (getFitFinderData.shoe_size != '') {
      $("#shoes-size").val(getFitFinderData.shoe_size);
      $("#shoes-size").attr('data-val', getFitFinderData.shoe_size);
    }
  } else {
    $(`.cta-action-add-to-cart`).addClass("fit-finder-blank");
  }
}

theme_custom.multiItemAddToCart = function (button) {
  var button = button;
  var getProduct = $(".multi-item-add-to-cart .edit-product-data-card");
  var items = [];
  button.text("Adding...").addClass("disabled");
  getProduct.each(function(){
    var productType = $(this).attr("data-product-type");
    var currentVar = '';
    if($(this).find(".option-1").text().length > 0){
      currentVar = $(this).find(".option-1").text();
    }
    if($(this).find(".option-2").text().length > 0){
      currentVar = currentVar + ' / ' + $(this).find(".option-2").text();
    }
    if($(this).find(".option-3").text().length > 0){
      currentVar = currentVar + ' / ' + $(this).find(".option-3").text();
    }

    var varId = $(this).find(`.product-variant-option option[data-variant-title="${currentVar}"]`).val(),
      item = {};
    var jacketOptionOne = $(`.multi-item-add-to-cart .product-data-card[data-product-type="jacket"]`).find(`.option-1`).text(),
      jacketOptionSecond =$(`.multi-item-add-to-cart .product-data-card[data-product-type="jacket"]`).find(`.option-2`).text(),
      jacketOptionThird = $(`.multi-item-add-to-cart .product-data-card[data-product-type="jacket"]`).find(`.option-3`).text(),
      jacketOptionTitle = jacketOptionOne + ' / ' + jacketOptionSecond + ' / ' + jacketOptionThird;
    
    if (productType == 'jacket' || productType == 'pants' || productType == 'vest') {
      // vest Variant Title
      var vestVariantTitle = ''; 
      if($(`.edit-product-data-card[data-product-type="vest"]`).find(".option-1").length > 0){
        vestVariantTitle = $(`.edit-product-data-card[data-product-type="vest"]`).find(".option-1").text();
      }
      if($(`.edit-product-data-card[data-product-type="vest"]`).find(".option-2").length > 0){
        vestVariantTitle = vestVariantTitle + ' / ' + $(`.edit-product-data-card[data-product-type="vest"]`).find(".option-2").text();
      }
      if($(`.edit-product-data-card[data-product-type="vest"]`).find(".option-3").length > 0){
        vestVariantTitle = vestVariantTitle + ' / ' + $(`.edit-product-data-card[data-product-type="vest"]`).find(".option-3").text();
      }

      // pents Variant Title
      var pantsVariantTitle = ''; 
      if($(`.edit-product-data-card[data-product-type="pants"]`).find(".option-1").length > 0){
        pantsVariantTitle = $(`.edit-product-data-card[data-product-type="pants"]`).find(".option-1").text();
      }
      if($(`.edit-product-data-card[data-product-type="pants"]`).find(".option-2").length > 0){
        pantsVariantTitle = pantsVariantTitle + ' / ' + $(`.edit-product-data-card[data-product-type="pants"]`).find(".option-2").text();
      }
      if($(`.edit-product-data-card[data-product-type="pants"]`).find(".option-3").length > 0){
        pantsVariantTitle = pantsVariantTitle + ' / ' + $(`.edit-product-data-card[data-product-type="pants"]`).find(".option-3").text();
      }
    }
    if (productType == 'jacket' || productType == 'Jacket') {

      item = {
        "id": varId,
        "quantity": 1,
        "properties": {
          "combo-variant-title" : jacketOptionTitle,
          "pant-variant-title" : $(`.edit-product-data-card[data-product-type="pants"]`).find(`.product-variant-option option[data-variant-title="${pantsVariantTitle}"]`).attr("data-variant-title")
        }
      }
    } else if (productType == 'pants' || productType == 'Pants') {
      item = {
        "id": varId,
        "quantity": 1,
        "properties": {
          "combo-variant-title" : jacketOptionTitle,
          "pant-variant-title" : $(`.edit-product-data-card[data-product-type="pants"]`).find(`.product-variant-option option[data-variant-title="${pantsVariantTitle}"]`).attr("data-variant-title")
        }
      }
    } else {
      item = {
        "id": varId,
        "quantity": 1
      }
    }
    items.push(item);
  })
  data = {
    items: items
  };
  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: data,
    dataType: 'json',
    success: function () {
      button.text("Added to Cart");
      setTimeout(() => {
        window.location.href = "/cart";
      }, 2500);
    },
    error: function (xhr, status, error) {
      alert(xhr.responseJSON.description);
      button.text("Proceed To Cart");
      button.removeClass("disabled");
    }
  });
}

theme_custom.eventPageClickEvent = function (){

  $(document).on("click",".suit-color-wrap", function(){
    $(`.suit-color-wrap`).removeClass("active");
    $(this).addClass("active");
  })

  $(document).on("click",".combo-block-edit-item", function(){
    var target = $(this).attr("data-product-type");
    $(`.multi-item-add-to-cart .edit-product-data-card[data-product-type="${target}"]`).find(".open-product-edit-popup").trigger("click");
  });
  $(document).on("click",".final-summary-wrapper .page-width-inner-wrapper .member-reminder-wrapper .heading, .final-summary-wrapper .page-width-inner-wrapper .member-summary-wrapper .heading",function(){
    if($(this).hasClass('current')){
      $(this).removeClass("current");
      $(this).closest(".member-reminder-wrapper").removeClass("current")
      $(".tab-content").find(".summary-table-wrapper").slideUp();
    } else {
      $(".member-reminder-wrapper").removeClass("current");
      $(".final-summary-wrapper .page-width-inner-wrapper .member-reminder-wrapper .heading, .final-summary-wrapper .page-width-inner-wrapper .tab-content .heading").removeClass("current");
      $(this).closest(".member-reminder-wrapper").addClass("current")
      $(this).addClass("current");
      $(this).parent(".tab-content").find(".summary-table-wrapper").slideToggle();
      $(this).parent(".tab-content").prevAll(".tab-content").find(".summary-table-wrapper").slideUp();
      $(this).parent(".tab-content").nextAll(".tab-content").find(".summary-table-wrapper").slideUp();
    }
  });
  $('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})
  // product option popup open
  $(document).on("click", ".open-product-edit-popup", function(){
    var parentSelect = $(this).closest(".edit-product-data-card");
    var productEditOptionPopup = parentSelect.find(".product-edit-popup-wrap");
    var productType = parentSelect.attr("data-product-type");
    parentSelect.find(".edit-item-btn").addClass("disabled");
    var currentSelected = '';
    if (parentSelect.find(".option-1").length>0) {
      var optionVal = parentSelect.find(".option-1").attr("data-value").toLowerCase();
      currentSelected = parentSelect.find(".option-1").attr("data-value");
      parentSelect.find(`[data-option-index="0"]`).find(`[type="radio"][data-value="${optionVal}"]`).prop("checked", true);
    }
    if (parentSelect.find(".option-2").length>0) {
      var optionVal2 = parentSelect.find(".option-2").attr("data-value").toLowerCase();
      currentSelected = currentSelected +' / '+ parentSelect.find(".option-2").attr("data-value");
      parentSelect.find(`[data-option-index="1"]`).find(`[type="radio"][data-value="${optionVal2}"]`).prop("checked", true);
    }
    if (parentSelect.find(".option-3").length>0) {
      var optionVal3 = parentSelect.find(".option-3").attr("data-value").toLowerCase();
      currentSelected = currentSelected +' / '+ parentSelect.find(".option-3").attr("data-value");
      parentSelect.find(`[data-option-index="2"]`).find(`[type="radio"][data-value="${optionVal3}"]`).prop("checked", true);
    }    
    var selectedVariant =  $(this).closest(".edit-product-data-card").find(".product-edit-popup-wrap").find(`option[data-variant-title='${currentSelected}']`).attr('value');
    $(`.look-product-list-wrapper .edit-product-data-card[data-product-type="${productType}"]`).find(`.product-variant-option option[data-variant-title='${currentSelected}']`).closest('.product-variant-option').val(selectedVariant).change();
    $.fancybox.open(productEditOptionPopup);
  });

  // Change varint on change / Click
  $(document).on("change", `.swatch-product-wrapper [type="radio"]`, function (){
    let parentElement = $(this).closest('.product-edit-popup-wrap');
    theme_custom.editItemPopup(parentElement);
  });

  // Update Variant functiom
  $(document).on("click", ".pdp-updates-button", function(){
    var button = $(this), variantTitle = '';
    var parentElement = $(this).closest(".product-edit-popup-wrap");
    var productType = $(this).closest(".product-edit-popup-wrap").attr("data-product-type");
    if(parentElement.find('[data-option-index="0"] input:checked').length > 0){
      variantTitle = parentElement.find(`[data-option-index="0"]`).find(`[type="radio"]:checked`).val();
    }
    if(parentElement.find('[data-option-index="1"] input:checked').length > 0){
      variantTitle = variantTitle + ' / ' + parentElement.find(`[data-option-index="1"]`).find(`[type="radio"]:checked`).val();
    }
    if(parentElement.find('[data-option-index="2"] input:checked').length > 0){
      variantTitle = variantTitle + ' / ' + parentElement.find(`[data-option-index="2"]`).find(`[type="radio"]:checked`).val();
    }    
    var targetVarID = $(this).closest(".product-edit-popup-wrap").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).val(),
        targetVarTitle = $(this).closest(".product-edit-popup-wrap").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-title"),
        targetVarImage = $(this).closest(".product-edit-popup-wrap").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-image"),
        targetVarInventoryPolicy = $(this).closest(".product-edit-popup-wrap").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-inventory-policy"),
        targetVarInventoryQty = $(this).closest(".product-edit-popup-wrap").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-inventory-quantity"),
        variantEstimateDate = $(this).closest(".product-edit-popup-wrap").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-estimate-date"),
        buttonText = button.data("text"),
        dataProductType = button.attr("data-product-type").toLowerCase();
        button.removeClass("disabled");
    button.text(buttonText);
    var targetVarTitleArr = targetVarTitle.split(" / ");
    if(targetVarTitleArr[0]!=''){ 
      $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(".option-1").attr("data-value",targetVarTitleArr[0]).text(targetVarTitleArr[0]);
      if(dataProductType == 'jacket'){
        $(`.jacket-variant-title`).find('.option-1').text(targetVarTitleArr[0]);
        if($(`.vest-variant-title`).hasClass(`vest-not-selected`)){
          $(`[data-product-type="vest"] [data-option-index="0"]`).find(`label[data-option-value="${targetVarTitleArr[0]}"]`).click();
          $(`.vest-variant-title,.edit-product-data-card[data-product-type="vest"]`).find('.option-1').text(targetVarTitleArr[0]);
        }
      }
      if(dataProductType == 'pants'){
        $(`.pants-variant-title`).find('.option-1').text(targetVarTitleArr[0]);
      }
      if(dataProductType == 'vest'){
        $(`.vest-variant-title`).find('.option-1').text(targetVarTitleArr[0]);
      }
    } 
    if(targetVarTitleArr[1] != ''){
      $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(".option-2").attr("data-value",targetVarTitleArr[0]).text(targetVarTitleArr[1]);
      if(dataProductType == 'jacket'){
        $(`.jacket-variant-title`).find('.option-2').text(targetVarTitleArr[1]);
        if($(`.vest-variant-title`).hasClass(`vest-not-selected`)){
          $(`[data-product-type="vest"] [data-option-index="0"]`).find(`label[data-option-value="${targetVarTitleArr[1]}"]`).click();
          $(`.vest-variant-title,.edit-product-data-card[data-product-type="vest"]`).find('.option-2').text(targetVarTitleArr[1]);
          $(`.vest-variant-title`).find(`.combo-block-edit-item`).attr("data-button-label","edit-item").text("Edit Item");
        }
      }
      if(dataProductType == 'pants'){
        $(`.pants-variant-title`).find('.option-2').text(targetVarTitleArr[1]);
      }
      if(dataProductType == 'vest'){
        $(`.vest-variant-title`).find('.option-2').text(targetVarTitleArr[1]);
      }
    } 
    if(targetVarTitleArr[2] != ''){
      $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(".option-3").attr("data-value",targetVarTitleArr[1]).text(targetVarTitleArr[2]); 
      if(dataProductType == 'jacket'){
        $(`.jacket-variant-title`).find('.option-3').text(targetVarTitleArr[2]);
        $(`.jacket-variant-title`).find(`.option-name, .break`).show();
        $(`.jacket-variant-title`).find(`.error-message`).removeClass('error-show').text('');
        $(`.jacket-variant-title`).find(`.combo-block-edit-item`).attr("data-button-label","edit-item").text("Edit Item");
        if($(`.vest-variant-title`).hasClass(`vest-not-selected`)){
          $(`.vest-variant-title,.edit-product-data-card[data-product-type="vest"]`).find('.option-3').text(targetVarTitleArr[2]);
          $(`.vest-variant-title`).find(`.error-message`).removeClass('error-show').text('');
          $(`.vest-variant-title`).find(`.option-name, .break, .combo-block-edit-item`).show();
          $(`.product-edit-popup-wrap[data-product-type="vest"]`).find(`.product-variant-option option[data-variant-title="${targetVarTitle}"]`).prop("selected",true);
          $(`.edit-product-data-card[data-product-type="vest"]`).find(`.break`).show();
        }
      }
      if(dataProductType == 'pants'){
        $(`.pants-variant-title`).find('.option-3').text(targetVarTitleArr[2]);
        $(`.pants-variant-title`).find(`.option-name, .break`).show();
        $(`.pants-variant-title`).find(`.error-message`).removeClass('error-show').text('');
        $(`.pants-variant-title`).find(`.combo-block-edit-item`).attr("data-button-label","edit-item").text("Edit Item");
      }
      if(dataProductType == 'vest'){
        $(`.vest-variant-title`).find('.option-3').text(targetVarTitleArr[2]);
        $(`.vest-variant-title`).find(`.option-name, .break`).show();
        $(`.vest-variant-title`).find(`.error-message`).removeClass('error-show').text('');
      }
    }
    if(productType=='jacket'){
      $(`.product-variant-wrap[data-product-type="jacket"]`).find(".estimated-variant-error-block-wrap").removeClass("active");
    } else if (productType=='pants') {
      $(`.product-variant-wrap[data-product-type="pants"]`).find(".estimated-variant-error-block-wrap").removeClass("active");
    } else {
      $(`.product-data-card[data-product-type="${productType}"]`).find(".estimated-variant-error-block-wrap").removeClass("active");
    }
    if(targetVarID){
      if(targetVarInventoryPolicy == 'continue'){
        if(theme_custom.current_date < variantEstimateDate ) {
          if(targetVarInventoryQty <= 0) {
            if(productType=='jacket'){
              $(`.product-variant-wrap[data-product-type="jacket"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
            } else if (productType=='pants') {
              $(`.product-variant-wrap[data-product-type="pants"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
            } else {
              $(`.product-data-card[data-product-type="${productType}"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
            }
          }
        }
      } else {
        if(productType=='jacket'){
          $(`.product-variant-wrap[data-product-type="jacket"]`).find(".estimated-variant-error-block-wrap").removeClass("active");;
        } else if (productType=='pants') {
          $(`.product-variant-wrap[data-product-type="pants"]`).find(".estimated-variant-error-block-wrap").removeClass("active");;
        } else {
          $(`.product-data-card[data-product-type="${productType}"]`).find(".estimated-variant-error-block-wrap").removeClass("active");;
        }
      }
    }   
    $(`.product-edit-popup-wrap[data-product-type="${dataProductType}"]`).find(`.product-variant-option option[data-variant-title="${targetVarTitle}"]`).prop("selected",true);
    $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(".product-image img").attr("src",targetVarImage);
    $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(`.error-message`).removeClass(`error-show`).text('').hide();
    $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(`.open-product-edit-popup`).attr(`data-button-label`,`edit-item`).text("Edit Item");
    $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(`.variant-title .option-name,.break`).show()
    $(`.look-product-list-wrapper .product-data-card[data-product-type="${dataProductType}"]`).find(".product_varariant_id").val(targetVarID).attr("data-variant-inventory-quantity",targetVarInventoryQty).attr("data-variant-inventory-policy",targetVarInventoryPolicy);
    button.text("Updated");
    $(".fancybox-button").click();
  });

  // Product Add to cart Function
  $(document).on("click", ".cta-action-add-to-cart", function(e){
    if(getCookie("fit-finder-data")== '' && $(`[data-button-label="select-size"]`).length > 0){
      $(`.jacket-variant-title .option-1, .jacket-variant-title .option-2, .jacket-variant-title .option-3,.vest-variant-title .option-1,.vest-variant-title .option-2,.vest-variant-title .option-3,.pants-variant-title .option-1,.pants-variant-title .option-2,.pants-variant-title .option-3, .break, .edit-product-data-card[data-product-type="shoes"] .option-1, .edit-product-data-card[data-product-type="shoes"] .option-2,.edit-product-data-card[data-product-type="shirt"] .option-1, .edit-product-data-card[data-product-type="shirt"] .option-2,.edit-product-data-card[data-product-type="shirt"] .option-3`).hide();
      if($(`.jacket-variant-title [data-button-label="select-size"]`).length > 0){
        $(`.jacket-variant-title .combo-block-edit-item`).text('Select size').attr("data-button-label","select-size");
        $(`.vest-variant-title`).addClass("vest-not-selected");
        $(`.vest-variant-title.vest-not-selected`).find(`.combo-block-edit-item, .break`).hide();
      }
      if($(`.pants-variant-title [data-button-label="select-size"]`).length > 0){
        $(`.jacket-variant-title .combo-block-edit-item`).text('Select size').attr("data-button-label","select-size");
      }
      if($(`.edit-product-data-card[data-product-type="shirt"] .open-product-edit-popup [data-button-label="select-size"]`).length > 0){
        $(`.edit-product-data-card[data-product-type="shirt"] .open-product-edit-popup`).text('Select size').attr("data-button-label","select-size");
      }
      if($(`.edit-product-data-card[data-product-type="shoes"] [data-button-label="select-size"]`).length > 0){
        $(`.edit-product-data-card[data-product-type="shoes"] .open-product-edit-popup`).text('Select size').attr("data-button-label","select-size");
      }
      $(`.cta-action-add-to-cart`).removeClass("fit-finder-blank");
    }
    if($(`[data-button-label="select-size"]`).length > 0) {
      $('.error-message').show();
      $('html, body').stop().animate({
        'scrollTop': $(`[data-button-label="select-size"]:first`).offset().top - $("#shopify-section-header").height() + 10
      }, "slow");
      return false;
    }
    if($(".error-message.error-show").length > 0) {
      let parent = $(".error-message.error-show").closest('.product-data-card');
      if(parent.length>0){
        $('html, body').stop().animate({
          'scrollTop': $(parent).offset().top - $("#shopify-section-header").height() + 10
        }, "slow");
        return false;
      }
      else{
        $('html, body').stop().animate({
          'scrollTop': $(".error-message.error-show").offset().top - $("#shopify-section-header").height() + 10
        }, "slow");
        return false;    
      }
    }
    if($(".template-page-create-event").length > 0){
      var parent = $(".multi-item-add-to-cart"); 
    } else {
      var parent = $(this).closest(".multi-item-add-to-cart"); 
    }
    var button = $(this);
    theme_custom.multiItemAddToCart(button, parent);
  });

  // view - hide look products
  $(document).on("click", ".view-look",function(){
    if(getCookie("fit-finder-data") == '' || getCookie("fit-finder-data") == 'blank'){
      $(`.jacket-variant-title .option-1, .jacket-variant-title .option-2, .jacket-variant-title .option-3,.vest-variant-title .option-1,.vest-variant-title .option-2,.vest-variant-title .option-3,.pants-variant-title .option-1,.pants-variant-title .option-2,.pants-variant-title .option-3, .break, .edit-product-data-card[data-product-type="shoes"] .option-1, .edit-product-data-card[data-product-type="shoes"] .option-2,.edit-product-data-card[data-product-type="shirt"] .option-1, .edit-product-data-card[data-product-type="shirt"] .option-2,.edit-product-data-card[data-product-type="shirt"] .option-3`).hide();
      $(`.jacket-variant-title .combo-block-edit-item, .pants-variant-title .combo-block-edit-item, .edit-product-data-card[data-product-type="shirt"] .open-product-edit-popup, .edit-product-data-card[data-product-type="shoes"] .open-product-edit-popup`).text('Select size').attr("data-button-label","select-size");
      $(`.jacket-variant-title, .pants-variant-title, .edit-product-data-card[data-product-type="shirt"], .edit-product-data-card[data-product-type="shoes"]`).find(`.error-message`).text("Please Select Size!")
      $(`.vest-variant-title`).addClass("vest-not-selected");
      $(` .vest-variant-title.vest-not-selected`).find(`.combo-block-edit-item, .break`).hide();
    } else {
      theme_custom.setFitFinderProduct();
    }
    if($(this).attr("data-text")=='View Look') {
      $(this).text("View Look").attr("data-text","Hide Look");
      $(".event-owner-look-product-list.look-product-list-wrapper .look-product-details").removeClass("show");
    } else {
      $(this).text("Hide Look").attr("data-text","View Look");
      $(".event-owner-look-product-list.look-product-list-wrapper .look-product-details").addClass("show");
    }
    $('html, body').stop().animate({
      'scrollTop': $(this).closest(".order-wrap-block").offset().top - $("#shopify-section-header").height() + 10
    }, "slow");
  });

  $(document).on("click", ".event-payment-for-guest", function (e) {
    e.preventDefault();
    var button = $(this);
    button.text('Paying.....');
    var data = {
      'event_id': $(this).attr("data-event-id"),
      'member_id': $(this).attr("data-member-id"),
      'look_id': $(this).attr("data-look-id"),
      'look_title': $(this).attr("data-look-name"),
      'look_image': $(this).attr("data-look-image"),
      'order_amount': $(this).attr("data-look-price")
    };
    $.ajax({
      url: `${theme_custom.base_url}/api/event/addeventdata`,
      method: "POST",
      data: data,
      dataType: "json",
      async: true,
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        button.text('Paying.....');
        var paymentURL = `${theme_custom.base_url}/payment/${result.data.event_id}/${result.data.member_id}/${result.data.look_id}`;
        window.location.href = paymentURL;
      },
      error: function (xhr, status, error) {
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          alert('Something went wrong Please try again !');
          setTimeout(() => {
            theme_custom.removeLocalStorage();
            window.location.href = '/account/logout';
          }, 5000);
        }
      }
    })
  });

  $(document).on('click', '.user-card-block .action-icon .edit-icon', function (event) {
    let parent = $(this).closest('.look-card-block');
    let mainParent = $(this).closest('.user-card-block');
    let data = $('.user-data-script', mainParent).html();
    if (data) {
      data = JSON.parse(data);
      let popup = $('[data-target="update-guest-popup"]');
      let firstName = $('[name="first_name"]', popup);
      let lastName = $('[name="last_name"]', popup);
      let lookName = $('.look-name', popup);
      let email = $('.member-email', popup);
      let phone = $('.member-phone', popup);
      let memberId = data.event_member_id;
      let payHost = $('[name="is_host_paying_update"][data-val="1"]', popup);
      let payOther = $('[name="is_host_paying_update"][data-val="0"]', popup);

      firstName.val(data.first_name).trigger('change');
      lastName.val(data.last_name).trigger('change');
      email.val(data.email).trigger('change');
      if(data.phone != null || data.phone != undefined){
        var phone_number; 
        if (data.phone.indexOf('+1') == -1){
          phone_number = `+1${data.phone}`
        } else {
          phone_number = data.phone
        }
        // console.log('phone_number',phone_number);
        phone.val(phone_number.slice(2)).trigger('change');
        $(`[name="phone"]`).keydown()
      }
      lookName.text(data.look_name);
      if (data.is_host_paying.toLowerCase() == 'self') {
        $(payHost).prop('checked', true);
      } else {
        $(payOther).prop('checked', true);
      }
      $(payHost).attr('id', `yes-${memberId}`);
      $(payOther).attr('id', `no-${memberId}`);
      $(payHost).closest('.custom_checkbox').find('label').attr('for', `yes-${memberId}`);
      $(payOther).closest('.custom_checkbox').find('label').attr('for', `no-${memberId}`);
      $('.update-guest', popup).attr('data-member-id', memberId)
      popup.addClass('active');
    }
    $('html,body').css({
      "overflow" : "hidden"
    })
  });

  $(document).on('click', '.user-card-block .action-icon .member-delete-icon', function (event) {
    event.preventDefault();
    if ($(this).hasClass("payment-Complete")) {
      $(`.modal-wrapper[data-target="member-payment-complete"]`).addClass("active");
      $('html,body').css({
        "overflow" : "hidden"
      })
      return false
    }
    let parent = $(this).closest('.look-card-block');
    let member_id = $(this).attr('data-member-id');
    let event_id = parent.attr('data-event-id');
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".member_id").val(member_id);
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".heading").text("Are you sure you want to delete this member?");
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".member_id").attr("data-type", "member-block");
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".event_id").val(event_id);
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).addClass("active");
    $('html,body').css({
      "overflow" : "hidden"
    })
    // theme_custom.removeUserFromLook(event_id,member_id);
  });

  $(document).on('click', '.look-card-block .delete-icon', function (event) {
    event.preventDefault();
    if ($(this).hasClass("look-have-member")) {
      $(`.modal-wrapper[data-target="delete-look-have-member"]`).addClass("active");
      $('html,body').css({
        "overflow" : "hidden"
      })
      return false;
    }
    var eventLookId = $(this).data('event-look-id');
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".look_id").val(eventLookId);
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".heading").text("Are you sure you want to delete this Look?");
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".member_id").attr("data-type", "delete-look-block");
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).addClass("active");
    $('html,body').css({
      "overflow" : "hidden"
    })
  });

  $(document).on("click", `[data-target="remove-data-for-user"] button`, function () {

    var target = $(this).attr('data-value');
    var checkData = $(this).closest(".modal-wrapper-inner-wrapper").find(".member_id").attr("data-type");
    if (target == 'yes') {
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
      if (checkData == 'member-block') {
        var event_id = $(this).closest(".modal-wrapper-inner-wrapper").find(".event_id").val();
        var member_id = $(this).closest(".modal-wrapper-inner-wrapper").find(".member_id").val();
        theme_custom.removeUserFromLook(event_id, member_id);
        theme_custom.globalLoaderShow();
      }
      if (checkData == 'delete-look-block') {
        var eventLookId = $(this).closest(".modal-wrapper-inner-wrapper").find(".look_id").val();
        theme_custom.deleteTheLooksItem(eventLookId);
      }
    } else {
      $('html,body').css({
        "overflow" : "auto"
      })
      $('.close-icon').click();
    }

  })
  $(document).on("click", `[data-target="delete-look-have-member"] button`, function () {
    $(`.modal-wrapper[data-target="delete-look-have-member"]`).removeClass("active");
    $('html,body').css({
      "overflow" : "auto"
    })
  })
  $(document).on("click", `[data-target="member-payment-complete"] button`, function () {
    $(`.modal-wrapper[data-target="member-payment-complete"]`).removeClass("active");
    $('html,body').css({
      "overflow" : "auto"
    })
  })
  $(document).on('click', '.pay-info-confirmation-wrap .confirm-box-wrap .update-host-look', function (event) {
    let value = $(this).attr('data-value');
    let parent = $(this).closest('.look-card-block');
    let look_id = parent.attr('data-look-id');
    let member_id = parent.attr('data-host-id');
    if (value == 'yes') {
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
      theme_custom.lookAssignToMember(member_id, look_id)
    } else {
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
      var event_id = localStorage.getItem("set-event-id");
      var event_member_id =  parent.attr('data-host-id');
      theme_custom.removeOwnerFromLook(look_id,event_id,event_member_id);
    }
  })
  $(document).on('click', '.custom-paginate-next', function (event) {
    event.preventDefault();

    var url = $(this).attr('data-href');
    $.ajax({
      url: url,
      dataType: 'html',
      success: function (data) {
        $("#browser-top-looks").find(".product-wrapper").html(data);
        theme_custom.updateSelectedLooks($('#browser-top-looks'))
        $(`#browser-top-looks`).find(`.product-price`).text(`Starting at $199.99`)
      }
    });
  });

  theme_custom.lookAddedIntoEvent()

  // customise-look-button 
  $(document).on("click", ".customise-look-button", function () {
    if($(this).hasClass("look-have-member")){
      $(`.modal-wrapper[data-target="delete-look-have-member"]`).find(".inner-wrapper p").text("Look can't be customized since a member is already assigned to it, Please remove the member in order to customize the look.");
      $(`.modal-wrapper[data-target="delete-look-have-member"]`).addClass("active");
      return false;
    }
    localStorage.removeItem("customise-look-button-for-add-look-into-event");
    localStorage.removeItem("customizerlookFrom");
    localStorage.removeItem("editLookId");
    localStorage.removeItem("editLookName");
    localStorage.removeItem('look-for-favourite');
    
    localStorage.setItem("customizerlookUrl", $(this).attr("data-href").split('?')[1]);
    localStorage.setItem("customize-from-event", "true");
    localStorage.setItem("eventLookId", $(this).attr("look-mapping-id"));
    localStorage.setItem("eventLookName", $(this).attr("edit-look-name"));
    window.location.href = $(this).attr("data-href");
  })

  // customise-look-button-for-add-look-into-event
  $(document).on("click", ".customise-look-button-for-add-look-into-event", function () {

    localStorage.removeItem("customize-from-event");
    localStorage.removeItem("customizerlookFrom");
    localStorage.removeItem("eventLookId");
    localStorage.removeItem("eventLookName");
    localStorage.removeItem("editLookId");
    localStorage.removeItem("editLookName");
    localStorage.removeItem('look-for-favourite');
    
    localStorage.setItem("customizerlookUrl", $(this).attr("data-href").split('?')[1]);
    localStorage.setItem("customise-look-button-for-add-look-into-event", "true");
        
    window.location.href = $(this).attr("data-href");
  })

  // Create Event API Functionality
  $(document).on("click", ".event-page-new-design-wrapper .create-event-button", function () {
    theme_custom.createEventAPI($(this));
  });

  // update Event API Functionality
  $(document).on("click", ".event-page-new-design-wrapper .event-update-button", function () {
    theme_custom.updateEventAPI($(this));
  })

  // Next button 
  $(document).on("click", ".event-page-new-design-wrapper .next-button", function () {
    $(".event-step-wrapper").addClass("hidden");
    $(".loader-wrapper").removeClass("hidden");
    $(".step-content-wrapper").removeClass("active");
    var target = $(this);
    let goNext = true;
    var nextTarget = target.closest(".step-content-wrapper").next(".step-content-wrapper").attr("data-step-content-wrap");
    if ($(this).closest(`.step-content-wrapper[data-step-content-wrap="1"]`).length > 0) {
      $(`.step-content-wrapper[data-step-content-wrap="2"]`).find(".event-block-wrap").hide();
      theme_custom.checkLooks(localStorage.getItem("set-event-id"), nextTarget);
      goNext = false;
    }
    if ($(this).closest(`.step-content-wrapper[data-step-content-wrap="2"]`).length > 0) {
      theme_custom.checkLooks(localStorage.getItem("set-event-id"), nextTarget, false);
      goNext = false;
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.setFitFinder();
      theme_custom.eventMemberData();
    }
    if (goNext) {
      theme_custom.changeStep(nextTarget);
    }
  });

  // Previous Button
  $(document).on("click", ".event-page-new-design-wrapper .previous-button", function () {
    $(".event-step-wrapper").addClass("hidden");
    $(".loader-wrapper").removeClass("hidden");
    $(".step-content-wrapper").removeClass("active");
    let goNext = true;
    var target = $(this);
    var currentTabHead = target.closest(".step-content-wrapper").attr("data-step-content-wrap");
    var prevTarget = target.closest(".step-content-wrapper").prev(".step-content-wrapper").attr("data-step-content-wrap");
    prevTarget = parseInt(prevTarget);
    if ($(this).closest(`.step-content-wrapper[data-step-content-wrap="2"]`).length > 0) {
      theme_custom.checkLooks(localStorage.getItem("set-event-id"), prevTarget, false);
      goNext = false;
    }
    if ($(this).closest(`.step-content-wrapper[data-step-content-wrap="3"]`).length > 0) {
      if (theme_custom.globalEventData) {
        theme_custom.checkLooks(localStorage.getItem("set-event-id"), prevTarget, false);
      } else {
        theme_custom.checkLooks(localStorage.getItem("set-event-id"), prevTarget, true);
      }
      goNext = false;
    }
    if (goNext) {
      theme_custom.changeStep(prevTarget);
      theme_custom.globalLoaderhide();
    }
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
  $(document).on("click", ".popup-button", function () {
    var targetEl = $(this).attr("data-swatch-title");
    $(`.modal-wrapper`).removeClass("active");
    let popup = $(`.modal-wrapper[data-target="${targetEl}"]`);
    theme_custom.updateSelectedLooks(popup);
    $(popup).addClass("active");
    $(`html,body`).css({
      "overflow": "hidden"
    })
  })

  // popup close 
  $(".modal-wrapper .close-icon").click(function () {
    $(this).closest(".modal-wrapper").removeClass("active");
    if ($(".show-look-from-event-wrapper .event-look-inner-wrapper").find(".guest-top-looks.event-has-look").length > 0) {
      $(".show-look-from-event-wrapper").show();
      $(".create-event-look .event-block-wrap").hide();
    } else {
      $(".show-look-from-event-wrapper").hide();
      $(".create-event-look .event-block-wrap").show();
    }
    $(`html,body`).css({
      "overflow": "auto"
    })
  })

  // Add new Look into event 
  $(document).on("click", ".show-look-from-event-wrapper .add-look-wrapper", function () {
    $(this).closest(".show-look-from-event-wrapper").hide();
    $(this).closest(".step-content-wrapper").find(".event-block-wrap").show();
  })

  // open add guest member popup  
  $(document).on("click", ".add-guest-button", function () {
    $(".look-dropdown").find(".look-name").attr("data-look-mapping-id", '').text('');
    $(`.modal-wrapper[data-target="add-guest-popup"]`).addClass("active");
    $(`[name="is_host_paying"]`).prop('checked', false);
    $(`[type="text"],[type="tel"]`).val('');
    var look_id = $(this).closest(".look-card-block").attr("data-look-id");
    var look_title = $(this).closest(".look-card-block").find(".look-title").text();
    $(".look-dropdown").find(".look-name").attr("data-look-mapping-id", look_id).text(look_title);
    $('html,body').css({
      "overflow" : "hidden"
    })
  })
}
theme_custom.calender = function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  var reminderDate = mm + '-' + dd + '-' + yyyy;
  $('#event_date').attr('min', today);
  $("#reminderDate").attr("data-current-data",today).text(reminderDate);
}
theme_custom.eventLookSlider = function () {
  $('.create-event-look .event-look-inner-wrapper, .guest-top-looks .event-look-inner-wrapper').slick({
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
          adaptiveHeight: true
        }
      }
    ]
  });
}
theme_custom.changeFilled = function () {
  $(document).on(`change`, `#EventForm-EventName, [name="event-type"], #event_date, [name="event-role"], .phone-number`, function () {
    theme_custom.checkUpdateEvent("event_name", $(this).val(), $(this).attr("data-id"));
  });
}
theme_custom.event_init_page = function () {
  theme_custom.getAllEvents();
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
theme_custom.eventExpired = function (data){
  if(theme_custom.eventExpire){
    // if(data.event_looks.length <= 0){
    //   $('.step-content-wrapper.create-event-look .next-button').addClass('next-disabled');
    // }
    // $('.event-update-button').hide()
    // $('.look-card-block .delete-icon').hide();
    // $('.look-card-block .customise-look-button').hide();
    // $('.user-card-block .edit-icon').hide();
    // $('.user-card-block .member-delete-icon').hide();
    // $('.look-card-block .confirm-box-wrap').hide();
    // $('.add-guest-button').hide();
    // $('.add-look-wrapper').hide();
    // $('.summary-table-wrapper .action-button').hide();
    // $('.action-btn-th').hide();
    // $('.summary-footer-cost-label').attr('colspan',2);
    $('.reminder-wrap,.open-reminder-popup').hide();
  }
}
theme_custom.getEventDetails = function () {
  $(".step-content-wrapper").removeClass("active");
  var eventId = localStorage.getItem("set-event-id");
  $("#event-id").val(localStorage.getItem("set-event-id"));
  $.ajax({
    url: `${theme_custom.base_url}/api/event/${eventId}`,
    method: "GET",
    data: '',
    dataType: "json",
    async: true,
    headers: {
      // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      var eventLooksSize = result.data.event_looks;
      if(eventLooksSize.length == 0){
        $(".create-event-look").find(".next-button").addClass("event-has-not-look");
        $(".create-event-look .event-block-wrap").find(".error-message").addClass("error-show");
      }
      eventDataObj.eventName = result.data.event_name;
      eventDataObj.eventType = result.data.event_type;
      eventDataObj.eventDate = result.data.event_date;
      eventDataObj.eventRole = result.data.event_role;
      eventDataObj.eventSuitColor = result.data.event_suit_color;
      var currentDate = new Date();
      year  = currentDate.getFullYear();
      month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      day   = (currentDate.getDate() + 1).toString().padStart(2, "0");
      var checkEventExpireate = year + '-' + month + '-' + day;
      // console.log(checkEventExpireate,eventDataObj.eventDate);
      if(new Date(checkEventExpireate) >= new Date(eventDataObj.eventDate)){
        theme_custom.eventExpire = true;
        theme_custom.eventExpired(result.data);
      }

      $('#EventForm-EventName').val(result.data.event_name);
      $('#EventForm-id').val(result.data.event_id);
      if (result.data.event_type == 'Special Event') {
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="special event"]`).removeClass("hidden");
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="wedding"]`).addClass("hidden");
      } else {
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="wedding"]`).removeClass("hidden");
        $(`.role-in-event-wrap .Squer-radio-button-inner[data-class="special event"]`).addClass("hidden");
      }
      $(`.Squer-radio-button-inner input[name="event-type"][value="${result.data.event_type}"]`).prop('checked', true);
      $(`.Squer-radio-button-inner input[name="event-role"][data-value="${result.data.event_role}"]`).prop('checked', true);
      $('#event_date').val(result.data.event_date);
      $('.event-data-first-step').datepicker('setDate', new Date(result.data.event_date));
      var memerData = '';
      var total = result.data.event_members.length;
      var event_member = '';
      $.each(result.data.event_members, function (index, value) {
        if(value.is_host == 1){
          event_member = '';
        } else {
          event_member = 'event-member';
        }
        if (value.is_host == 1) {
          eventDataObj.eventPhone = value.phone.replace("+1", "");
          $("#event-phone-number").val(value.phone.replace("+1", ""));
          $('#EventForm-EventOwnerContactNumber').val(value.phone.replace("+1", "")).trigger("keyup");
        }
        if (index === total - 1) {
          memerData += `<span type="text" class="reminderMember  ${event_member}" name="reminderMember" data-member-id="${value.event_member_id}" style="font-size: 14px;">${value.first_name} ${value.last_name}</span>`
        } else {
          memerData += `<span type="text" class="reminderMember  ${event_member}" name="reminderMember" data-member-id="${value.event_member_id}" style="font-size: 14px;">${value.first_name} ${value.last_name},</span>`
        }
      });
      $('.reminder-redesign-popup .event-member-data').html('');
      $('.reminder-redesign-popup .event-member-data').append(memerData);
      $(".create-event-button").addClass("next-button").removeClass("create-event-button").find(".look-add-btn").removeClass("hidden");
      $(`.step-content-wrapper[data-step-content-wrap="1"]`).addClass("active");
      $(`.step-content-wrapper[data-step-content-wrap="1"]`).find(".event-update-button").removeClass("disabled").removeClass("hidden")
      if (location.href.includes('?step')) {
        theme_custom.checkLooks(localStorage.getItem("set-event-id"));
        $(".step-wrap").addClass("active");
        $(`.step-content-wrapper[data-step-content-wrap="2"]`).find(".next-button").click();
        $(".loader-wrapper").addClass("hidden");
        $(".event-step-wrapper, .step-header-wrap, .step-content-wrapper").removeClass("hidden");
        // setTimeout(() => {
        //   var currentLocation = window.location.href.split('?')[0];
        //   history.pushState({}, null, `${currentLocation}`);
        // }, 3000);
      }
      if (localStorage.getItem("back-to-event-page") != null || localStorage.getItem("showEventStepSecond") != null || localStorage.getItem("go-to-event-page") != null) {
        $(".event-page-new-design-wrapper .loader-wrapper").removeClass("hidden");
        $(".event-page-new-design-wrapper .event-step-wrapper").addClass("hidden");
        setTimeout(() => {
          $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
          if (localStorage.getItem("back-to-event-page") != null) {
            localStorage.removeItem("back-to-event-page");
          }
          if (localStorage.getItem("showEventStepSecond") != null) {
            localStorage.removeItem("showEventStepSecond")
          }
          if (localStorage.getItem("go-to-event-page") != null) {
            localStorage.removeItem("go-to-event-page");
          }
        }, 1500);
      } else {
        $(".loader-wrapper").addClass("hidden");
        $(".event-step-wrapper").removeClass("hidden");
      }
      setTimeout(() => {
        $(`.suit-color-value[data-value="${result.data.event_suit_color}"]`).closest(`.suit-color-wrap`).addClass("active");
        var targetElement = $(`.suit-color-wrap.active`).clone();
        $(`.suit-color-wrap.active`).remove();
        $(`.suit-color-wrapper`).prepend(targetElement);
        theme_custom.EventSuitColorWrapper();
      }, 500);
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
theme_custom.deleteTheLooksItem = function (eventLookId) {
  var removeSelectedLook = $(`.look-card-block[data-look-mapping-id="${eventLookId}"]`);
  if (eventLookId) {
    $(".event-page-new-design-wrapper").find(".loader-wrapper").removeClass("hidden");
    $(".event-page-new-design-wrapper").find(".event-step-wrapper").addClass("hidden");
    $.ajax({
      url: `${theme_custom.base_url}/api/look/removeFromEvent/${eventLookId}`,
      method: "DELETE",
      data: '',
      dataType: "json",
      async: true,
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
        // $('.favorite-looks-wrapper').css('cursor','not-allowed');
      },
      success: function () {
        removeSelectedLook.remove();
        $(".modal-wrapper").removeClass("active");
        if ($(".show-look-from-event-wrapper").find(".look-card-block").length == 0) {
          $(".step-content-wrapper.create-event-look").find(".event-block-wrap").show();
          $(".step-content-wrapper.create-event-look").find(".show-look-from-event-wrapper").hide();
        }
        setTimeout(() => {
          // $(".event-page-new-design-wrapper").find(".loader-wrapper").addClass("hidden");
          // $(".event-page-new-design-wrapper").find(".event-step-wrapper").removeClass("hidden");
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
theme_custom.checkUpdateEvent = function (checkEventData, value, selector) {
  if ((selector == 'event-name' && (checkEventData == "event_name" && eventDataObj.eventName != value)) || (selector == 'event-date' && (checkEventData == "event_name" && eventDataObj.eventDate != value)) || (selector == 'event-type' && (checkEventData == "event_name" && eventDataObj.eventType != value)) || (selector == 'event-phone' && (checkEventData == "event_name" && eventDataObj.eventPhone != value)) || (selector == 'event-role' && (checkEventData == "event_name" && eventDataObj.eventRole != value))) {
    $(".event-update-button").removeClass("disabled");
  } else {
    $(".event-update-button").addClass("disabled");
  }
}
$(document).ready(function () {
  // theme_custom.updateEvent();
  $("#event_date").datepicker({
    dateFormat: 'mm-dd-yy',
    minDate: 0
  });
  // window.eventDate = $( ".event-data-first-step" ).datepicker({
  //   format: 'yyyy-mm-dd'
  // });
  window.eventDataObj = {};
  theme_custom.deleteTheLooksItem();
  theme_custom.event_init_page();
  theme_custom.eventChangeEvent();
  if (localStorage.getItem("set-event-id") != null) {
    theme_custom.getEventDetails();
  } else {
    setTimeout(() => {
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapper").removeClass("hidden");
      theme_custom.EventSuitColorWrapper();
    }, 500);
  }
  if (location.href.includes('?step')) {
    $(".loader-wrapper").removeClass("hidden");
    $(".event-step-wrapper, .step-header-wrap, .step-content-wrapper").addClass("hidden");
  }
  $(`[data-step-content-wrap="2"]`).find(".btn-wrap.next-button").addClass("disabled");
})

theme_custom.eventChangeEvent = () => {
  $(document).on('click', '.final-summary-for-event-page-main-wrapper .update-event-fit-finder', function () {
    let parent = $(this).closest('.product-card');
    $(this).text('Updating...');
    $('select', parent).each((i, item) => {
      $(item).attr('data-val', $(item).val());
    })
    theme_custom.eventPageEditMySize($(this));
  });
  $(document).on('change', '.final-summary-for-event-page-main-wrapper select', function () {
    let parent = $(this).closest('.product-card');
    let value = $(this).val();
    let oldVal = $(this).attr('data-val');
    if(!theme_custom.eventExpire){
      if (value == oldVal) {
        $('.button-wrap', parent).addClass('hidden');
      } else {
        $('.button-wrap', parent).removeClass('hidden');
      }
    }
  })
}

theme_custom.eventPageEditMySize = function (btn) {
  if (getCookie("fit-finder-data") != '') {
    $('.event-step-wrapper').addClass('hidden');
    theme_custom.globalLoaderShow();

    var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
    getFitFinder['jacketSize'] = $('#jacket-size').val() + ':' + $('#jacket-type').val().charAt(0);
    getFitFinder['jacketSize_output'] = $('#jacket-size').val() + ':' + $('#jacket-type').val().charAt(0);
    getFitFinder['pants_waist'] = $('#pants-waist').val();
    getFitFinder['pants_waist_output'] = $('#pants-waist').val();
    getFitFinder['pants_hight'] = $('#pants-length').val();
    getFitFinder['pants_hight_output'] = $('#pants-length').val();
    getFitFinder['shirt_neck'] = $('#shirt-neck').val();
    getFitFinder['shirt_neck_output'] = $('#shirt-neck').val();
    getFitFinder['shirt_sleeve'] = $('#shirt-sleeve').val();
    getFitFinder['shirt_sleeve_output'] = $('#shirt-sleeve').val();

    getFitFinder['shoe_size'] = $('#shoes-size').val();
    getFitFinder['shoe_size_output'] = $('#shoes-size').val();
    setCookie("fit-finder-data", JSON.stringify(getFitFinder));
    var fitFinderJsonData = getFitFinder,
      age_qus = fitFinderJsonData.age_qus,
      age = fitFinderJsonData.age,
      build_qus = fitFinderJsonData.build_qus,
      build = fitFinderJsonData.build,
      fit_qus = fitFinderJsonData.fit_qus,
      fit = fitFinderJsonData.fit,
      height_qus = fitFinderJsonData.height_qus,
      height = fitFinderJsonData.height,
      stomach_qus = fitFinderJsonData.stomach_qus,
      stomach = fitFinderJsonData.stomach,
      weight_qus = fitFinderJsonData.weight_qus,
      weight = fitFinderJsonData.weight,
      jacket_size_qus = fitFinderJsonData.jacket_size_qus,
      jacket_size = fitFinderJsonData.jacket_size,
      jacket_type_qus = fitFinderJsonData.jacket_type_qus,
      jacket_type = fitFinderJsonData.jacket_type,
      pants_waist_qus = fitFinderJsonData.pants_waist_qus,
      pants_waist = fitFinderJsonData.pants_waist,
      pants_hight_qus = fitFinderJsonData.pants_hight_qus,
      pants_hight = fitFinderJsonData.pants_hight,
      shirt_neck_qus = fitFinderJsonData.shirt_neck_qus,
      shirt_neck = fitFinderJsonData.shirt_neck,
      shirt_sleeve_qus = fitFinderJsonData.shirt_sleeve_qus,
      shirt_sleeve = fitFinderJsonData.shirt_sleeve,
      shoe_size_qus = fitFinderJsonData.shoe_size_qus,
      shoe_size = fitFinderJsonData.shoe_size,
      jacketSize = fitFinderJsonData.jacketSize,
      jacketSize_result = fitFinderJsonData.jacketSize_result;
    var userID = $("#custom_id_num").val(),
      userEmail = $("#custom_email").val();
    var fitFinder = {
      "customer_id": userID,
      "user_email": userEmail,
      "age_qus": age_qus,
      "age": age,
      "build_qus": build_qus,
      "build": build,
      "fit_qus": fit_qus,
      "fit": fit,
      "height_qus": height_qus,
      "height": height,
      "stomach_qus": stomach_qus,
      "stomach": stomach,
      "weight_qus": weight_qus,
      "weight": weight,
      "jacket_type_question": jacket_type_qus,
      "jacket_type": jacket_type,
      "jacket_size_question": jacket_size_qus,
      "jacket_size": jacket_size,
      "pants_waist_question": pants_waist_qus,
      "pants_waist_output": pants_waist,
      "pants_waist": pants_waist,
      "pants_hight_question": pants_hight_qus,
      "pants_hight_output": pants_hight,
      "pants_hight": pants_hight,
      "shirt_neck_question": shirt_neck_qus,
      "shirt_neck_output": shirt_neck,
      "shirt_neck": shirt_neck,
      "shirt_sleeve_question": shirt_sleeve_qus,
      "shirt_sleeve_output": shirt_sleeve,
      "shirt_sleeve": shirt_sleeve,
      "shoe_size_question": shoe_size_qus,
      "shoe_size_output": shoe_size,
      "shoe_size": shoe_size,
      "jacketSize_output": jacketSize,
      "jacketSize_result": jacketSize_result,
      "jacketSize": jacketSize
    }

    $.ajax({
      url: `${theme_custom.base_url}/api/customer/myFit`,
      method: "POST",
      data: fitFinder,
      dataType: "json",
      async: true,
      header: {
        // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        theme_custom.globalLoaderhide();
        $('.event-step-wrapper').removeClass('hidden');
        $(btn).text('Update');
        $(btn).closest('.button-wrap').addClass('hidden');
      },
      error: function (xhr, status, error) {
        theme_custom.globalLoaderhide();
        $('.event-step-wrapper').removeClass('hidden');
        $(btn).text('Update');
        $(btn).closest('.button-wrap').addClass('hidden');
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          $('.api_error').removeClass("hidden").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
            'text-align': 'center',
            'color': 'red'
          });
          setTimeout(() => {
            theme_custom.removeLocalStorage();
            window.location.href = '/account/logout';
          }, 3000);
        } else {
          var event_date_msg = '';
          if (xhr.responseJSON.data != '') {
            $.map(xhr.responseJSON.data, function (value, index) {
              event_date_msg += `<span>${value}</span>`;
            });
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.api_error').removeClass("hidden").html(event_date_msg);
          setTimeout(function () {
            $('.api_error').addClass("hidden")
          }, 10000);
        }
      }
    });
  }
}
theme_custom.updateSelectedLooks = (popup) => {
  $('.product-card', popup).each((i, item) => {
    let looks = theme_custom.globalEventData.data.event_looks;
    let name = $(item).attr('data-name');
    let existLook = looks.find((look) => look.name == name);
    if (existLook) {
      let btn = $(item).find('.look-added-into-event, .added-look-into-event');
      btn.addClass('disabled').text('Look Added')
    } else {
      let btn = $(item).find('.look-added-into-event, .added-look-into-event');
      btn.removeClass("disabled").text('Add to Event');
    }
  })
}

// theme_custom.getEventData
theme_custom.getAllEvents = function (modalTarget) {
  data = {
    "eventType": "1",
    "page": "1",
    "host": "0",
    "limit": "100"
  }
  $.ajax({
    url: `${theme_custom.base_url}/api/customer/events`,
    method: "POST",
    data: data,
    dataType: "json",
    async: true,
    headers: {
      // "Authorization": 'Bearer Am3Trk0xm4fR5SXdni5zilc1ffwxFFUWwwwnh2ZQ98wRSL9KDihFoBMnCJ9Dw8Kc8A5zkHnMZBot02nbyybQEtSd3dadnY4RFZZQQ'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      theme_custom.allEvents = result.data.events
    },
    error: function (xhr, status, error) {
    }
  });
}

$(document).on("click",".show_look_list.event_has_look",function(){
  $(this).closest(`.step-content-wrapper`).find(`.event-block-wrap`).hide()
  $(this).closest(`.step-content-wrapper`).find(`.show-look-from-event-wrapper`).show();
})

theme_custom.EventSuitColorWrapper = function(){
  $('.event-step-1 .event-block-wrap .suit-color-wrapper').slick({
    slidesToShow: 7,
    slidesToScroll: 7,
    infinite: false,
    speed: 300,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          adaptiveHeight: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          adaptiveHeight: true
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          adaptiveHeight: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          adaptiveHeight: true
        }
      }
    ]
  });
}