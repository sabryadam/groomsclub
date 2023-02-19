class creteEventPage{
  constructor(){
    this.base_url = theme_custom.api_base_url;
    this.appToken = 'Bearer ' + localStorage.getItem("customerToken");
    this.init();
  }
  moveToElemet = (element) =>{
    $('html, body').animate({
      scrollTop: $(element).offset().top - 120
    }, 1000);
  }
  goToNext = () =>{

  }
  goToPrevious = () =>{
    
  }
  clickEvent = () =>{

  }
  createEventValidation = (parent) =>{
    let errorFound = false;
    let eventNameParent = $('.event-name-wrap',parent)
    let eventName = $(".event-name",eventNameParent).val();
    let eventError = $(".form-error",eventNameParent);
    if(eventName) {
      if(eventName.length > 99){
        eventError.text("This is too long (maximum is 100 characters)");  
        eventError.addClass('active');
        this.moveToElemet(eventNameParent);
        errorFound = true;
        return errorFound
      }else{
        eventError.removeClass('active'); 
      }
    }else{
      eventError.text("This field is required");
      eventError.addClass('active');
      this.moveToElemet(eventNameParent);
      errorFound = true;
      return errorFound
    }

    let eventTypeParent = $('.event-type-wrap',parent)
    let eventType = $('[name="event-type"]:checked',eventTypeParent);
    let eventTypeError = $(".form-error",eventTypeParent);
    if (eventType.length == 0) {
      eventTypeError.addClass('active');
      this.moveToElemet(eventTypeParent);
      errorFound = true;
      return errorFound;
    }else{
      eventTypeError.removeClass('active');
    }

    let eventDateParent = $('.event-date-wrap',parent)
    let eventDate = $('#event_date',eventDateParent).val();
    let eventDateError = $(".form-error",eventDateParent);
    if (!eventDate) {
      eventDateError.addClass('active');
      this.moveToElemet(eventDateParent);
      errorFound = true;
      return errorFound;
    }else{
      eventDateError.removeClass('active');
    }

    let eventRoleParent = $('.role-in-event-wrap',parent)
    let eventRole = $('[name="event-role"]:checked',eventRoleParent);
    let eventRoleError = $(".form-error",eventRoleParent);
    if (eventRole.length == 0) {
      eventRoleError.addClass('active');
      this.moveToElemet(eventRoleParent);
      errorFound = true;
      return errorFound;
    }else{
      eventRoleError.removeClass('active');
    }
    
    let eventPhoneNumberParent = $('.event-phone-number',parent)
    let eventPhoneNumber = $('.phone-number',eventPhoneNumberParent).val();
    let eventPhoneNumberError = $(".form-error",eventPhoneNumberParent);
    if (!eventPhoneNumber) {
      eventPhoneNumberError.addClass('active');
      this.moveToElemet(eventPhoneNumberParent);
      errorFound = true;
      return errorFound;
    }else{
      eventPhoneNumberError.removeClass('active');
    }

    return errorFound;
  }
  changeEvent = () =>{
    const that = this;
    const createEventBtn = document.querySelector('.create-event-button');
    createEventBtn.addEventListener('click',function(e){
      const parent = $(this).closest('.step-content-wrapper');
      const errorFound = that.createEventValidation(parent);
      if(!errorFound){
        return;
      }
    })
  }
  initDate = () =>{
    $( "#event_date" ).datepicker();
  }
  init = () =>{
    this.clickEvent();
    this.changeEvent();
    this.initDate();
  }
}
new creteEventPage();