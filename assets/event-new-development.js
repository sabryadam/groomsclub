// event-new-development
theme_custom.createEventValidation = function(){
  var error_count = 0;
  error_count = error_count +  theme_custom.eventReminderTitleValidation($('.event-page-new-design-wrapper .event-name'));
  if (error_count > 0) {
    $('html, body').animate({
      scrollTop: $('.event-page-new-design-wrapper').offset().top - 120
    }, 1000);
    return false; 
  }
}
theme_custom.eventPageClickEvent = function(){
  $(document).on("click", ".event-page-new-design-wrapper .next-button", function(){
    theme_custom.createEventValidation();
    var target = $(this);
    target.closest(".step-content-wrapper").removeClass("active");
    target.closest(".step-content-wrapper").next().addClass("active");
    var nextTarget = target.closest(".step-content-wrapper").next().attr("data-step-content-wrap");
    $(`.event-page-new-design-wrapper .step-header-wrap .step-wrap[data-step-label-wrap="${nextTarget}"]`).addClass("active");
  });
  $(document).on("click", ".event-page-new-design-wrapper .previous-button", function(){
    var target = $(this);
    target.closest(".step-content-wrapper").removeClass("active");
    target.closest(".step-content-wrapper").prev().addClass("active");
    var prevTarget = target.closest(".step-content-wrapper").attr("data-step-content-wrap");
    $(`.event-page-new-design-wrapper .step-header-wrap .step-wrap[data-step-label-wrap="${prevTarget}"]`).removeClass("active");
  })
}

theme_custom.calender = function(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();        
  today = yyyy + '-' + mm + '-' + dd;
  $('#date_picker').attr('min',today);
}

theme_custom.event_init_page = function(){
  theme_custom.eventPageClickEvent();
  // theme_custom.calender();
  // $(document).on('change', 'input[name="event-type"]', function () {
  //   $('.event-type_section_wrap .event-type-error').removeClass('active');
  // });
  // $('.event-page-new-design-wrapper .event-name').bind("keypress keyup keydown", function (e) {
  //   theme_custom.eventReminderTitleValidation($(this));
  // });
}

$(document).ready(function() {
  theme_custom.event_init_page(); 
})