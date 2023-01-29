theme_custom.base_url = theme_custom.api_base_url;

$(document).ready(function () {

  if (window.location.href.indexOf("?event_id=") > -1) {
    // ------------------ calender -------------------------
    function date() {

      var data_val = $("#eventDate").val().replace(/-/g, "/");
      var d = new Date(data_val);

      var Calendar = {
        themonth: d.getMonth(), // The number of the month 0-11
        theyear: d.getFullYear(), // This year
        today: [d.getFullYear(), d.getMonth(), String(d.getDate()).padStart(2, '0')], // adds today style
        selectedDate: null, // set to today in init()
        years: [], // populated with last 10 years in init()
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

        init: function () {
          this.selectedDate = this.today
          // Populate the list of years in the month/year pulldown
          var year = this.theyear;
          for (var i = 0; i < 10; i++) {
            this.years.push(year--);
          }

          var yyyy = Calendar.today[0];
          var mm = Calendar.today[1] + 1;
          var dd = Calendar.today[2];
          $('#eventDate').val(yyyy + '-' + (mm <= 9 ? '0' + mm : mm) + '-' + dd);

          this.bindUIActions();
          this.render();
        },

        bindUIActions: function () {
          // Create Years list and add to ympicker
          for (var i = 0; i < this.years.length; i++)
            $('<li><span>' + this.years[i] + '</span></li>').appendTo('.calendar-ympicker-years');
          this.selectMonth();
          this.selectYear(); // Add active class to current month n year

          // Slide down year month picker
          $('.monthname').click(function () {
            $('.calendar-ympicker').css('transform', 'translateY(0)');
          });

          // Close year month picker without action
          $('.close').click(function () {
            $('.calendar-ympicker').css('transform', 'translateY(-100%)');
          });

          // Move calander to today
          $('.today').click(function () {
            Calendar.themonth = d.getMonth();
            Calendar.theyear = d.getFullYear();
            Calendar.selectMonth();
            Calendar.selectYear();
            Calendar.selectedDate = Calendar.today;
            Calendar.render();
            $('.calendar-ympicker').css('transform', 'translateY(-100%)');
            var m = Calendar.today[1] + 1;
            $('#eventDate').val(Calendar.today[0] + '-' + (m <= 9 ? '0' + m : m) + '-' + Calendar.today[2]);
          });

          // Click handlers for ympicker list items
          $('.calendar-ympicker-months li').click(function () {
            Calendar.themonth = $('.calendar-ympicker-months li').index($(this));
            Calendar.selectMonth();
            Calendar.render();
            $('.calendar-ympicker').css('transform', 'translateY(-100%)');
          });
          $('.calendar-ympicker-years li').click(function () {
            Calendar.theyear = parseInt($(this).text());
            Calendar.selectYear();
            Calendar.render();
            $('.calendar-ympicker').css('transform', 'translateY(-100%)');
          });

          // Move the calendar pages
          $('.minusmonth').click(function () {
            Calendar.themonth += -1;
            Calendar.changeMonth();
            if (Calendar.themonth == (theme_custom.currentMonth - 1)) {
              $(this).addClass("disabled");
              $(".calendar-body").find("li.active.today").prevAll("li").addClass("disabled");
            }
          });
          $('.addmonth').click(function () {
            Calendar.themonth += 1;
            Calendar.changeMonth();
            $(".minusmonth").removeClass("disabled");
          });
        },

        // Adds class="active" to the selected month/year
        selectMonth: function () {
          $('.calendar-ympicker-months li').removeClass('active');
          $('.calendar-ympicker-months li:nth-child(' + (this.themonth + 1) + ')').addClass('active');
        },
        selectYear: function () {
          $('.calendar-ympicker-years li').removeClass('active');
          $('.calendar-ympicker-years li:nth-child(' + (this.years.indexOf(this.theyear) + 1) + ')').addClass('active');
        },

        // Makes sure that month rolls over years correctly
        changeMonth: function () {
          if (this.themonth == 12) {
            this.themonth = 0;
            this.theyear++;
            this.selectYear();
          } else if (this.themonth == -1) {
            this.themonth = 11;
            this.theyear--;
            this.selectYear();
          }
          this.selectMonth();
          this.render();
        },

        // Helper functions for time calculations
        TimeCalc: {
          firstDay: function (month, year) {
            var fday = new Date(year, month, 1).getDay(); // Mon 1 ... Sat 6, Sun 0
            if (fday === 0) fday = 7;
            return fday - 1; // Mon 0 ... Sat 5, Sun 6
          },
          numDays: function (month, year) {
            return new Date(year, month + 1, 0).getDate(); // Day 0 is the last day in the previous month
          }
        },

        render: function () {
          var days = this.TimeCalc.numDays(this.themonth, this.theyear), // get number of days in the month
            fDay = this.TimeCalc.firstDay(this.themonth, this.theyear), // find what day of the week the 1st lands on        
            daysHTML = '',
            i;

          $('.calendar .monthname').text(this.months[this.themonth] + '  ' + this.theyear); // add month name and year to calendar
          for (i = 0; i < fDay; i++) { // place the first day of the month in the correct position
            daysHTML += '<li class="noclick"><span>&nbsp;</span></li>';
          }
          // write out the days
          for (i = 1; i <= days; i++) {
            if (this.today[0] == this.selectedDate[0] &&
              this.today[1] == this.selectedDate[1] &&
              this.today[2] == this.selectedDate[2] &&
              this.today[0] == this.theyear &&
              this.today[1] == this.themonth &&
              this.today[2] == i)
              daysHTML += '<li class="active today"><span>' + i + '</span></li>';
            else if (this.today[0] == this.theyear &&
              this.today[1] == this.themonth &&
              this.today[2] == i)
              daysHTML += '<li class="today">' + i + '</li>';
            else if (this.selectedDate[0] == this.theyear &&
              this.selectedDate[1] == this.themonth &&
              this.selectedDate[2] == i)
              daysHTML += '<li class="active"><span>' + i + '</span></li>';
            else
              daysHTML += '<li><span>' + i + '</span></li>';

            $('.calendar-body').html(daysHTML); // Only one append call
          }

          // Adds active class to date when clicked
          $('.calendar-body li').click(function () { // toggle selected dates
            if (!$(this).hasClass('noclick')) {
              $(".update_event_btn").removeClass("disabled");
              $('.calendar-body li').removeClass('active');
              $(this).addClass('active');
              Calendar.selectedDate = [Calendar.theyear, Calendar.themonth, $(this).text()]; // save date for reselecting
              var m = Calendar.themonth + 1;
              $('#eventDate').val(Calendar.theyear + '-' + (m <= 9 ? '0' + m : m) + '-' + ($(this).text() <= 9 ? '0' + $(this).text() : $(this).text()));
            }
          });
        }
      };
      Calendar.init();
    }
    // ------------------End calender -------------------------


    // ------------------ Get Event Details -------------------------
    function getEventDetail() {
      var searchParams = new URLSearchParams(window.location.search)

      if (searchParams.has('event_id')) {
        var event_id = searchParams.get('event_id');

        if (event_id) {

          $.ajax({
            url: `${theme_custom.base_url}/api/event/${event_id}`,
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
              $('#EventForm-EventName').val(result.data.event_name);
              $('#EventForm-id').val(result.data.event_id);
              if(result.data.event_type == 'Special Event'){
                $(`.Squer-radio-button-inner[data-class="special event"]`).removeClass("hidden");
                $(`.Squer-radio-button-inner[data-class="wedding"]`).addClass("hidden");
              }else{
                $(`.Squer-radio-button-inner[data-class="wedding"]`).removeClass("hidden");
                $(`.Squer-radio-button-inner[data-class="special event"]`).addClass("hidden");
              }
              $(".Squer-radio-button-inner:not(.hidden) input[name=event-type][value='" + result.data.event_type + "']").prop('checked', true);
              $(".Squer-radio-button-inner:not(.hidden) input[name=event_role][data-value='" + result.data.event_role + "']").prop('checked', true);
              $('#eventDate').val(result.data.event_date);
              date();
              $.each(result.data.event_members,function(index,value){
                if(value.is_host == "1"){
                  $('.event_owner_number').val(value.phone.replace("+1","")).trigger("keyup");
                  $(".update_event_btn").removeClass("disabled");
                }
              });
              $(".calendar-body").find("li.active").prevAll().addClass("disabled");
            },
            error: function (xhr, status, error) {
              if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $('.getapi_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                  'text-align': 'center',
                  'color': 'red'
                });
                setTimeout(() => {
                  window.location.href = '/account/logout';
                }, 5000);
              } else {
                var erroData = '';
                erroData = '<p>' + xhr.responseJSON.message + '</p>';
                // erroData += '<p>' + xhr.responseJSON.data.event_id + '</p>';
                $('.getapi_error').show().html(erroData);
              }
            }
          });

        } else {
          alert('we are not able to find event');
        }
      }

    }
    getEventDetail();
    // ------------------ End Get Event Details -------------------------

    $('input[name=event-type]').change(function () {
      $(".update_event_btn").removeClass("disabled");
      var value = $('input[name=event-type]:checked').val();
      $('#eventupdate-event-type .event-type_section_wrap .event-type-error').removeClass('active');
    });
    $('input[name=event_role]').change(function () {
      $(".update_event_btn").removeClass("disabled");
      var value = $('input[name=event_role]:checked').val();
      $('#eventupdate-event-role .event-role_section_wrap .event-role-error').removeClass('active');
    });
    $("#EventForm-EventName").bind("keypress keyup keydown", function (e) {
      $(".update_event_btn").removeClass("disabled");
      theme_custom.eventReminderTitleValidation($(this));
      if (e.which == 32) {
        return true;
      }
    });
  } else {
    window.location.href = "/account"
  }


});
// start Update event click event
$(document).on('click', '.update_event_btn', function (e) {
  e.preventDefault();
  var parent = $(this).closest('#updateEventWrap');
  var event_name = $('#EventForm-EventName').val(),
    event_type = $('[name="event-type"]:checked').data('event_type_id'),
    event_date = $('#eventDate').val(),
    event_role = $('[name="event_role"]:checked').data('event_role_id'),
    eventId = $("#EventForm-id").val(),
    error_count = 0,
    button = $(this),
    owner_phone_number = $('.event_owner_number').val().replace('(','').replace(' ','').replace(')','').replace('-','');
    if (error_count == 0) {
      UpdateEvent_data = {
        "name": event_name,
        "event_type_id": event_type,
        "event_date": event_date,
        "event_role_id": event_role,
        "owner_phone_number": owner_phone_number
      }
    }
    error_count = error_count +  theme_custom.eventReminderTitleValidation(parent.find('.custom-event-reminder-name'));
      if ($('[name="event-type"]:checked').length > 0) {
        event_type_id = parent.find('[name="event-type"]:checked').attr('data-event_type_id');
      } else {
        $('#eventupdate-event-type .event-type_section_wrap .event-type-error').addClass('active');
        $('html, body').animate({
          scrollTop: $('#eventupdate-event-type').offset().top - 120
        }, 1000);
        return false;
      }
      if ($('.Squer-radio-button-inner:not(.hidden) [name="event_role"]:checked').length > 0) {
        event_role_id = parent.find('[name="event_role"]:checked').attr('data-event_role_id');
      } else {
        $('#eventupdate-event-role .event-role_section_wrap .event-role-error').addClass('active');
        $('html, body').animate({
          scrollTop: $('#eventupdate-event-role').offset().top - 120
        }, 1000);
        return false;
      }
    $.ajax({
      url: `${theme_custom.base_url}/api/event/edit/${eventId}`,
      method: "PUT",
      data: UpdateEvent_data,
      dataType: "json",
      headers: {
        // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
        "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
      },
      beforeSend: function () {
      },
      success: function (result) {
        $(button).addClass("disabled");
        $('.update-event-wrapper .api_error').addClass("success-event").show().html(result.message);
        setTimeout(() => {
          $(button).removeClass("disabled");
          window.location.href = '/pages/my-event?event_id=' + eventId;
        }, 3000);
      },
      error: function (xhr, status, error) {
        $(button).removeClass("disabled");
        setTimeout(function () {
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
            $('.update-event-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
              'text-align': 'center',
              'color': 'red'
            });
            setTimeout(() => {
              window.location.href = '/account/logout';
            }, 5000);
          } else {
            $('.update-event-wrapper .api_error').show().html(xhr.responseJSON.message);
            $(button).removeClass("disable");
          }
        }, 10000);
      }
    });
});
// end Update event click event