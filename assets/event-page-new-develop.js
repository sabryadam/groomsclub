// event-new-development
theme_custom.base_url = theme_custom.api_base_url;
const APP_Token = 'Bearer ' + localStorage.getItem("customerToken");

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
      console.log("result",result);
      if (result.success) {
          if (result.data.length > 0) {
            var append_fav_html = "";
            $('#choose-form-favorite .product-wrapper').html(append_fav_html);
            var edit_link = '';
            for (var i = 0; i < result.data.length; i++) {                        
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
                <h4 class="product-title">${result.data[i].name}</h4>
                <p class="product-price">Starting at $199.99</p>
                <p class="taxes-text">Price includes suit jacket and pants</p>
                <a class="button button--secondary" tabindex="-1" title="More Details" href="${result.data[i].url}">More Details <i class="fas fa-arrow-right"></i></a>
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
    debugger;
    const step = $(`.step-content-wrapper[data-step-content-wrap="2"]`)
    if(data.data.event_looks && data.data.event_looks.length > 0){
      $('.event-block-wrap',step).hide();
      const looksDiv = $('.event-look-inner-wrapper',step);
      looksDiv.empty();
      for(let i = 0; i<data.data.event_looks.length;i++){
        let item = data.data.event_looks[i];
        theme_custom.createLookHtml(looksDiv, item);
      }
    }else{
      $('.show-look-from-event-wrapper',step).hide();
    }
  });
}

theme_custom.changeStep = (index) =>{
  localStorage.setItem("created-event-step", index);
  $('.step-content-wrapper').removeClass('active');
  $('.step-wrap').removeClass('active');

  $(`.step-wrap[data-step-label-wrap="${index}"]`).addClass('active');
  $(`.step-content-wrapper[data-step-content-wrap="${index}"]`).addClass('active');

    if($(`.step-content-wrapper[data-step-content-wrap="${index}"].create-event-look`).length>0){
      theme_custom.eventLookSlider()
    }
    if($(`.step-content-wrapper[data-step-content-wrap="${index}"].event-guest-look`).length>0){
      theme_custom.guestLooksSlider()
    }
}

theme_custom.eventValidation = function(btn){
  var error_count = 0,
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
    debugger;
    $.ajax({
      url: `${theme_custom.base_url}/api/event/create`,
      method: "POST",
      data: event_data,
      dataType: "json",
      headers: {
        "Authorization": APP_Token
      },
      beforeSend: function () {
        $(this).addClass("disable");
      },
      success: function (result) {
        console.log('create event result',result);
        if (result.success) {
          localStorage.setItem("created-event", JSON.stringify(result));
          theme_custom.checkLooks(result.data.createdEvent);
          theme_custom.changeStep(2);
          btn.removeClass('loading');
        }
      },
      error: function (xhr, status, error) {
        console.log('create event error',error);
        if (xhr.responseJSON.message == 'Token is invalid or expired.') {
          $('.api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
            'text-align': 'center',
            'color': 'red'
          });
          setTimeout(() => {
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
theme_custom.eventPageClickEvent = function(){
  $(document).on("click", ".event-page-new-design-wrapper .create-event-button", function(){
    $(this).addClass('loading')
    theme_custom.eventValidation( $(this));
  });
  
  $(document).on("click", ".event-page-new-design-wrapper .next-button", function(){
    var target = $(this);
    var nextTarget = target.closest(".step-content-wrapper").attr("data-step-content-wrap");
    theme_custom.changeStep(nextTarget);
  });

  $(document).on("click", ".event-page-new-design-wrapper .previous-button", function(){
    var target = $(this);
    var prevTarget = target.closest(".step-content-wrapper").attr("data-step-content-wrap");
    prevTarget = parseInt(prevTarget) - 1;
    theme_custom.changeStep(prevTarget);
    })
  
  $(document).on("click", ".event-type-section-wrap .Squer-radio-button-inner", function () {
    var selectEventType = $(this).find(`[name="event-type"]`).val();
    selectEventType = selectEventType.toLowerCase();
    $(".event-page-new-design-wrapper .role-in-event-wrap .Squer-radio-button-inner").addClass("hidden");
    $(`.event-page-new-design-wrapper .role-in-event-wrap .Squer-radio-button-inner[data-class="${selectEventType}"]`).removeClass("hidden");
  })

  $(document).on("click",".popup-button",function(){
    var targetEl = $(this).attr("data-title");
    $(`.modal-wrapper`).removeClass("active");
    $(`.modal-wrapper[data-target="${targetEl}"]`).addClass("active");
  })

  $(".modal-wrapper .close-icon").click(function(){
    $(this).closest(".modal-wrapper").removeClass("active");
  })

  $(document).on("click",".show-look-from-event-wrapper .add-look-wrapper",function(){
    $(this).closest(".step-content-wrapper.create-event-look").find(".event-block-wrap").hide()
    $(this).closest(".show-look-from-event-wrapper").show();
  })

  $(document).on("click",".add-guest-button", function(){
    $(`.modal-wrapper[data-target="add-guest-popup"]`).addClass("active");
    $(`[name="is_host_paying"]`).prop('checked', false);
    $(`[type="text"],[type="tel"]`).val('');
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
    setTimeout(() => {
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
    }, 200);
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

theme_custom.event_init_page = function(){
  theme_custom.eventPageClickEvent();
  theme_custom.calender();
  theme_custom.favoriteLooks();
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

$(document).ready(function() {
  theme_custom.event_init_page(); 
  let lastStep = localStorage.getItem('created-event-step');
  if(lastStep){
    theme_custom.changeStep(lastStep);

    if(lastStep == '2'){
        let createdEvent = localStorage.getItem('created-event');
        if(createdEvent){
          createdEvent = JSON.parse(createdEvent);
          theme_custom.checkLooks(createdEvent.data.eventId);
        }
    }
  }
})

theme_custom.createLookHtml = (div,item) =>{
  div.append(`<div class="look-card-block">
  <div class="look-title-and-price">
    <div class="look-title">${item.name}</div>
    <div class="look-price-wrap">
      <span class="text-lable">Starting at</span>
      <span class="look-price">$199.99</span>
    </div>
  </div>
  <div class="look-image">
    <img src="${item.look_image}" alt="${item.name}" />
    <button class="button button--secondary customise-look">Customise look</button>
  </div>
</div>`)
}
