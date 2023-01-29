theme_custom.base_url = theme_custom.api_base_url;

theme_custom.priceCalculator = function(){
  if($(".product-data-card").length>0){
    var subTotal = 00;
    $(".product-data-card").each(function(){
      var productSelectedVar = $(this).find(".single-option-selector").val(),
          productPrice = $(this).find(`.single-option-selector option[value="${productSelectedVar}"]`).attr("data-v-price");
      subTotal = subTotal + parseInt(productPrice);
    })
    var finalPrice = theme_custom.Shopify.formatMoney(subTotal, theme_custom.money_format);
    $(".pdp-price-part .price-item--regular").text(finalPrice);
  }
}

theme_custom.getEventData = function(modalTarget){
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
    headers: {
      // "Authorization": 'Bearer Am3Trk0xm4fR5SXdni5zilc1ffwxFFUWwwwnh2ZQ98wRSL9KDihFoBMnCJ9Dw8Kc8A5zkHnMZBot02nbyybQEtSd3dadnY4RFZZQQ'
      "Authorization": 'Bearer '+localStorage.getItem("customerToken")
    },
    beforeSend: function() {
    },
    success: function(result) {
      var dataOptionArray = result.data.events;
      $.fancybox.open(modalTarget);
      if(result.data.events.length > 0){
        $(".page-loader").addClass("hidden");
        $("html,body").css("overflow","visible");
        modalTarget.find(".empty-error-msg").addClass("hidden");
        modalTarget.find(".look-assign-wrapper").removeClass("hidden");
        var productDataCardArr = $(".product-data-card"),
            dataObj = {};
        theme_custom.newArray = [],
        productDataCardArr.each(function(){
          if($(this).find(".looks-product-var-id").val() != ''){
            dataObj = {
              "product_id": $(this).find(".looks-product-id").val(),
              "variant_id": $(this).find(".looks-product-var-id").val(),
              "product_handle": $(this).find(".looks-product-handle").val(),
              "type": "looks"
            }
            theme_custom.newArray.push(dataObj);
          }
        })
        var optionVal = '';
        optionVal +=`<option value="">Select Event</option>`;
        for(let i=0; i<dataOptionArray.length; i++){
          if(dataOptionArray[i].hostedBy == "Me" || dataOptionArray[i].hostedBy == 'me'){
            optionVal +=`<option value="${dataOptionArray[i].event_id}">${dataOptionArray[i].name}</option>`;
          }
        }
        $("select#event-id").html(optionVal);
      } else {
        $(".page-loader").addClass("hidden");
        $("html,body").css("overflow","visible");
        modalTarget.find(".empty-error-msg").removeClass("hidden");
        modalTarget.find(".look-assign-wrapper").addClass("hidden");
      }
    },
    error: function(xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.assign-member-look-popup-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.assign-member-look-popup-wrapper .api_error').show().html(xhr.responseJSON.message);
        setTimeout(() => {
          $('.assign-member-look-popup-wrapper .api_error').hide();
        }, 3000);
      }
    }
  });
}

