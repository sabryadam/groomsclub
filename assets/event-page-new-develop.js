// event-new-development
theme_custom.base_url = theme_custom.api_base_url;
theme_custom.globalEventData = null;
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
      theme_custom.checkLooks(localStorage.getItem("set-event-id"));
      $('[data-target="add-guest-popup"]').removeClass('active');
      $('.member-added-into-event').removeClass('disabled')
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
        parent.find('.api_error').removeClass("hidden").show().html(xhr.responseJSON.message).css("text-align", "center");
        setTimeout(() => {
          parent.find(".api_error").hide();
        }, 3000);
      }
      theme_custom.globalLoaderhide();
    }
  });
}

$(".member-added-into-event").click(function (e) {
  e.preventDefault();
  
  theme_custom.lookVal = $(this).closest(".add-guest-inner-wrapper").find(".look-name").attr("data-look-mapping-id")
  var parent = $(this).closest('.invite-another-member-popup-wrapper');
  var updateGuest = false;
  if($(this).hasClass('update-guest')){
    updateGuest = true
  }
  var error_count = 0,
    eventId = localStorage.getItem("set-event-id"),
    button = $(this);
  error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('.member-first-name'));
  error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('.member-last-name'));
  error_count = error_count + theme_custom.emailValidation(parent.find('.member-email'));
  error_count = error_count + theme_custom.phoneValidation(parent.find('.member-phone'));
  if (error_count == 0) {
    var memberFirstName = $(".member-first-name",parent).val();
    var memberLastName = $(".member-last-name",parent).val();
    var memberEmail = $(".member-email",parent).val();
    var memberPhone = $(".member-phone",parent).val().replace('(','').replace(' ','').replace(')','').replace('-','');
    var hostPayInfo = $(".field.form-wrap.custom-checkobx span.custom_checkbox input[type=radio]:checked",parent).data('val');
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
  if(updateGuest){
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
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        $('.event-step-wrapper').addClass('hidden');
        theme_custom.globalLoaderShow();
        theme_custom.lookAssignToMember(result.data.id,theme_custom.lookVal);
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
          let error  = $('.invite-another-member-popup-wrapper .error-member-added-into-event')
          if(error){
            error.fadeOut()
          }
          $(`.invite-another-member-popup-wrapper .member-added-into-event,[data-target="update-guest-popup"] .member-added-into-event,[data-target="add-guest-popup"] .member-added-into-event`).removeClass('loading')
        }, 5000);
      }
    });
  }
});

