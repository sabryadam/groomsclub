class creteEventPageStep1{
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
  phoneValidation = (eventPhoneNumber) => {
    let error = ""
    let targetEl = $(eventPhoneNumber).val().length;
    var numbers = /^[0-9]+$/  ;
    var thisValue = $(eventPhoneNumber).val().replace(' ','').replace(')','').replace('(','').replace('-','');
    var thisValueLength = thisValue.length;
    if (targetEl == 0) {
      error = 'This field is required'
    } else {
      if ($(eventPhoneNumber).val() != "") {
        if (!thisValue.match(numbers)) {
          error = 'Please enter only number';
        } else {
          if (thisValueLength <= 9) {
            error = 'Please enter minimum 10 number';
          }
        }
      }
    }
    return error;
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
    let eventPhoneNumber = $('.phone-number',eventPhoneNumberParent);
    let eventPhoneNumberError = $(".form-error",eventPhoneNumberParent);
    let phoneError = this.phoneValidation(eventPhoneNumber)
    if (phoneError) {
      eventPhoneNumberError.text(phoneError)
      eventPhoneNumberError.addClass('active');
      this.moveToElemet(eventPhoneNumberParent);
      errorFound = true;
      return errorFound;
    }else{
      eventPhoneNumberError.removeClass('active');
    }

    return errorFound;
  }
  createEvent = async(parent) =>{
    var event_name = $('.event-name',parent).val();
    var event_type = $('[name="event-type"]:checked',parent).attr('data-event-type-id');
    var event_date = $('#event_date',parent).val();
    var event_role = $('[name="event-role"]:checked',parent).attr('data-event-role-id');
    var event_phone = $('.phone-number',parent).val().replace('(','').replace(' ','').replace(')','').replace('-','');
    var event_data = {
      "name": event_name,
      "event_type_id": event_type,
      "event_date": event_date,
      "event_role_id": event_role,
      "owner_phone_number":event_phone
    }
    try{
      const data = await fetch(`${this.base_url}/api/event/create`,{
        method: "POST",
        body: JSON.stringify(event_data),
        headers: {
          'Content-Type': 'application/json',
          "Authorization": this.appToken
        }
      })
      const res = await data.json();
      console.log("res",res);
    }catch(e){
      console.log(e)
    }
    
  }
  changeEvent = () =>{
    const that = this;
    const createEventBtn = document.querySelector('.create-event-button');
    createEventBtn.addEventListener('click',function(e){
      const parent = $(this).closest('.step-content-wrapper');
      const errorFound = that.createEventValidation(parent);
      if(errorFound){
        return;
      }
      $(createEventBtn).text('Creating Event...')
      that.createEvent(parent);
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
new creteEventPageStep1();