theme_custom.getFitFinder = function(){
  var fitFinderDataHTML = '';
  $.ajax({
    url: `${theme_custom.api_base_url}/api/customer/myFit`,
    method: "GET",
    data: '',
    dataType: "json",
    headers: {
      "Authorization": 'Bearer '+localStorage.getItem("customerToken")
    },
    beforeSend: function() {
    }, 
    success: function(result){
      if(result.success){
        var getProductType = $('.sizing-and-fit-wrapper').attr("data-product-type");
        if(result.data.length > 0){
          fitFinderDataHTML += `<h5 class="heading">Sizing & Fit</h5>`;
          for(var i=0; i<result.data.length; i++){
            fitFinderDataHTML +=`<input class="size_customer_id" type="hidden" value="${result.data[i].customer_id}">`;
            if(result.data[i].jacket_size && result.data[i].jacket_type && (getProductType == 'suit' || getProductType == 'looks')) {
              var jacketType = result.data[i].jacketSize.split(":");
              var jacketTypeVal = '';
              if(jacketType[1] == "S") {
                  jacketTypeVal = 'Short'
              } else if(jacketType[1] == "R") {
                  jacketTypeVal = 'Regular'
              } else if(jacketType[1] == "L"){
                  jacketTypeVal = 'Long'
              }
                fitFinderDataHTML +=`<div class="filed-wrapper">
                                    <p class="field__label title">Jacket Size :</p>
                                    <p class="value">${jacketType[0]} ${jacketTypeVal}</p>
                                  </div>`;
            }
            if(result.data[i].pants_waist && result.data[i].pants_hight && (getProductType == 'suit' || getProductType == 'looks')){
              fitFinderDataHTML+= `<div class="filed-wrapper">
                                    <p class="field__label title">Pants Size :</p>
                                    <p class="value">${result.data[i].pants_waist}W ${result.data[i].pants_hight}H</p>
                                  </div>`
            }
            if(result.data[i].shirt_neck && result.data[i].shirt_sleeve && getProductType == 'looks'){
              fitFinderDataHTML+= `<div class="filed-wrapper">
                                    <p class="field__label title">Shirt Size:</p>
                                    <p class="value">Neck ${result.data[i].shirt_neck}, Sleeve ${result.data[i].shirt_sleeve}</p>
                                  </div>`
            }
            if(result.data[i].shoe_size && getProductType == 'looks'){
              fitFinderDataHTML+= `<div class="filed-wrapper">
                                    <p class="field__label title">Shoe Size:</p>
                                    <p class="value">${result.data[i].shoe_size}</p>
                                  </div>`
            }
          }
          $(".fit-finder-main-wrapper").remove();
          $(".sizing-and-fit-wrapper").html(fitFinderDataHTML);
          $(".empty-fit-fider-wrapper").addClass("hidden");
          $(".favorite-event-cart-wrapper .add-to-event .add-event-look").removeClass("disabled");
          $(".variant-info-wrap").find(".edit-size-title").addClass("hidden");
          $(".variant-info-wrap").find(".product-variant-value").removeClass("hidden");
          $(".variant-info-wrap").find(".edit-item-button").text("Edit Item");
          $(".product-data-card").each(function(){
            if($(this).attr("data-product-type") == 'vest' || $(this).attr("data-product-type") == 'shoes' || $(this).attr("data-product-type") == 'shirt'){
              $(this).find(".variant-title").removeClass('hidden');
              $(this).find(".cta-button-wrap").css('margin-top','0');
              $(this).find(".edit-item-btn").text('Edit Item');
            }
          })
        } else{
          $(".my-size-block-main").css({
              "display":"block",
              "min-height" : "auto"
          });    
          // var html = `<div class="empty_message size-empty-msg"> We didn't find the Fit Finder data....</div>`;
          var html = `<div class="empty_message size-empty-msg">${theme_custom.fitFinderEmptyMsg}</div>`;
          $('.my-size-block-main').html(html);
          $(".empty-fit-fider-wrapper").removeClass("hidden");
          $('.my-size-block-main').removeClass('displayBlock');
        }
        $(".customize-button-fit-your-find").removeClass("hidden");
        if($(".error-message").text() != '' > 0 || getCookie("fit-finder-data") == ''){
          $(".product-form__submit").addClass("custom-top-look-disable")
        } else {
          $(".product-form__submit").removeClass("custom-top-look-disable")
        }
        if(getCookie("fit-finder-data") != ''){
          $(".cta-button-wrap").removeClass("hidden");
        }
      }
    },
    error:function(xhr,status,error){
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $(".empty-fit-fider-wrapper").removeClass("hidden");
        $('.sizing-and-fit-wrapper').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.sizing-and-fit-wrapper').html(xhr.responseJSON.message);
        $(".empty-fit-fider-wrapper").removeClass("hidden");
      }
    }
  });  
}