theme_custom.user = (user) =>{
  console.log("user",user);
    let {email, first_name, last_name, phone, status, is_host_paying} = user;
    let whoPay = "";
    if(is_host_paying.toLowerCase() == "self"){
      whoPay = "I pay";
    }else{
      whoPay = "They Pay";
    }
    const deleteIcon = `<div class="member-delete-icon" data-member-id="${user.event_member_id}">
      <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/delete.png?v=1678738752" alt="delete icon" />
    </div>`
    return `<div class="user-card-block">
    <div class="action-icon">
      <span class="edit-icon">
        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/pencil.png?v=1678738737" alt="Edit Icon">
      </span>
      ${user.is_host == 0 ? deleteIcon : ''}
    </div>
    <h3 class="user-name">${first_name} ${last_name}</h3>
    <div class="user-email-phone">
      <span class="user-email">${email}</span>
      <span class="user-phone"> | ${phone}</span>
    </div>
    <div class="size-selected-info">
      <div class="size-selected-wrap">
        <span class="size-select-check">status : ${status}</span>
        <span class="reminder-wrap">REMINDER</span>
      </div>
      <spa class="pay-status">${whoPay}</span>
    </div>
    <script type="application/json" class='user-data-script'> ${JSON.stringify(user)} </script>
  </div>`
}
theme_custom.createLookHtml = (index,div,item, eventMembers, event_id) =>{  
  var deleteIconShow = '';
  if(item.assign == true){
    deleteIconShow = 'hidden';
  }
  let users = "";
  if(item.look_id){
    for(let i =0; i<eventMembers.length; i++){
      let user = eventMembers[i];
      if(user.look_id){
        if(parseInt(user.look_id) == item.look_id){
          users = users + theme_custom.user(user);
        }
      }
    }
  }
  let host = eventMembers.find((member) => member.is_host == 1);
  let lookAssignedUser = false;

  if(parseInt(host.look_id) == item.look_id){
    lookAssignedUser = true;
  }
  

  let hostLookHTML = `<div class="pay-info-confirmation-wrap">
    <div class="title">Are you wearing this look?</div>
    <div class="confirm-box-wrap">
      <span class="update-host-look ${lookAssignedUser ? 'active':''}" data-value="yes">Yes</span>
      <span class="update-host-look no ${!lookAssignedUser ? 'active':''}" data-value="no">No</span>
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
      <div class="delete-icon ${deleteIconShow}" data-event-look-id="${item.mapping_id}">
        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/delete.png?v=1678738752" alt="delete icon" />
      </div>
      <img class="look-img" src="${item.look_image}" alt="${item.name}" />
      <button data-href="${item.url}" edit-look-id="${localStorage.getItem("set-event-id")}" look-mapping-id="${item.mapping_id}" edit-look-name="${item.name}" class="button button--primary customise-look customise-look-button">Customise look</button>
    </div>
    ${hostLookHTML}
    <div class="assign-look-user-wrap">${users}</div>
    <div class="text-center">
      <button class="add-guest-button">+ ADD GUEST</button>
    </div>
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
              var suitProduct = ''
              for(var items = 0; items < productArray.length ; items++){
                if(productArray[items].handle.includes('suit')){
                  suitProduct = 'suit-product'
                } else {
                  suitProduct = 'look-products'
                }
                itemData += `<div class="product-data-card ${suitProduct}">
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

theme_custom.checkLooks = (id,nextTarget,trigger=true) =>{
  if(!trigger){
    theme_custom.successCallback(theme_custom.globalEventData,nextTarget)
    return
  }
  
  fetch(`${theme_custom.base_url}/api/event/${id}`,{
    method: "GET",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
  }).then((data)=> data.json())
  .then((data)=>{
    theme_custom.globalEventData = data
    theme_custom.successCallback(data,nextTarget);
  });
}

theme_custom.successCallback = (data,nextTarget) =>{
    data.data.event_looks = data.data.event_looks.reverse();
    let eventMembers = data.data.event_members;
    if(data.data.event_looks && data.data.event_looks.length > 0){
      $(`.modal-wrapper[data-target="remove-data-for-user"]`).removeClass("active");
      const looksDiv = $('.show-look-from-event-wrapper .event-look-inner-wrapper, .guest-top-looks .event-look-inner-wrapper');
      looksDiv.empty();
      if(looksDiv.hasClass("slick-initialized")){
        looksDiv.removeClass("slick-initialized").removeClass("slick-slider");
      }
      $(`.invite-another-member-popup-wrapper .member-added-into-event,[data-target="update-guest-popup"] .member-added-into-event,[data-target="add-guest-popup"] .member-added-into-event`).removeClass('loading');
      for(let i = 0; i<data.data.event_looks.length;i++){
        let item = data.data.event_looks[i];
        let index = i;        
        theme_custom.createLookHtml(index,looksDiv, item, eventMembers, data.data.event_id);
      }
      $(".close-icon").click();
      setTimeout(() => {
        theme_custom.lookItemsData(data);
        if($('.create-event-look .event-look-inner-wrapper .look-card-block, .guest-top-looks .event-look-inner-wrapper .look-card-block').length > 2){
          theme_custom.eventLookSlider();
        }
        $(`[data-target="remove-data-for-user"]`).removeClass("active");
        $(".step-content-wrapper.create-event-look .event-block-wrap").hide();
        $('.show-look-from-event-wrapper,.guest-top-looks').show();
        $(".loader-wrapper").addClass("hidden");
        $(".event-step-wrapper").removeClass("hidden");  
        if(nextTarget){
          theme_custom.changeStep(nextTarget);
          // if($('.event-look-inner-wrapper').find(".look-card-block").length > 2){
          //   $('.event-look-inner-wrapper').slick('refresh');
          // }
        }
        $(".next-button.disabled").removeClass("disabled");
        if($('.event-look-inner-wrapper').find(".look-card-block").length > 2){
          $('.event-look-inner-wrapper').slick('refresh');
        }
        theme_custom.globalLoaderhide();
      }, 2000);
    }else{
      $(`[data-target="remove-data-for-user"]`).removeClass("active");
      $(".step-content-wrapper.create-event-look .event-block-wrap").show();
      $('.show-look-from-event-wrapper,.guest-top-looks').hide();
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapper").removeClass("hidden");  
      if(nextTarget){
        theme_custom.changeStep(nextTarget);
        if($('.event-look-inner-wrapper').find(".look-card-block").length > 2){
          $('.event-look-inner-wrapper').slick('refresh');
        }
      }
      $(".next-button.disabled").removeClass("disabled");
      theme_custom.globalLoaderhide();
    }

}

theme_custom.changeStep = (index) =>{
    $('.event-step-wrapper').removeClass('hidden');
    $(`.step-content-wrapper`).removeClass("acrive");
    $(`.step-content-wrapper[data-step-content-wrap="${index}"]`).addClass("active");
    $(`.step-wrap[data-step-label-wrap="${index}"]`).addClass("active");
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
    setTimeout(() => {
      $('.event-page-new-design-wrapper  .event-type-section-wrap .form-error').removeClass('active');
    }, 500);
    $('html, body').animate({
      scrollTop: $('.event-type-section-wrap').offset().top - 120
    }, 1000);
    return false;
  }
  if ($('.event-page-new-design-wrapper #event_date').val() == '' ) {
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
              if(xhr.responseJSON.data.length > 0){
                for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                  var errorMsg = xhr.responseJSON.data[i];
                  var membererror = '';
                  $.each(errorMsg, function (key, value) {
                    membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                  })
                  event_date_msg += `<div>${membererror}</div>`;
                }
              } else {
                for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                  event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
                }
              }
            }
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.api_error').fadeOut();
            button.removeClass("disable");
          }, 5000);
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
          button.removeClass('loading');
          if(result.message == 'Event updated successfully.'){
            $('.step-content-wrapper.event-step-1 .api_error').show().html(result.message).css({
              "background-color": "#DFF2BF", 
              "color": "#270"
            });
            button.find(".label").text("Event Updated");
            setTimeout(() => {
              localStorage.setItem("set-event-id", result.data.eventId);
              $(".create-event-button").addClass("next-button").removeClass("create-event-button");    
              $("#event-id").val(result.data.eventId);
              $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
              button.find(".label").text("Update Event");
            }, 2500);
          } else {
            $('.step-content-wrapper.event-step-1 .api_error').show().html(result.message).css({
              "background-color": "#DFF2BF", 
              "color": "#270"
            });
            localStorage.setItem("set-event-id", result.data.eventId);
            $("#event-id").val(result.data.eventId);
            setTimeout(() => {    
              $(".create-event-button").addClass("next-button").removeClass("create-event-button");
              $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
            },2500);
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
              if(xhr.responseJSON.data.length > 0){
                for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                  var errorMsg = xhr.responseJSON.data[i];
                  var membererror = '';
                  $.each(errorMsg, function (key, value) {
                    membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                  })
                  event_date_msg += `<div>${membererror}</div>`;
                }
              } else {
                for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                  event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
                }
              }
            }
          } else {
            event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
          }
          $('.step-content-wrapper.event-step-1 .api_error').show().html(event_date_msg);
          setTimeout(function () {
            $('.step-content-wrapper.event-step-1 .api_error').fadeOut();
            $(".step-content-wrapper.event-step-1 .button-wrapper").find("button").removeClass("loading");
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
      headers: {
          // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {

      },
      success: function (result) {
        button.removeClass("disabled").text("Look Added");
        $('.event-step-wrapper').addClass('hidden');
        theme_custom.globalLoaderShow();
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
    $(this).closest(".product-card").find(`.item-data-wrapper .product-data-card.look-products`).each(function(){
      var productHandle = $(this).find(".looks-product-handle").val();
      var productVarId = $(this).find(".looks-product-var-id").val();
      if($(this).closest(".product-card").find(`.item-data-wrapper .product-data-card.look-products`).length > 1) {
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
    var productDataCardArr = $(this).closest(".product-card").find(`.item-data-wrapper .product-data-card.look-products`),
        dataObj = {};
    theme_custom.newArray = [],
    productDataCardArr.each(function(){
      if($(this).closest(".product-card").find(`.item-data-wrapper .product-data-card.look-products .looks-product-var-id`).val() != ''){
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
theme_custom.globalLoaderShow = () =>{
  // $('.site-global-loader').removeClass('hidden'); 
  $('.loader-wrapper').removeClass('hidden')

}
theme_custom.globalLoaderhide = () =>{
  // $('.site-global-loader').addClass('hidden'); 
  $('.loader-wrapper').addClass('hidden')
}
theme_custom.removeUserFromLook = (eventId,memberId) =>{
  //  confirms = confirm("Are you sure you want to remove this?");
    if (eventId) {
      theme_custom.globalLoaderShow();
      if (eventId) {
        $.ajax({
          url: `${theme_custom.base_url}/api/event/removeMember/${eventId}/${memberId}`,
          method: "DELETE",
          data: '',
          dataType: "json",
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
            }
            // theme_custom.globalLoaderhide();
          }
        });
      }
    }
}

theme_custom.ProductData = function(productItemsArr, lookName, lookId, memberId){
  var productSubTotalPrice = "",
      subTotal = 0;
  $.map(productItemsArr, function(productItems,index) {
    jQuery.ajax({
      type: 'GET',
      url: `/products/${productItems.product_handle}.json`,
      success: function(response) {
        for(i=0; i<response.product.variants.length;i++){
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
            var subtotalVarPrice = (variantSelected.price)*100;
            if(value.id == productItems.variant_id){
              subTotal = subTotal + parseInt(subtotalVarPrice)*100;
            }
          });
        }
        var productTitle = response.product.title;
        theme_custom.productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal)/100, theme_custom.money_format);
      },
      error: function(xhr, status, error) {
        alert(xhr.responseJSON.message); 
      }
    });
  });
}

// theme_custom.productBlockDataWrap
theme_custom.productBlockDataWrap = function (orderItemsObj, orderItems, index, lookDetails) {
  var subTotal = 0, productSubTotalPrice, productItemHTML = '';
  var orderImg = '';
  var orderItemsData = ''
  $.map(orderItemsObj, function (productItems) {
    jQuery.ajax({
      type: 'GET',
      url: `/products/${productItems.product_handle}.json`,
      success: function (response) {
        $.each(response.product.variants, function (key, value) {
          if (value.id == productItems.variant_id) {
            variantSelected = value;
            var variantSelectedPrice = variantSelected.price;
            subTotal = subTotal + parseInt(variantSelectedPrice*100);
            productItemHTML += `<div class="product-card-data" data-product-type="${response.product.product_type}">
                                  <input type="hidden" class="product_handle" value="${response.product.handle}" /> 
                                  <input type="hidden" class="product_var_id" value="${variantSelected.id}" />
                                  <input type="hidden" class="product_id" value="${response.product.id}" />
                                  <input type="hidden" class="product_variant_title" value="${variantSelected.title}" />
                                </div>`;
          }
        })
        productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal * 100) / 100, theme_custom.money_format);
        $(`.look-card-block[data-look-id="${orderItems.look_id}"] .look-price`).text(productSubTotalPrice);

        $(`.order-wrap-${index} .look-price`).text(productSubTotalPrice);
        $(`.order-wrap-${index} .look-price`).attr("data-price", subTotal/100);
        $(`.order-wrap-${index} .button`).attr("data-look-price", subTotal/100);
        $(`.order-wrap-${index} .product-card-wrap`).html(productItemHTML);
      }
    });
  })
}

theme_custom.lookItemsData = function(result){
  var lookItemsData = result.data.event_looks;
  $.map(lookItemsData, function (orderItems, index) {
    var orderItemsObj = orderItems.items;
    theme_custom.productBlockDataWrap(orderItemsObj, orderItems, index);    
  })
}

theme_custom.lookInfoData = function(result){
  var paymentInfo = result.data.payment_info; 
  var lookDetails = result.data.event_looks;
  var paymentInfoHTMLtarget = $(".summary-table-wrapper tbody");
  if (result.data.payment_info == '') {
    $(".summary-table-wrapper").addClass("hidden");
  } else {
    $(".summary-table-wrapper").removeClass("hidden");
  }
  $.map(paymentInfo, function (orderItems, index) {
    var productHTML = item_data = product_data_for_host = '' ;
    var orderItemsObj = orderItems.items;
    if (orderItems.payment_status != "Complete") {
      var actionButton = payInfo = "";
      if (orderItems.is_host == 1) {
        payInfo = 'I pay';
        product_data_for_host = ''
        actionButton = `<button class="button btn-wrap button--secondary add-to-cart" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}"  data-look-price="215.90">
                          Proceed to Cart
                        </buttom>`;
      } else {
        payInfo = 'I Pay';
        product_data_for_host = 'hidden';
        actionButton = `<button class="button btn-wrap button--secondary event-payment-for-guest" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}"  data-look-price="215.90">
                          Pay for Guest
                        </buttom>`
      }
    } else {
      var actionButton = payInfo = "";
      if (orderItems.is_host == 1) {
        payInfo = 'I pay';
        actionButton = `<button class="disabled button btn-wrap button--primary add-to-cart" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}"  data-look-price="215.90">
                          Payment Completed
                        </buttom>`;
      } else {
        payInfo = 'I pay';
        actionButton = `<button class="disabled button btn-wrap button--primary event-payment-for-guest" type="button" data-event-id="${localStorage.getItem('set-event-id')}" data-look-id="${orderItems.look_id}" data-member-id="${orderItems.member_id}" data-look-name="${orderItems.look_name}"  data-look-price="215.90">
                          Payment Completed
                        </buttom>`
      }
    }
    for (let i = 0; i < lookDetails.length; i++) {
      const element = lookDetails[i];
      if (element.look_id == orderItems.look_id) {
        orderImg = element.look_image;
      }
    }
    productHTML += `<tr class="order-wrap-block order-wrap-${index}">
                      <td>
                        <span class="look_name">${orderItems.look_name}</span>
                      </td>
                      <td>
                        <span class="member-number">
                          For ${orderItems.member_name}
                        </span>
                      </td>
                      <td>
                        <span class="pay-info" >${payInfo}</span>
                        <span class="look-price" data-price="219.90"></span>  
                      </td>
                      <td>
                        <div class="product-data ${product_data_for_host}">
                          <div class="product-card-wrap">
                            <input type="hidden" class="product_id" data-product-id="" data-product-price="" data-product-var-id="" />
                          </div>
                        </div>
                        ${actionButton}
                      </td>
                    </tr>`;
    theme_custom.productBlockDataWrap(orderItemsObj, orderItems, index, lookDetails);
    paymentInfoHTMLtarget.append(productHTML);
    $('.event-step-wrapper').removeClass('hidden');
    theme_custom.globalLoaderhide();
    theme_custom.changeStep(4);
    setTimeout(() => {
      var totalPrice = 0;
      $(".order-wrap-block").each(function(){
        totalPrice = totalPrice + ($(this).find("button").attr("data-look-price") * 1);
      })
      $(`.summary-table-wrapper tfoot`).find('.total-price').text('$'+totalPrice);
    }, 3000);
  })
}

theme_custom.eventMemberData = function(){
  var summaryTableWrapper = $(".summary-table-wrapper");
  summaryTableWrapper.find('tbody').empty();
  const eventId = localStorage.getItem("set-event-id");  
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
            if(xhr.responseJSON.data.length > 0){
              for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                var errorMsg = xhr.responseJSON.data[i];
                var membererror = '';
                $.each(errorMsg, function (key, value) {
                  membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                })
                event_date_msg += `<div>${membererror}</div>`;
              }
            } else {
              for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
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

theme_custom.setFitFinder = function(){
  if(getCookie("fit-finder-data") != ""){
    var getFitFinderData = JSON.parse(getCookie("fit-finder-data"));
    if(getFitFinderData.jacketSize != ''){
      var jacketSize = getFitFinderData.jacketSize.split(":")[0];
      var jacketType = getFitFinderData.jacketSize.split(":")[1], jacketTypeVal = '';
      if (jacketType == "S") {
        jacketTypeVal = 'Short'
      } else if (jacketType == "R") {
        jacketTypeVal = 'Regular'
      } else if (jacketType == "L") {
        jacketTypeVal = 'Long'
      }
      $("#jacket-size").attr('data-val',jacketSize);
      $("#jacket-size").val(jacketSize);
      $("#jacket-type").attr('data-val',jacketTypeVal);
      $("#jacket-type").val(jacketTypeVal);
    }
    if(getFitFinderData.pants_hight != ''){
      $("#pants-length").val(getFitFinderData.pants_hight);
      $("#pants-length").attr('data-val',getFitFinderData.pants_hight);
    }
    if(getFitFinderData.pants_waist != ''){
      $("#pants-waist").val(getFitFinderData.pants_waist);
      $("#pants-waist").attr('data-val',getFitFinderData.pants_waist);
    }
    if(getFitFinderData.shirt_sleeve != ''){
      $("#shirt-sleeve").val(getFitFinderData.shirt_sleeve);
      $("#shirt-sleeve").attr('data-val',getFitFinderData.shirt_sleeve);
    }
    if(getFitFinderData.shirt_neck != ''){
      $("#shirt-neck").val(getFitFinderData.shirt_neck);
      $("#shirt-neck").attr('data-val',getFitFinderData.shirt_neck);
    }
    if(getFitFinderData.shoe_size != ''){
      $("#shoes-size").val(getFitFinderData.shoe_size);
      $("#shoes-size").attr('data-val',getFitFinderData.shoe_size);
    }
  }
}

theme_custom.customizeLookProductAjax = function (button, parent) {
  var button = button;
  var getProduct = parent.find(".product-card-wrap .product-card-data");
  var items = [];
  button.text("Adding...");
  getProduct.each(function () {
    var productType = $(this).attr("data-product-type");
    var varId = $(this).find(".product_var_id").val(),
      item = {};
    if (productType == 'Jacket') {
      var pantsSelectedVariant = $(this).closest(`.product-card-wrap`).find(`.product-card-data[data-product-type="Pants"]`).find(".product_var_id").val(),
          pantsVarTitle = $(this).closest(`.product-card-wrap`).find(`.product-card-data[data-product-type="Pants"]`).find(".product_variant_title").val();
      item = {
        "id": varId,
        "quantity": 1,
        "properties": {
          "variant-title": pantsVarTitle,
          "variant-id": pantsSelectedVariant
        }
      }
    } else if (productType == 'Pants') {
      var jacketSelectedVariant = $(this).closest(`.product-card-wrap`).find(`.product-card-data[data-product-type="Jacket"]`).find(".product_var_id").val(),
          jacketVarTitle = $(this).closest(`.product-card-wrap`).find(`.product-card-data[data-product-type="Jacket"]`).find(".product_variant_title").val();
      item = {
        "id": varId,
        "quantity": 1,
        "properties": {
          "variant-title": jacketVarTitle,
          "variant-id": jacketSelectedVariant
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
        button.removeClass("disabled");
        window.location.href = "/cart";
      }, 2500);
    },
    error: function (xhr, status, error) {
      alert(xhr.responseJSON.description);
      button.text("proceed To Cart");
      button.removeClass("disabled");
    }
  });
}

theme_custom.eventPageClickEvent = function(){

  // theme_custom.customizeLookProductAjax
  $(document).on("click",".add-to-cart",function(e){
    var parent = $(this).closest(".order-wrap-block"),
        button = $(this);
    theme_custom.customizeLookProductAjax(button,parent);
  });

  $(document).on("click",".event-payment-for-guest",function(e){
    e.preventDefault();
    var button = $(this);
    button.text('Paying.....');
    var data = {
      'event_id' : $(this).attr("data-event-id"),
      'member_id'  : $(this).attr("data-member-id"),
      'look_id' : $(this).attr("data-look-id"),
      'look_title'  : $(this).attr("data-look-name"),
      'look_image' : 'https://app.groomsclub.com/storage/looks/iuuo18sY2IfpuHj73gAWpcTSNu8oxFfIav0Pkcxx.jpg',
      'order_amount' : $(this).attr("data-look-price")
    };
    $.ajax({
      url: `${theme_custom.base_url}/api/event/addeventdata`,
      method: "POST",
      data: data,
      dataType: "json",
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        var paymentURL = `${theme_custom.base_url}/payment/${result.data.event_id}/${result.data.member_id}/${result.data.look_id}`;
        button.text('Paying.....');
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
  
  $(document).on('click', '.user-card-block .action-icon .edit-icon', function(event) {
    let parent = $(this).closest('.look-card-block');
    let mainParent = $(this).closest('.user-card-block');
    let data =$('.user-data-script',mainParent).html();
    if(data){
      data = JSON.parse(data);
      let popup = $('[data-target="update-guest-popup"]');
      let firstName = $('[name="first_name"]',popup);
      let lastName = $('[name="last_name"]',popup);
      let lookName = $('.look-name',popup);
      let email = $('.member-email',popup);
      let phone = $('.member-phone',popup);
      let memberId = data.event_member_id;
      let payHost = $('[name="is_host_paying_update"][data-val="1"]',popup);
      let payOther = $('[name="is_host_paying_update"][data-val="0"]',popup);

      firstName.val(data.first_name).trigger('change');
      lastName.val(data.last_name).trigger('change');
      email.val(data.email).trigger('change');
      phone.val(data.phone.slice(2)).trigger('change');
      lookName.text(data.look_name);
      if(data.is_host_paying.toLowerCase()=='self'){
        $(payHost).prop('checked',true);
      }else{
        $(payOther).prop('checked',true);
      }  
      $(payHost).attr('id',`yes-${memberId}`);
      $(payOther).attr('id',`no-${memberId}`);
      $(payHost).closest('.custom_checkbox').find('label').attr('for',`yes-${memberId}`);
      $(payOther).closest('.custom_checkbox').find('label').attr('for',`no-${memberId}`);
      $('.update-guest',popup).attr('data-member-id',memberId)
      popup.addClass('active');    
    }
    // let member_id = $(this).attr('data-member-id');
    // let event_id = parent.attr('data-event-id');
    // theme_custom.removeUserFromLook(event_id,member_id);
  });

  $(document).on('click', '.user-card-block .action-icon .member-delete-icon', function(event) {
    event.preventDefault();
    let parent = $(this).closest('.look-card-block');
    let member_id = $(this).attr('data-member-id');
    let event_id = parent.attr('data-event-id');
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".member_id").val(member_id);
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".member_id").attr("data-type","member-block");
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".event_id").val(event_id);
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).addClass("active");
    // theme_custom.removeUserFromLook(event_id,member_id);
  });

  $(document).on('click', '.look-card-block .delete-icon', function(event) {
    event.preventDefault();
    var eventLookId = $(this).data('event-look-id');
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".look_id").val(eventLookId);
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).find(".member_id").attr("data-type","delete-look-block");
    $(`.modal-wrapper[data-target="remove-data-for-user"]`).addClass("active");
  });

  $(document).on("click",`[data-target="remove-data-for-user"] button`,function(){
    
    var target = $(this).attr('data-value');
    var checkData = $(this).closest(".modal-wrapper-inner-wrapper").find(".member_id").attr("data-type");
    if(target == 'yes'){ 
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
      if(checkData == 'member-block') {
        var event_id = $(this).closest(".modal-wrapper-inner-wrapper").find(".event_id").val();
        var member_id = $(this).closest(".modal-wrapper-inner-wrapper").find(".member_id").val();
        theme_custom.removeUserFromLook(event_id,member_id);
      } 
      if(checkData == 'delete-look-block') {
        var eventLookId = $(this).closest(".modal-wrapper-inner-wrapper").find(".look_id").val();
        theme_custom.deleteTheLooksItem(eventLookId);
      }
    } else {
      $('.close-icon').click();
    }
  })

  $(document).on('click', '.pay-info-confirmation-wrap .confirm-box-wrap .update-host-look', function(event) {
    let value = $(this).attr('data-value');
    let parent = $(this).closest('.look-card-block');
    let look_id = parent.attr('data-look-id');
    let member_id = parent.attr('data-host-id');
    if(value == 'yes'){
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.globalLoaderShow();
      theme_custom.lookAssignToMember(member_id,look_id)
    }else{
      // theme_custom.removeUserFromLook(eventId,member_id);
    }
  })
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

  // customise-look-button-for-add-look-into-event
  $(document).on("click", ".customise-look-button-for-add-look-into-event", function(){
    localStorage.setItem("customizerlookUrl",$(this).attr("data-href").split('?')[1]);
    localStorage.setItem("customise-look-button-for-add-look-into-event","true");
    window.location.href = $(this).attr("data-href");
  })
  
  // Create Event API Functionality
  $(document).on("click", ".event-page-new-design-wrapper .create-event-button", function(){
    theme_custom.createEventAPI($(this));
  });

  // update Event API Functionality
  $(document).on("click",".event-page-new-design-wrapper .event-update-button",function(){
    theme_custom.updateEventAPI($(this));
  })
  
  // Next button 
  $(document).on("click", ".event-page-new-design-wrapper .next-button", function(){
    $(".event-step-wrapper").addClass("hidden");
    $(".loader-wrapper").removeClass("hidden");
    $(".step-content-wrapper").removeClass("active");
    var target = $(this);
    let goNext = true;
    var nextTarget = target.closest(".step-content-wrapper").next(".step-content-wrapper").attr("data-step-content-wrap");
    if($(this).closest(`.step-content-wrapper[data-step-content-wrap="1"]`).length > 0){
      $(`.step-content-wrapper[data-step-content-wrap="2"]`).find(".event-block-wrap").hide();
      theme_custom.checkLooks(localStorage.getItem("set-event-id"),nextTarget);
      goNext = false;
    }
    if($(this).closest(`.step-content-wrapper[data-step-content-wrap="2"]`).length > 0){
      theme_custom.checkLooks(localStorage.getItem("set-event-id"),nextTarget,false);
      goNext = false;
    }
    if($(this).closest(`.step-content-wrapper[data-step-content-wrap="3"]`).length > 0){
      goNext = false;
      $('.event-step-wrapper').addClass('hidden');
      theme_custom.setFitFinder();
      theme_custom.eventMemberData();
    }
    if(goNext){
      theme_custom.changeStep(nextTarget);
    }
  });

  // Previous Button
  $(document).on("click", ".event-page-new-design-wrapper .previous-button", function(){
    $(".event-step-wrapper").addClass("hidden");
    $(".loader-wrapper").removeClass("hidden");
    $(".step-content-wrapper").removeClass("active");
    let goNext = true;
    var target = $(this);
    var currentTabHead = target.closest(".step-content-wrapper").attr("data-step-content-wrap");
    var prevTarget = target.closest(".step-content-wrapper").prev(".step-content-wrapper").attr("data-step-content-wrap");
    prevTarget = parseInt(prevTarget);
    if($(this).closest(`.step-content-wrapper[data-step-content-wrap="3"]`).length > 0){
      theme_custom.checkLooks(localStorage.getItem("set-event-id"),prevTarget,false);
      goNext = false;
    }
    if($(this).closest(`.step-content-wrapper[data-step-content-wrap="4"]`).length > 0){
      theme_custom.checkLooks(localStorage.getItem("set-event-id"),prevTarget,false);
      goNext = false;
    }
    if(goNext){
      theme_custom.changeStep(prevTarget);
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
    if($(".show-look-from-event-wrapper .event-look-inner-wrapper").find(".look-card-block").length > 0){
      $(".show-look-from-event-wrapper").show();
      $(".create-event-look .event-block-wrap").hide();
    } else {
      $(".show-look-from-event-wrapper").hide();
      $(".create-event-look .event-block-wrap").show();
    }
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
        }
      }
    ]
  });
}
theme_custom.changeFilled = function() {
  $(document).on(`change`, `#EventForm-EventName, [name="event-type"], #event_date, [name="event-role"], .phone-number`, function() {
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
      eventDataObj.eventName = result.data.event_name;
      eventDataObj.eventType = result.data.event_type;
      eventDataObj.eventDate = result.data.event_date;
      eventDataObj.eventRole = result.data.event_role;

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
      $('.event-data-first-step').datepicker('setDate', new Date(result.data.event_date));

      $.each(result.data.event_members,function(index,value){
        if(value.is_host == "1"){
          eventDataObj.eventPhone = value.phone.replace("+1","");
          $("#event-phone-number").val(value.phone.replace("+1",""));
          $('#EventForm-EventOwnerContactNumber').val(value.phone.replace("+1","")).trigger("keyup");
        }
      });  
      $(".create-event-button").addClass("next-button").removeClass("create-event-button");    
      $(`.step-content-wrapper[data-step-content-wrap="1"]`).addClass("active");
      $(`.step-content-wrapper[data-step-content-wrap="1"]`).find(".event-update-button").removeClass("disabled").removeClass("hidden")
      if(location.href.includes('?step')){
        $(".step-wrap").addClass("active");
        $(`.step-content-wrapper[data-step-content-wrap="3"]`).find(".next-button").click();
        $(".loader-wrapper").addClass("hidden");
        $(".event-step-wrapper, .step-header-wrap, .step-content-wrapper").removeClass("hidden");
        // setTimeout(() => {
        //   var currentLocation = window.location.href.split('?')[0];
        //   history.pushState({}, null, `${currentLocation}`);
        // }, 3000);
      }
      if(localStorage.getItem("back-to-event-page") != null || localStorage.getItem("showEventStepSecond") != null || localStorage.getItem("go-to-event-page") != null){
        $(".event-page-new-design-wrapper .loader-wrapper").removeClass("hidden");
        $(".event-page-new-design-wrapper .event-step-wrapper").addClass("hidden");
        setTimeout(() => {
          $('.step-content-wrapper[data-step-content-wrap="1"]').find(".next-button").click();
          if(localStorage.getItem("back-to-event-page") != null) {
            localStorage.removeItem("back-to-event-page");
          }
          if(localStorage.getItem("showEventStepSecond") != null){
            localStorage.removeItem("showEventStepSecond")
          }
          if(localStorage.getItem("go-to-event-page") != null){
            localStorage.removeItem("go-to-event-page");
          }
        }, 1000);
      } else {
        $(".loader-wrapper").addClass("hidden");
        $(".event-step-wrapper").removeClass("hidden");
      }
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
          $(".event-page-new-design-wrapper").find(".event-step-wrapper").removeClass("hidden");
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
theme_custom.checkUpdateEvent = function(checkEventData,value,selector){
  if((selector == 'event-name' && (checkEventData == "event_name" && eventDataObj.eventName != value)) || (selector == 'event-date' && (checkEventData == "event_name" && eventDataObj.eventDate != value)) || (selector == 'event-type' && (checkEventData == "event_name" && eventDataObj.eventType != value)) || (selector == 'event-phone' && (checkEventData == "event_name" && eventDataObj.eventPhone != value)) || (selector == 'event-role' && (checkEventData == "event_name" && eventDataObj.eventRole != value))){
    $(".event-update-button").removeClass("disabled");
  } else {
    $(".event-update-button").addClass("disabled");
  }
}
$(document).ready(function() {
  // theme_custom.updateEvent();
  $( "#event_date" ).datepicker({ 
    dateFormat: 'yy-mm-dd',
    minDate : 0
  });
  // window.eventDate = $( ".event-data-first-step" ).datepicker({
  //   format: 'yyyy-mm-dd'
  // });
  window.eventDataObj = {};
  theme_custom.deleteTheLooksItem();
  theme_custom.event_init_page();
  theme_custom.eventChangeEvent();
  if(localStorage.getItem("set-event-id") != null) {
    theme_custom.getEventDetails();
  } else {
    setTimeout(() => {
      $(".loader-wrapper").addClass("hidden");
      $(".event-step-wrapper").removeClass("hidden");
    }, 500);
  }
  if(location.href.includes('?step')){
    $(".loader-wrapper").removeClass("hidden");
    $(".event-step-wrapper, .step-header-wrap, .step-content-wrapper").addClass("hidden");
  }
})

theme_custom.eventChangeEvent = () =>{
  $(document).on('click','.final-summary-for-event-page-main-wrapper .update-event-fit-finder',function(){
    let parent = $(this).closest('.product-card');
    $(this).text('Updating...');
    $('select',parent).each((i,item)=>{
      $(item).attr('data-val',$(item).val());
    })
    theme_custom.eventPageeditMySize($(this));
  });
  $(document).on('change','.final-summary-for-event-page-main-wrapper select',function(){
    let parent = $(this).closest('.product-card');
    let value = $(this).val();
    let oldVal = $(this).attr('data-val');
    if(value == oldVal){
      $('.button-wrap',parent).addClass('hidden');
    }else{
      $('.button-wrap',parent).removeClass('hidden');
    }

    // if($(this).attr('name') == 'jacket-size'){
    //   let value = $(this).val();
    //   let oldVal = $(this).attr('data-val');
    //   if(value == oldVal){
    //     $('.button-wrap',parent).addClass('hidden');
    //   }else{
    //     $('.button-wrap',parent).removeClass('hidden');
    //   }
    // }else if($(this).attr('name') == 'jacket-type'){
      
    // }else if($(this).attr('name') == 'pants-waist'){
      
    // }else if($(this).attr('name') == 'pants-length'){
      
    // }else if($(this).attr('name') == 'shirt-neck'){
      
    // }else if($(this).attr('name') == 'shirt-sleeve'){
      
    // }else if($(this).attr('name') == 'shoes-size'){
      
    // }
  })
}



theme_custom.eventPageeditMySize= function(btn){
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
    fitFinder = {
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