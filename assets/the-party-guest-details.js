// theme_custom.reminder
theme_custom.reminder = function (sendReminderDataObj, button, targetEvemtId, targetmemberId) {
  $.ajax({
    url: `${theme_custom.base_url}/api/reminder/create`,
    method: "POST",
    data: sendReminderDataObj,
    dataType: "json",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      button.addClass("disabled");
    },
    success: function (result) {
      button.addClass("disabled");
      $('.api_error').addClass("success-event").show().html(result.message).css("margin", "15px 0");
      setTimeout(() => {
        $('.api_error').removeClass("success-event").html('').hide().css("margin", "0");
        button.removeClass("disabled");
        $(`.guest-details-outer-wrapper[data-event-id="${targetEvemtId}"][data-member-id="${targetmemberId}"]`).find(".send-reminder").addClass("disabled");
        $(`.guest-details-outer-wrapper[data-event-id="${targetEvemtId}"][data-member-id="${targetmemberId}"]`).find(".send-reminder .button-title").text("Send");
        $(".fancybox-button").click();
      }, 3000);
    },
    error: function (xhr, status, error) {
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red',
          'margin': '15px 0'
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
        $('.api_error').show().html(event_date_msg).css({
          'margin': '15px 0'
        });
        setTimeout(() => {
          button.removeClass("disabled");
          $(".api_error").html('').hide().css({
            'margin': '0'
          });
        }, 10000);
      }
    }
  });
};
// theme_custom.removeUserFromLook
theme_custom.removeUserFromLook = function (eventId, memberId) {
  var eventId = eventId,
    memberId = memberId;
  confirms = confirm("Are you sure you want to remove this?");
  if (eventId && confirms) {
    if (eventId) {
      $.ajax({
        url: `${theme_custom.base_url}/api/event/removeMember/${eventId}/${memberId}`,
        method: "DELETE",
        data: '',
        dataType: "json",
        headers: {
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        beforeSend: function () {
        },
        success: function (result) {
          window.location.href = $(".page-back-link .link").attr("href");
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
}

// theme_custom.thePartyGuestDetails
theme_custom.thePartyGuestDetails = function () {
  var searchParams = new URLSearchParams(window.location.search)
  if (searchParams.has('event_id')) {
    var event_id = searchParams.get('event_id');
    $("#eventId").val(event_id);
    if (event_id) {
      $.ajax({
        url: `${theme_custom.base_url}/api/event/${event_id}`,
        method: "GET",
        data: '',
        dataType: "json",
        headers: {
          // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        beforeSend: function () {
          $(".page-loader").addClass("hidden");
        },
        success: function (result) {
          var eventName = result.data.event_name;
          $("#weddingeventname").text(eventName);
          $('#weddingevent_id').val(result.data.event_id);
          $(".user-email-value").text($("#customer_email").val());
          $(".page-back-link").find(".link").attr('href', '/pages/my-event?event_id=' + event_id);
          if(getCookie("fit-finder-data") != ''){
            $(".account-event-step[data-event-step='sized'], .account-event-step[data-event-step='verified-fit']").addClass("active");
          }else{
            $(".account-event-step[data-event-step='verified-fit']").hide();
            $(".account-event-step[data-event-step='sized']").removeClass("active");
          }
          var lookArray = result.data.event_looks,
            memberDataArr = result.data.event_members,
            guestDetailsArr = [];
          for (var i = 0; i < memberDataArr.length; i++) {
            var payInfo = ''
            if (memberDataArr[i].is_host_paying == 'Self') {
              payInfo = `<span>I pay</span>`
            } else {
              payInfo = `<span>They pay</span>`
            }
            var guestDetailsWrapper = `<div class="guest-details-outer-wrapper hidden" data-event-id="${memberDataArr[i].event_id}" data-member-id="${memberDataArr[i].event_member_id}" data-phone-number ="${memberDataArr[i].phone}">
                                        <div class="guest-look-image-wrapper">
                                          <div class="image">
                                            <img class="look-img" src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/product-img-3.png?v=1634963523" alt="Look image" />
                                          </div>
                                          <h3 class="look-name">${memberDataArr[i].look_name}</h3>
                                        </div>
                                        <div class="guest-details-info-wrapper">
                                          <div class="guest-details-wrapper">
                                            <h2 class="border-heading title">Guest Details</h2>
                                            <div class="guest-details">
                                              <div class="text-wrapper event-name-wrap">
                                                <h4 class="title">Name : </h4>
                                                <p class="value">${memberDataArr[i].first_name} ${memberDataArr[i].last_name}</p>
                                              </div>
                                              <div class="text-wrapper email-address-wrap">
                                                <h4 class="title">Email Address : </h4>
                                                <p class="value">${memberDataArr[i].email}</p>
                                              </div>
                                              <div class="text-wrapper assigne-look-wrap">
                                                <h4 class="title">Assign Look : </h4>
                                                <p class="value">${memberDataArr[i].look_name}</p>
                                              </div>
                                              <div class="text-wrapper payment-wrap">
                                                <h4 class="title">Payment : </h4>
                                                <p class="value">${payInfo}</p>
                                              </div>
                                              <div class="text-wrapper status-wrap">
                                                <h4 class="title">Status : </h4>
                                                <div class="value">
                                                  <div class="payment_status">${memberDataArr[i].status}</div>
                                                </div>
                                              </div>
                                            </div>
                                            <div class="button-wrapper">
                                              <button type="button" class="send-reminder button button--secondary">
                                                <span class="button-icon">
                                                  <?xml version="1.0" encoding="UTF-8"?><svg enable-background="new 0 0 56 65" version="1.1" viewBox="0 0 56 65" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><style type="text/css">.schedule-icon{fill:#1075BC;}</style><path class="schedule-icon" d="m50 14v45h-44v-45h44m0.6-6h-44.7c-3.3 0-5.9 2.6-5.9 5.9v45.7c0 3 2.4 5.4 5.4 5.4h45.2c3 0 5.4-2.4 5.4-5.4v-46.2c0-3-2.4-5.4-5.4-5.4z"/><rect class="schedule-icon" x="12" width="7" height="11"/><rect class="schedule-icon" x="36" width="7" height="11"/><rect class="schedule-icon" x="5" y="13" width="46" height="6"/><circle class="schedule-icon" cx="27.5" cy="48.5" r="4.5"/><polygon class="schedule-icon" points="23 26.6 32 26.6 30 39.9 25 40"/></svg>
                                                </span>
                                                <span class="button-title">Send Reminder</span>
                                              </button>
                                              <button type="button" class="button remove-reminder link" data-text="Removing...">
                                                <span class="button-title">Remove Guest</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>`;
            $(".guest-details-main-outer-wrapper .loader-icon").addClass('hidden');
            guestDetailsArr.push(guestDetailsWrapper);

          };
          $(".guest-details-main-outer-wrapper").append(guestDetailsArr);
          var showGuestDetails = window.location.href.split('?')[1],
            getEventId = showGuestDetails.split('&')[0].replace('event_id=', ''),
            getMemberId = showGuestDetails.split('&')[1].replace('member_id=', '');
          $(`.guest-details-outer-wrapper[data-event-id="${getEventId}"][data-member-id="${getMemberId}"]`).removeClass("hidden");
          var getMemberEmail = $(`.guest-details-outer-wrapper[data-event-id="${getEventId}"][data-member-id="${getMemberId}"]`).find(".email-address-wrap .value").text(),
            getMemberPayment = $(`.guest-details-outer-wrapper[data-event-id="${getEventId}"][data-member-id="${getMemberId}"]`).find(".payment-wrap .value").text();
          $(".user-email-value").text(getMemberEmail);
          $(".who-payment").text(getMemberPayment);

          // fit finder size is empty then remove active class for partiucular member code start
          var eventmemberIDarr = result.data.event_members;
          for (var i = 0; i < eventmemberIDarr.length; i++) {     
            if(eventmemberIDarr[i].event_member_id == getMemberId){
              if(eventmemberIDarr[i].sized == false){
                $(".account-event-step[data-event-step='sized']").removeClass("active");
              }else{
                $(".account-event-step[data-event-step='sized']").addClass("active");
              }
            }            
          }
          // fit finder size is empty then remove active class for partiucular member code end

          // guest Details - info

          // the party member Data section
          var weddingeventarray = result.data.event_members,
            eventNewArray = [],
            editEventData = '';
          for (var i = 0; i < weddingeventarray.length; i++) {
            editEventData = '';
            editEventData = '<div class="single-member-detail-part" data-event-id="' + weddingeventarray[i].event_id + '" data-member-id="' + weddingeventarray[i].event_member_id + '">';
            editEventData += '<div class="normal-open background-part">';
            editEventData += '<h4 class="member-name"><span class="evntfirst_name"> ' + weddingeventarray[i].first_name + '</span> <span class="evntlast_name"> ' + weddingeventarray[i].last_name + '</span></h4>';
            editEventData += '<h5 class="secound-title">' + weddingeventarray[i].look_name + '</h5>';
            editEventData += '<p class="order-status" style="margin-top:15px"> Status : <b style="color:#1075bc">' + weddingeventarray[i].status + '</b></p>';
            editEventData += '</div></div>';
            eventNewArray.push(editEventData);
          }
          $(".party-invite-member-part").append(eventNewArray);
          $('.mywedding_api_call_loading').addClass('hidden');
          $('.mywedding_section_wrap').removeClass('hidden');
        },
        error: function (xhr, status, error) {
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
            $('.template-page-the-party-guest-details .loading-overlay').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
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
            // erroData += '<p>' + xhr.responseJSON.data.event_id + '</p>';
            $('.template-page-the-party-guest-details').html(erroData);
          }
        }
      });
    } else {
      alert('we are not able to find event');
    }
  }
}

// theme_custom.getEventMemberList
theme_custom.getEventMemberList = function (eventId, memberId) {
  $.ajax({
    url: `${theme_custom.base_url}/api/eventMembers/${eventId}`,
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
      var eventMemberArray = result.data.event_members,
        getMemberHtml = '';
      $(".add-reminder-popup-wrapper #reminderMember").html('');
      for (i = 0; i < eventMemberArray.length; i++) {
        if(!eventMemberArray[i].is_host){
          if (eventMemberArray[i].event_member_id == memberId) {
            getMemberHtml += `<option value="${eventMemberArray[i].event_member_id}" selected>${eventMemberArray[i].first_name} ${eventMemberArray[i].last_name}</option>`;
          }
        }
      }
      $(".add-remider-outer-wrapper .member-wrap").hide()
      $(".add-reminder-popup-wrapper #reminderMember").html(getMemberHtml);
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
        $('.reminder-added-part .api_error').show().html(event_date_msg);
        setTimeout(() => {
          $('.reminder-added-part .api_error').html('').hide();
        }, 10000);
      }
    }
  });
}


theme_custom.guestDetailsClickEvent = function () {

  // remove guest details 
  $(document).on("click", ".remove-reminder", function () {
    var button = $(this);
    var eventId = $(this).closest(".guest-details-outer-wrapper").attr("data-event-id"),
      memberId = $(this).closest(".guest-details-outer-wrapper").attr("data-member-id");
    button.addClass("disabled").find(".button-title").text(button.attr("data-text"));
    theme_custom.removeUserFromLook(eventId, memberId);
  })

  // single-member-detail-part show member guest details 
  $(document).on("click", ".single-member-detail-part", function () {
    var eventId = $(this).attr("data-event-id"),
      memberId = $(this).attr("data-member-id");
    $(".guest-details-outer-wrapper").addClass("hidden");
    $(`.guest-details-outer-wrapper[data-event-id="${eventId}"][data-member-id="${memberId}"]`).removeClass("hidden");
    var getMemberEmail = $(`.guest-details-outer-wrapper[data-event-id="${eventId}"][data-member-id="${memberId}"]`).find(".email-address-wrap .value").text(),
      getMemberPayment = $(`.guest-details-outer-wrapper[data-event-id="${eventId}"][data-member-id="${memberId}"]`).find(".payment-wrap .value").text();
    $(".user-email-value").text(getMemberEmail);
    $(".who-payment").text(getMemberPayment);
    $('html, body').stop().animate({
      'scrollTop': $(".guest-details-main-outer-wrapper").offset().top - $(".header-wrapper").height() + 98
    }, 900);
    var new_url = `event_id=${eventId}&member_id=${memberId}`
    history.pushState(null, '', '?' + new_url);
  })

  // Send reminder 
  $(document).on("click", ".send-reminder", function () {
    var addReminder = $(".add-reminder-popup-wrapper");
    $(".add-reminder-popup-wrapper").find(".title").text("Send Reminder");
    addReminder.find(`input[type="date"],input[type="text"],textarea`).val('');
    addReminder.attr("data-event-id", $(this).closest(".guest-details-outer-wrapper").attr("data-event-id"));
    addReminder.attr("data-member-id", $(this).closest(".guest-details-outer-wrapper").attr("data-member-id"));
    $(".loading-overlay__spinner").removeClass("hidden");
    $(".add-remider-outer-wrapper").addClass("hidden");
    $(".form-error").text('').hide();
    $(".form-error").removeClass("active");
    var memberId = parseInt($(this).closest(".guest-details-outer-wrapper").attr("data-member-id"));
    $.fancybox.open(addReminder);
    theme_custom.getEventMemberList($("#weddingevent_id").val(), memberId);
    setTimeout(() => {
      $(".loading-overlay__spinner").addClass("hidden");
      $(".add-remider-outer-wrapper").removeClass("hidden");
    }, 1500);
  });

  // add-reminder-button Click Event
  $(document).on("click", ".add-reminder-button", function () {
    var parent = $(this).closest('.add-reminder-popup-wrapper'),
    is_email_data=0, is_sms_data=0;
      button = $(this);
    var error_count = 0,
      weddingevent_id = $("#weddingevent_id").val(),
      error_count = error_count + theme_custom.eventReminderTitleValidation(parent.find('#remiderName'));
    error_count = error_count + theme_custom.datePicker(parent.find('#reminderDate'));
    error_count = error_count + theme_custom.textareaValidation(parent.find('#reminderMessage')),
    today = new Date(),
    dd = String(today.getDate()).padStart(2, '0'),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = today.getFullYear(),
    today = yyyy + '-' + mm + '-' + dd;
    reminderDate = today;
    button.addClass("disabled");
    if(parent.find('.send-via:checked').length > 0){
      parent.find(".send_via_error").text('').css('display','none');
    }else{
      parent.find(".send_via_error").text("Please select any option").css('display','inline-block');
    }
    if (error_count == 0) {
      var remiderName = $("#remiderName").val();
      var reminderDate = $("#reminderDate").val();
      var reminderMessage = $("#reminderMessage").val();
      var reminderMember = $("#reminderMember").val();


      $(".schedule-check-main input.schedule-check[type=checkbox]").each(function () {
        if($(this).prop('checked') == true){
          var  reminderDate = today;
          $("#reminderDate").val(reminderDate);
        }
      });

      var reminderArray = [];
      $.each(reminderMember, function (index, item) {
        // var phone = $(`.guest-details-outer-wrapper[data-member-id="${item}"]`).attr('data-phone-number');
        var member_id = $(`.guest-details-outer-wrapper[data-member-id="${item}"]`).attr('data-member-id');
        reminderArray.push({member_id});
      });

      if(parent.find('[value="email"]').prop('checked')){
        is_email_data = 1;
      }
      if(parent.find('[value="text-sms"]').prop('checked')){
        is_sms_data = 1;
      }
      var guestSendReminderDataObj = {
        "name": remiderName,
        "event_id": weddingevent_id,
        "scheduled_date": reminderDate,
        "message": reminderMessage,
        "members": reminderMember,
        "is_email": is_email_data,
        "is_sms": is_sms_data,
      }
      // console.log("guestSendReminderDataObj",guestSendReminderDataObj);
      theme_custom.reminder(guestSendReminderDataObj, button, weddingevent_id, reminderMember);
  }
 
    // if (error_count == 0) {
    //   var targetEventId = parent.attr("data-event-id"),
    //     targetmembeId = parent.attr("data-member-id");
    //   theme_custom.reminder(reminderDataObj, button, targetEventId, targetmembeId);
    // }
  });

}

$(document).ready(function () {
  // Get wedding api
  const api_url = theme_custom.api_base_url;
  var pageUrl = window.location.href
  if (pageUrl.indexOf('event_id') != -1) {
    theme_custom.thePartyGuestDetails();
    theme_custom.guestDetailsClickEvent();
  } else {
    if ($('#custom_email').val() != '') {
      window.location.href = '/account';
    } else {
      window.location.href = '/account/login';
    }
  }
  // reminderDate on changes 
  $('#reminderDate').on('change', function () {
    var error_count = 0;
    error_count = error_count + theme_custom.datePicker($(this));
    var targetDate = $(this).val(),
    newDate = new Date();
  newDate.toLocaleString('en-US', {timeZone: 'America/New_York',}),
  // console.log(theme_custom.changeTimeZone(targetDate, 'America/New_York'));
  var month = newDate.getMonth() + 1;
  var day = newDate.getDate();
  var output = newDate.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
  var startDay = new Date(targetDate);
  var endDay = new Date(output);
  var millisBetween = startDay.getTime() - endDay.getTime();
  var days = millisBetween / (1000 * 3600 * 24);
  if (days <= 0) {
    // $(this).closest(".field-wrap").find(".form-error").text("Please select date after current date!").css({
    //   'margin-top': '15px',
    //   'display': 'block'
    // });
    $(this).closest(".field-wrap").find(".schedule-check").prop('checked', true);
  } else {
    $(this).closest(".field-wrap").find(".form-error").text('').css({
      'display': 'none'
    });
    $(this).closest(".field-wrap").find(".schedule-check").prop('checked', false);
  }
  });

         // code for send reminder current date checkbox
 $(document).on('change','.schedule-check-main .schedule-check',function(){
  $(".schedule-check-main input.schedule-check[type=checkbox]").each(function () {
    if($(this).prop('checked') == true){
      var today = new Date(),
      dd = String(today.getDate()).padStart(2, '0'),
      mm = String(today.getMonth() + 1).padStart(2, '0'),
      yyyy = today.getFullYear(),
      today = yyyy + '-' + mm + '-' + dd;
      var  reminderDate = today;
      $("#reminderDate").val(reminderDate);
    }
  });
});

theme_custom.changeTimeZone = function (newDate, timeZone){
  if (typeof newDate === 'string') {
    return new Date(
      new Date(newDate).toLocaleString('en-US', {
        timeZone,
      }),
    );
  }

  return new Date(
    newDate.toLocaleString('en-US', {
      timeZone,
    }),
  );
}

})

$(document).on('change','.send-via',function(){

  // send member popup
  $('.add-reminder-popup-wrapper input.send-via[type=checkbox]').each(function () {
    if($('.send-via:checked').length > 0){
      $(this).closest('.add-reminder-popup-wrapper').find('.add-reminder-button').removeClass('disabled');
      $(this).closest('.add-reminder-popup-wrapper').find('.send_via_error').text('').css('display','none');
    }else{
      $(this).closest('.add-reminder-popup-wrapper').find('.add-reminder-button').addClass('disabled');
      $(this).closest('.add-reminder-popup-wrapper').find('.send_via_error').text("Please select any option").css('display','inline-block');
    }
  });
});