theme_custom.getFitFinderCookie = function(){
  var fitFinderDataHTML = '';
  if(getCookie("fit-finder-data") != ""){
    var getFitFinderData = JSON.parse(getCookie("fit-finder-data"));
    if(getFitFinderData.jacket_size && getFitFinderData.jacket_type) {
      var jacketType = getFitFinderData.jacketSize.split(":");
      var jacketTypeVal = '';
      if(jacketType[1] == "S") {
          jacketTypeVal = 'Short'
      } else if(jacketType[1] == "R") {
          jacketTypeVal = 'Regular'
      } else if(jacketType[1] == "L"){
          jacketTypeVal = 'Long'
      }
      fitFinderDataHTML +=`<div class="filed-wrapper">
                            <p class="field__label title">Jacket Size :</p>
                            <p class="value">${jacketType[0]} ${jacketTypeVal}</p>
                          </div>`;
    }
    if(getFitFinderData.pants_waist && getFitFinderData.pants_hight){
      fitFinderDataHTML+= `<div class="filed-wrapper">
                            <p class="field__label title">Pants Size :</p>
                            <p class="value">${getFitFinderData.pants_waist}W ${getFitFinderData.pants_hight}H</p>
                          </div>`
    }
    if(getFitFinderData.shirt_neck && getFitFinderData.shirt_sleeve){
      fitFinderDataHTML+= `<div class="filed-wrapper">
                            <p class="field__label title">Shirt Size:</p>
                            <p class="value">Neck ${getFitFinderData.shirt_neck}, Sleeve ${getFitFinderData.shirt_sleeve}</p>
                          </div>`
    }
    if(getFitFinderData.shoe_size){
      fitFinderDataHTML+= `<div class="filed-wrapper">
                            <p class="field__label title">Shoe Size:</p>
                            <p class="value">${getFitFinderData.shoe_size}</p>
                          </div>`
    }
    $(".fit-finder-main-wrapper").remove();
    $(".sizing-and-fit-wrapper").html(fitFinderDataHTML);
    $(".empty-fit-fider-wrapper").addClass("hidden");
    $(".favorite-event-cart-wrapper .add-to-event .add-event-look").removeClass("disabled");
    $(".variant-info-wrap").find(".edit-size-title").addClass("hidden");
    $(".variant-info-wrap").find(".product-variant-value").removeClass("hidden");
    $(".variant-info-wrap").find(".edit-item-button").text("Edit Item");
    $(".product-data-card").each(function(){
      if($(this).attr("data-product-type") == 'vest' || $(this).attr("data-product-type") == 'shoes' || $(this).attr("data-product-type") == 'shirt'){
        $(this).find(".variant-title").removeClass('hidden');
        $(this).find(".cta-button-wrap").css('margin-top','0');
        $(this).find(".edit-item-btn").text('Edit Item');
      }
    });
  } else {
    $(".my-size-block-main").css({
      "display":"block",
      "min-height" : "auto"
    });
    var html = `<div class="empty_message size-empty-msg">${theme_custom.fitFinderEmptyMsg}</div>`;
    $('.my-size-block-main').html(html);
    $(".empty-fit-fider-wrapper").removeClass("hidden");
    $('.my-size-block-main').removeClass('displayBlock');
  }
  $(".customize-button-fit-your-find").removeClass("hidden");
  var chekcProductError = setInterval(() => {
    if($(".error-message").text() != '' > 0 || getCookie("fit-finder-data") == ''){
      $(".product-form__submit").addClass("custom-top-look-disable")
      clearInterval(chekcProductError)
    } else {
      $(".product-form__submit").removeClass("custom-top-look-disable")
      clearInterval(chekcProductError)
    }
  }, 500);
}

theme_custom.lookImage = function(getEventId,lookID,button){
  var button = button,
      form_data = new FormData(),
      fileVal = theme_custom.ImageURL,
      imageType = /image.*/;

  if (!fileVal.type.match(imageType)){
    return;
  } else {
    form_data.append('lookImage',fileVal);
  }
  $.ajax({
    url: `${theme_custom.base_url}/api/look/picture/${lookID}`,
    method: "POST",
    timeout : "0",
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
    success: function(result) {
      button.removeClass("disabled").text("Added Look");
      $(".look-api-message").text("Look successfully added to Event").addClass("sucess-msg").removeClass("hidden");
      setTimeout(() => {
        $(".look-api-message").addClass("hidden");
        window.location.href = `/pages/my-event?event_id=${getEventId}`
      },5000);
    },
    error: function(xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.update-profile-image-popup-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        button.removeClass("disabled").text("Add Look");
        $('.update-profile-image-popup-wrapper .api_error').show().html(xhr.responseJSON.message);
        setTimeout(() => {
          $('.update-profile-image-popup-wrapper .api_error').hide();        
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

theme_custom.lookPreviewImage = function(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#look-image-preview').css('background-image', 'url('+e.target.result+')');
      $('#look-image-preview').attr("image-preview",e.target.result);
      $('#look-image-preview').hide();
      $('#look-image-preview').fadeIn(650);
    }
    reader.readAsDataURL(input.files[0]);
    $('.look-image-wrap').addClass("image-preview");
    $(".look-image-wrap").find(".form-error").hide();
  }
}

theme_custom.favoriteLookImageCustomizer = function(lookID,button){
  var button = button,
      form_data = new FormData(),
      fileVal = theme_custom.ImageURL,
      imageType = /image.*/;
console.log('theme_custom.ImageURL',theme_custom.ImageURL);
  if (!fileVal.type.match(imageType)){
    return;
  } else {
    form_data.append('lookImage',fileVal);
  }
  $.ajax({
    url: `${theme_custom.base_url}/api/look/picture/${lookID}`,
    method: "POST",
    timeout : "0",
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
    success: function(result) {
      $(".favourite-look-api-message").text("Look added successfully to Favorite").addClass("sucess-msg").removeClass("hidden").show();
      button.removeClass("disabled");
      button.find('.button-title').text('Added in Favorite');
      button.find(".loading-overlay").addClass("hidden");
      setTimeout(() => {
        button.removeClass("disabled").text("Added look into favorite");
        $(".favourite-look-api-message").addClass("hidden");
        window.location.href = `/account#tab-3`
      },3000);
    },
    error: function(xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $(".look-api-message").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        button.addClass("disabled").css("margin-top","15px");
        $(".look-api-message").html(xhr.responseJSON.message).removeClass("look-api-message");
        setTimeout(() => {
          $('.update-profile-image-popup-wrapper .api_error').hide();
          $(".look-api-message").removeClass("look-api-message");
          button.removeClass("disabled");
          button.find('.button-title').text('Add Favorite Look');
          button.find(".loading-overlay").addClass("hidden");
        }, 3000);
      }
    }
  });
}

// theme_custom.favouriteLookApi
theme_custom.favouriteLookApi = function(lookName,lookUrl,produArray,button){
  eventData = {
    "look_name": lookName,
    "url": lookUrl,
    "favourite": "1",
    "items": produArray
  }
  $.ajax({
    url: `${theme_custom.api_base_url}/api/look/favourite`,
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
      // console.log('lookID',lookID);
      theme_custom.favoriteLookImageCustomizer(lookID, button);
    },
    error:function(xhr,status,error){
      button.removeClass("disabled").text("Add Favorite Look");
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.favourite-look-api-message').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').removeClass("hidden").show().css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        var event_date_msg = '';
        if(xhr.responseJSON.data){
          if(xhr.responseJSON.data.favourite != undefined){
            for(let i=0 ;i<xhr.responseJSON.data.favourite.length; i++){
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

theme_custom.favoriteButtonEvent = function(button,productArray){
  var error_count = 0,
      button = button;
  error_count = error_count + theme_custom.textValidationWithSpacialChar(button.closest(".favourite-look-wrapper").find('[name="look-name"'));
  if (error_count > 0) {
    // e.preventDefault();
    // button.text("Add to Favorite");
    return false;
  } else {
    button.addClass("disabled");
    // button.text(button.data("text"));
    var lookName = button.closest(".favourite-look-wrapper").find("#look-name").val(),
        lookUrl = $("#product-url").val();
        produArray = productArray;
    theme_custom.favouriteLookApi(lookName,lookUrl,produArray,button);
  }
}

theme_custom.getVariantDataEditItemPopup = function(parentEl){
  var variantDataGetArr = [];
  var parent = parentEl,
      productId = parent.attr("data-product-id");
      
  var varintTitle='', variantId, variantImage, variantPrice, selectedOption;
  if(parent.find('[data-option-index="0"] input:checked').length > 0){
    varintTitle = parent.find('[data-option-index="0"] input:checked').val();
  }
  if(parent.find('[data-option-index="1"] input:checked').length > 0){
    varintTitle = varintTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
  }
  if(parent.find('[data-option-index="2"] input:checked').length > 0){
    varintTitle = varintTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
  }
  selectedOption = parent.find(`[data-product-id="${productId}"][data-var-title="${varintTitle}"]`);
  $(`[data-product-id="${productId}"]`).attr('selected', false);
  selectedOption.attr('selected', true);
  variantPrice = selectedOption.attr('data-v-price');
  variantId = selectedOption.attr('value');
  variantImage = selectedOption.attr('data-v-image');
  variantQuantity =  selectedOption.attr('data-v-inventory');
  variantDataGetArr['productId'] = productId;
  variantDataGetArr['variantId'] = variantId;
  variantDataGetArr['variantImage'] = variantImage;
  variantDataGetArr['variantPrice'] = variantPrice;
  variantDataGetArr['varintTitle'] = varintTitle;
  variantDataGetArr['variantQty'] = variantQuantity;
  parent.find('.looks-product-var-id').val(variantId);
  if (selectedOption.length == 0) {
    parent.find('.pdp-updates-button button').addClass('disabled');
    parent.find(".error-message").text('Product is not available for that specific size!').show();
  } else {
    parent.find('.pdp-updates-button button').removeClass('disabled');
    parent.find(".error-message").text('').hide();
  }
  return variantDataGetArr;
}

theme_custom.tlpclickEvent = function(){

  // custom-look-new-url
  var custom_look_new_url ='',
      custom_look_url = '/pages/customize-your-look';
  $(document).on("click", ".custom-look-new-url", function(){
    if($(`.product-data-card-wrap[data-product-type="jacket"]`).length > 0 || $(`.product-data-card-wrap[data-product-type="pants"]`).length>0 ){
      $(`.product-data-card-wrap`).each(function(){
        var productHandle = $(this).find(".looks-product-handle").val();
        var productVarId = $(this).find(".customizer-look-forget-variant").val();
        if($(`.product-data-card-wrap`).length > 1) {
          if(custom_look_new_url.indexOf("=") > -1) {
            custom_look_new_url += "&"+productHandle+'='+productVarId;
          }else{
            custom_look_new_url += productHandle+'='+productVarId;
          }
        } else {
          custom_look_new_url += productHandle+'='+productVarId;
        }
      })
    }
    localStorage.removeItem("customizerlookUrl");
    localStorage.setItem("customizerlookUrl", custom_look_new_url);
    localStorage.setItem("customizerlookFrom","exiting-looks");
    //alert(custom_look_new_url);
    window.location.href = custom_look_url;
  });

  $(document).on("click",".swatch-element [type='radio']", function(){
    var parent = $(this).closest('.edit-item-popup');
    theme_custom.getVariantDataEditItemPopup(parent);
  })

  $(document).on("click", ".bundle-product-wrapper .remove-item-btn", function(){
    $(this).closest(".product-data-card").remove();
    theme_custom.priceCalculator();
  });

  $(document).on("click", ".edit-item-btn", function(){
    var target = $(this).closest(".product-data-card").find(".edit-item-popup");
    target.find(".error-message").text('').hide();
    var option1 = $(this).closest(".product-data-card").find(".option-1").text(),
        option2 = $(this).closest(".product-data-card").find(".option-2").text(),
        option3 = $(this).closest(".product-data-card").find(".option-3").text();
    if(option1 != '' ){
      target.find(`[data-option-value="${option1}"]`).click();
    }
    if(option2 != '' ){
      target.find(`[data-option-value="${option2}"]`).click();
    }
    if(option3 != '' ){
      target.find(`[data-option-value="${option3}"]`).click();
    }
    $.fancybox.open(target);
  });

  $(document).on("change","#lookImageUpload",function() {
    theme_custom.lookPreviewImage(this);
  });

  $(document).on("click", ".add-event-look", function(){
    $("html,body").css("overflow","hidden");
    $(".page-loader").removeClass("hidden");
    var modalTarget = $(this).closest(".product__info-container").find(".create-event-look");
    theme_custom.getEventData(modalTarget);
  });

  $(document).on("click", ".favorite-event-button", function(){
    console.log("favorutie working");
    $(`[name="look-name"]`).val('');
    $(".page-loader").removeClass("hidden");
    var target = $(".favourite-look-wrapper");
    var productDataCardArr = $(".bundle-product-wrapper .product-data-card"),
        dataObj = {};
    theme_custom.prodArray = [],
    productDataCardArr.each(function(){
      dataObj = {
        "product_id": $(this).find(".looks-product-id").val(),
        "variant_id": $(this).find(".looks-product-var-id").val(),
        "product_handle": $(this).find(".looks-product-handle").val(),
        "product_main_image": $(".looks-product-main-image").val(),
        "type": "looks"
      }
      theme_custom.prodArray.push(dataObj);
      console.log(" theme_custom.prodArray", theme_custom.prodArray);
    });
    setTimeout(() => {
      $(".page-loader").addClass("hidden");
      $.fancybox.open(target);
    }, 1500);
  });

  $(document).on("click", ".favorite-event-api-button", function(e){
    var button = $(this);
    button.find(".loading-overlay").removeClass("hidden");
    button.addClass("disabled");
    button.find('.button-title').text(button.attr("data-text"));
    var productArray = theme_custom.prodArray;
    theme_custom.favoriteButtonEvent(button,productArray);
    
  })

  $(document).on("change",".create-event-look #event-id", function() {
    $(this).next(".form-error").removeClass("active")
  });

  $(document).on("click", ".add-event-look-api-button", function(e){
      var error_count = 0,
          button = $(this); 
      error_count = error_count + theme_custom.textValidationWithSpacialChar($(this).closest(".create-event-look").find('[name="look-name"'));
      if($(this).closest(".create-event-look").find("#event-id").val() == ''){
        $(this).closest(".create-event-look").find("select").next(".form-error").text("Please Select Event Name!").addClass("active");
        error_count = 1;
      }
      if (error_count > 0) {
        e.preventDefault();
        return false;
      } else {
        button.text($(this).data("text"));
        var lookName = $(this).closest(".create-event-look").find("#look-name").val(),
            eventId = $(this).closest(".create-event-look").find("#event-id").val(),
            lookUrl = $("#product-url").val();
            produArray = theme_custom.newArray;
        theme_custom.createLookAPI(lookName,eventId,lookUrl,produArray,button);
      }
  })

  $(document).on("click", ".product-form__submit", function(e){
    e.preventDefault();
    var button = $(this),
    orderType = $(".order-type").val();
    button.addClass("custom-top-look-disable");
    // if(getCookie("fit-finder-data") == ''){
    //   e.preventDefault();
    //   $('.fitfinder-err-msg.form-error').remove();
    //   button.parent().after('<div class="fitfinder-err-msg form-error text-center"><p>Please use the Fit Finder for sizing to continue</p></div>');
    //   $(".fitfinder-err-msg.form-error").show();
    //   button.find(".btn-title").text($(this).find(".btn-title").text());
    //   return false;
    // }else{
    //   button.find(".btn-title").text($(this).find(".btn-title").data("text"));
    // }
    var getProduct = $(".product-form .bundle-product-wrapper").find(".product-data-card");
    var items = [];
    getProduct.each(function(){
      if($(this).find(".looks-product-var-id").val() != ""){
        var varId = $(this).find(".looks-product-var-id").val();
        var item = {}
        if ($(this).attr("data-product-type") == 'jacket') {
          item = {
            "id": varId,
            "quantity": 1,
            "properties": {
              "variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="pants"]`).find(".single-option-selector option:selected").attr("data-var-title"),
              "variant-id":$(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="pants"]`).find(".single-option-selector option:selected").val()
            }
          }
        } else if ($(this).attr("data-product-type") == 'pants') {
          item = {
            "id": varId,
            "quantity": 1,
            "properties": {
              "variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="jacket"]`).find(".single-option-selector option:selected").attr("data-var-title"),
              "variant-id":$(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="jacket"]`).find(".single-option-selector option:selected").val()
            }
          }
        } else {
          item = {
            "id": varId,
            "quantity": 1
          }
        }
        items.push(item);
      }
    });
    data = {
      items: items
    };
    if (orderType == 'virtual' || orderType == 'normal') {
      $.ajax({
        type: "GET",
        url: '/cart.js',
        dataType: 'json',
        success: function(resp) { 
          var nullHash = {};
          for ([key, value] of Object.entries(resp.attributes)) {    
            nullHash[key] = '';
          }
          $.ajax({
            type: "POST",
            url: '/cart/update.js',
            data: {attributes:nullHash},
            dataType: 'json'
          });
        }
      })
      jQuery.ajax({
        type: 'POST',
        url: '/cart/clear.js',
        data: '',
        dataType: 'json',
        success: function() {
          jQuery.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: data,
            dataType: 'json',
            success: function() {
              button.find(".btn-title").text("Added");
              setTimeout(() => {
                button.removeClass("custom-top-look-disable");
                window.location.href = "/cart";
              }, 2500);
            },
            error: function(xhr, status, error) {
              alert(xhr.responseJSON.description);
              button.find(".btn-title").text("Add To Cart");
              button.removeClass("custom-top-look-disable");
            }
          });
        }
      });
    } else {
      jQuery.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: data,
        dataType: 'json',
        success: function() {
          button.find(".btn-title").text("Added");
          setTimeout(() => {
            button.removeClass("custom-top-look-disable");
            window.location.href = "/cart";
          }, 2500);
        },
        error: function(xhr, status, error) {
          alert(xhr.responseJSON.description);
          button.find(".btn-title").text("Add To Cart");
          button.removeClass("custom-top-look-disable");
        }
      });
    }
  });

  $(document).on('change','.suit_attr',function(){
    if($(this).val() != ''){
      $(this).siblings('.error_span').remove();
    }
  });

  $(document).on("click", ".add_suite_btn", function(e){
    e.preventDefault();

    var emptyData = 0;
    $(".error_span").remove();
    $("select.suit_attr").each(function(){
      if( !$(this).val() ){
        $(this).next(".icon").after(`<span class="error_span">This field is required</span>`);
        emptyData++;
      }
    });

    if(emptyData > 0){
      return;
    }

    var button = $(this);
    button.addClass("custom-top-look-disable");

    var getProduct = $(".product-form .bundle-product-wrapper").find(".product-data-card");
    var varId = $(`input[name="id"]`).val();
    var items = [];
    item = {
      "id": varId,
      "quantity": 1,
      "properties": {
        "Chest Size": $(`select[name="properties[Jacket Chest Size]"]`).val(),
        "Jacket Length": $(`select[name="properties[Jacket Length]"]`).val(),
        "Pant Waist Size": $(`select[name="properties[Pant Waist Size]"]`).val(),
        "Pant Length": $(`select[name="properties[Pant Length]"]`).val(),
        "Vest Size": $(`select[name="properties[Jacket Chest Size]"]`).val(),
        "Vest Length": $(`select[name="properties[Jacket Length]"]`).val(),
      }
    }
    items.push(item);
    data = {
      items: items
    };

    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
      dataType: 'json',
      success: function() {
        button.find(".btn-title").text("Added");
        setTimeout(() => {
          button.removeClass("custom-top-look-disable");
          window.location.href = "/cart";
        }, 2500);
      },
      error: function(xhr, status, error) {
        alert(xhr.responseJSON.description);
        button.find(".btn-title").text("Add To Cart");
        button.removeClass("custom-top-look-disable");
      }
    });
    
  });

  $(document).on("click", ".pdp-updates-button button", function(){
    var productHandle = $(this).closest(".edit-item-popup").data("product-handle"),
        productType = $(this).closest(".edit-item-popup").data("product-type"),
        itemParent = $(".product-data-card[data-product-handle='"+productHandle+"']"),
        parent = $(this).closest('.edit-item-popup'),
        varintTitle = '', 
        currentVariantVal, 
        dataHandle = parent.data("product-handle"),
        v_price, v_img,
        variant_info_wrap =  $(".variant-info-wrap[data-product-handle='"+productHandle+"']");
    if(parent.find('[data-option-index="0"] input:checked').length > 0){
      varintTitle = parent.find('[data-option-index="0"] input:checked').val();
    }
    if(parent.find('[data-option-index="1"] input:checked').length > 0){
      varintTitle = varintTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
    }
    if(parent.find('[data-option-index="2"] input:checked').length > 0){
      varintTitle = varintTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
    }
    var productVariantTitle = [];
    var selectOptionVar = $(this).closest(".edit-item-popup").find('.single-option-selector option');
    selectOptionVar.each(function(){
      productVariantTitle.push($(this).attr("data-var-title"));    
    });
    if($.inArray(varintTitle,productVariantTitle) == -1){
      $(this).find(".loading-overlay").addClass("hidden");
      $(this).closest(".edit-item-popup").find(".error-message").text('').hide();
      $(this).closest(".edit-item-popup").find(".error-message").text(theme_custom.productNotFoundError).show();
    } else {
    
      currentVariantVal = parent.find('.single-option-selector option[data-title="'+varintTitle+'"]').attr('value');
      v_price = parent.find('.single-option-selector option[data-title="'+varintTitle+'"]').data('v-price');
      v_img = parent.find('.single-option-selector option[data-title="'+varintTitle+'"]').data('v-image');

      if(parent.find('[data-option-index="0"] input:checked').length > 0){
        itemParent.find(".variant-title .option-1").text(parent.find('[data-option-index="0"] input:checked').val());
        variant_info_wrap.find(".option-title .option-1").text(parent.find('[data-option-index="0"] input:checked').val());
      }
      if(parent.find('[data-option-index="1"] input:checked').length > 0){
        itemParent.find(".variant-title .option-2").text(parent.find('[data-option-index="1"] input:checked').val());
        variant_info_wrap.find(".option-title .option-2").text(parent.find('[data-option-index="1"] input:checked').val());
      }
      if(parent.find('[data-option-index="2"] input:checked').length > 0){
        itemParent.find(".variant-title .option-3").text(parent.find('[data-option-index="2"] input:checked').val());
        variant_info_wrap.find(".option-title .option-3").text(parent.find('[data-option-index="2"] input:checked').val());
      }
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".looks-product-var-id").val(currentVariantVal);        
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-price .money').text(theme_custom.Shopify.formatMoney(v_price, theme_custom.money_format));
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-image img').attr("src",v_img).attr("srcset",v_img);
      if(productType == 'jacket' || productType == 'pants'){
        $(`.variant-info-wrap[data-product-type='${productType}']`).find('.error-message').text('').hide();
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.error-message').text('').hide();
        $(`.variant-info-wrap[data-product-type='${productType}']`).find(".edit-size-title").addClass("hidden");
        $(`.variant-info-wrap[data-product-type='${productType}']`).find(".product-variant-value").removeClass("hidden");
        $(`.variant-info-wrap[data-product-type='${productType}']`).find(".edit-item-button").text("Edit Item");
        parent.find(".edit-size-title").addClass("hidden");
      } else {
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.error-message').text('').hide();
      }
      if(productType == 'vest' || productType == 'shoes' || productType == 'shirt'){
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".variant-title").removeClass("hidden");
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".edit-item-btn").text("Edit Item");
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".cta-button-wrap").css('margin-top','0');
      }
      parent.find(".error-message").text('').hide();
      if($(".error-message").text() == '' && getCookie("fit-finder-data") != ''){
        $(".product-form__submit").removeClass("custom-top-look-disable");
      } else {
        $(".product-form__submit").addClass("custom-top-look-disable");
      }
      parent.find(".fancybox-close-small").click();
      parent.find(".pdp-updates-button").find(".button").addClass("disabled");
    }
  })

  $(document).on("click",".edit-item-popup .fancybox-button",function(){
    $(this).closest(".edit-item-popup").find(".error-message").text('').hide();
  })

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

$(document).ready(function(){
  theme_custom.tlpclickEvent(); 
  if(localStorage.getItem("customerToken")){
    theme_custom.getFitFinder();
    $(".sizing-and-fit-wrapper .empty-fit-fider-wrapper").addClass("hidden");
  } else {
    $(".product-form__submit").addClass("custom-top-look-disable")
    theme_custom.getFitFinderCookie();
    $(".sizing-and-fit-wrapper .empty-fit-fider-wrapper").removeClass("hidden");
  }
  var productImageUrl = $(".product-first-image").val();
  theme_custom.toDataURL(productImageUrl, function(dataUrl) {
    theme_custom.image_url = dataUrl;
    theme_custom.ImageURL = theme_custom.dataURLtoFile(theme_custom.image_url,'custom-look.png');
  })
  $(document).on("click",".top-look-fit-finder",function(){
    localStorage.setItem("previous-page-link", "true");
    localStorage.setItem("page-link",$(this).data("product-url"));
    window.location.href ='/pages/fit-finder';
  });

  $(document).on("click",".product-block-wrap-suit-wrapper .edit-item-button",function(){
    var productTarget = $(this).closest(".variant-info-wrap").data('product-type');
    $(`.product-data-card-wrap[data-product-type="${productTarget}"]`).find('.cta-button-wrap .edit-item-btn').click();
  });

  theme_custom.priceCalculator();
});