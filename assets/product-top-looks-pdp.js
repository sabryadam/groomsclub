theme_custom.favLooks = [];

theme_custom.priceCalculator = function(){
  if($(".product-data-card").length>0){
    var subTotal = 00;
    $(".product-data-card.product-block-item").each(function(){
      var productSelectedVar = $(this).find(".product-variant-id").val(),
          productPrice = parseInt($(this).find(`.product-variant-option option[value="${productSelectedVar}"]`).attr("data-variant-price"));
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
    url: `${theme_custom.api_base_url}/api/customer/events`,
    method: "POST",
    data: data,
    dataType: "json",
    headers: {
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
          if($(this).find(".product-variant-id").val() != ''){
            dataObj = {
              "product_id": $(this).find(".looks-product-id").val(),
              "variant_id": $(this).find(".product-variant-option").find(`option:selected`).val(),
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
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.assign-member-look-popup-wrapper .api_error').show().html(xhr.responseJSON.message);
        setTimeout(() => {
          $('.assign-member-look-popup-wrapper .api_error').hide();
          window.location.href = '/account/logout';
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
                $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="jacket"]`).find('.edit-item-button').attr("data-button-label","edit-item"); 
                $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="vest"]`).find('.edit-item-button').attr("data-button-label","edit-item");
            }
            if(result.data[i].pants_waist && result.data[i].pants_hight && (getProductType == 'suit' || getProductType == 'looks')){
              fitFinderDataHTML+= `<div class="filed-wrapper">
                                    <p class="field__label title">Pants Size :</p>
                                    <p class="value">${result.data[i].pants_waist}W ${result.data[i].pants_hight}H</p>
                                  </div>`;
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="pants"]`).find('.edit-item-button').attr("data-button-label","edit-item");
            }
            if(result.data[i].shirt_neck && result.data[i].shirt_sleeve && getProductType == 'looks'){
              fitFinderDataHTML+= `<div class="filed-wrapper">
                                    <p class="field__label title">Shirt Size:</p>
                                    <p class="value">Neck ${result.data[i].shirt_neck}, Sleeve ${result.data[i].shirt_sleeve}</p>
                                  </div>`;
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="shirt"]`).find('.edit-item-button').attr("data-button-label","edit-item");
            }
            if(result.data[i].shoe_size && getProductType == 'looks'){
              fitFinderDataHTML+= `<div class="filed-wrapper">
                                    <p class="field__label title">Shoe Size:</p>
                                    <p class="value">${result.data[i].shoe_size}</p>
                                  </div>`;
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="shoes"]`).find('.edit-item-button').attr("data-button-label","edit-item");
            }
          }
          $(".fit-finder-main-wrapper").remove();
          $(".sizing-and-fit-wrapper").html(fitFinderDataHTML);
          $(".empty-fit-fider-wrapper").addClass("hidden");
          $(".favorite-event-cart-wrapper .add-to-event .add-event-look").removeClass("disabled");
          $(".variant-info-wrap").find(".edit-size-title").addClass("hidden");
          $(".variant-info-wrap").find(".product-variant-value").removeClass("hidden");
          $(".variant-info-wrap").find(".edit-item-button").text("Edit Item");
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
          theme_custom.removeLocalStorage();
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
      $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="jacket"]`).find('.edit-item-button').attr("data-button-label","edit-item"); 
      $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="vest"]`).find('.edit-item-button').attr("data-button-label","edit-item");
    }
    if(getFitFinderData.pants_waist && getFitFinderData.pants_hight){
      fitFinderDataHTML+= `<div class="filed-wrapper">
                            <p class="field__label title">Pants Size :</p>
                            <p class="value">${getFitFinderData.pants_waist}W ${getFitFinderData.pants_hight}H</p>
                          </div>`;
      $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="pants"]`).find('.edit-item-button').attr("data-button-label","edit-item");
    }
    if(getFitFinderData.shirt_neck && getFitFinderData.shirt_sleeve){
      fitFinderDataHTML+= `<div class="filed-wrapper">
                            <p class="field__label title">Shirt Size:</p>
                            <p class="value">Neck ${getFitFinderData.shirt_neck}, Sleeve ${getFitFinderData.shirt_sleeve}</p>
                          </div>`;
      $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="shirt"]`).find('.edit-item-button').attr("data-button-label","edit-item");
      
    }
    if(getFitFinderData.shoe_size){
      fitFinderDataHTML+= `<div class="filed-wrapper">
                            <p class="field__label title">Shoe Size:</p>
                            <p class="value">${getFitFinderData.shoe_size}</p>
                          </div>`;
      $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="shoes"]`).find('.edit-item-button').attr("data-button-label","edit-item");
    }
    $(".fit-finder-main-wrapper").remove();
    $(".sizing-and-fit-wrapper").html(fitFinderDataHTML);
    $(".empty-fit-fider-wrapper").addClass("hidden");
    $(".favorite-event-cart-wrapper .add-to-event .add-event-look").removeClass("disabled");
    $(".variant-info-wrap").find(".edit-size-title").addClass("hidden");
    $(".variant-info-wrap").find(".product-variant-value").removeClass("hidden");
    if($(`.template-product-jacket-pant-separate-product`).length > 0) {
      $(".variant-info-wrap").find(".edit-item-button").text("Edit Item");
    } else {
      $(".variant-info-wrap").find(".edit-item-button").text("- Edit Item");
    }    
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
    url: `${theme_custom.api_base_url}/api/look/picture/${lookID}`,
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
        localStorage.setItem("set-event-id",getEventId);
        localStorage.setItem("go-to-event-page","true")
        window.location.href = `/pages/create-event`;
      },5000);
    },
    error: function(xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.update-profile-image-popup-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
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
  if (!fileVal.type.match(imageType)){
    return;
  } else {
    form_data.append('lookImage',fileVal);
  }
  $.ajax({
    url: `${theme_custom.api_base_url}/api/look/picture/${lookID}`,
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
        window.location.href = `/account?tab=favorite-look`
      },3000);
    },
    error: function(xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $(".look-api-message").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
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

  // $(document).on("change",".swatch-element [type='radio']", function(){
  //   var parentElement = $(this).closest('.edit-item-popup');
  //   theme_custom.editItemPopup(parentElement);
  // })

  $(document).on("click", ".bundle-product-wrapper .remove-item-btn", function(){
    $(this).closest(".product-data-card").remove();
    theme_custom.priceCalculator();
  });

  $(document).on("click", ".edit-item-btn", function(){
    var target = $(this).closest(".product-data-card").find(".edit-item-popup");
    var option1 = $(this).closest(".product-data-card").find(".option-1").text().toLocaleLowerCase(),
        option2 = $(this).closest(".product-data-card").find(".option-2").text().toLocaleLowerCase(),
        option3 = $(this).closest(".product-data-card").find(".option-3").text().toLocaleLowerCase();
    if(option1 != '' ){
      target.find(`[data-option-index="0"]`).find(`[type="radio"][data-value="${option1}"]`).prop("checked", true);
    }
    if(option2 != '' ){
      target.find(`[data-option-index="1"]`).find(`[type="radio"][data-value="${option2}"]`).prop("checked", true);
    }
    if(option3 != '' ){
      target.find(`[data-option-index="2"]`).find(`[type="radio"][data-value="${option3}"]`).prop("checked", true);
    }
    $.fancybox.open(target);
  });

  $(document).on("change","#lookImageUpload",function() {
    theme_custom.lookPreviewImage(this);
  });

  $(document).on("click", ".add-event-look", function(){
    if($(this).hasClass(`show-popup-for-upcoming-suit`)) {
      if($(`.customizer-page-sliver-suit-coming-soon-msg`).hasClass("active")){
        $(`.customizer-page-sliver-suit-coming-soon-msg`).removeClass("active");
      } else {
        $(`.customizer-page-sliver-suit-coming-soon-msg`).addClass("active");
      }
    } else {
    $("html,body").css("overflow","hidden");
    $(".page-loader").removeClass("hidden");
    var modalTarget = $(this).closest(".product__info-container").find(".create-event-look");
    theme_custom.getEventData(modalTarget);
    }
  });

  $(document).on("click", ".favorite-event-button", function(){
    $(`[name="look-name"]`).val('');
    $(".page-loader").removeClass("hidden");
    var target = $(".favourite-look-wrapper");
    var productDataCardArr = $(".bundle-product-wrapper .product-data-card"),
        dataObj = {
          "product_id": $(`.product-data-card-wrap[data-product-type="looks"]`).find(".looks-product-id").val(),
          "variant_id": $(`.product-data-card-wrap[data-product-type="looks"]`).find(".product-variant-id").val(),
          "product_handle": $(`.product-data-card-wrap[data-product-type="looks"]`).find(".looks-product-handle").val(),
          "product_main_image": $(`.product-data-card-wrap[data-product-type="looks"]`).find(".looks-product-main-image").val(),
          "type": "looks"
        };
    theme_custom.prodArray = [];
    theme_custom.prodArray.push(dataObj);
    productDataCardArr.each(function(){
      dataObj = {
        "product_id": $(this).find(".looks-product-id").val(),
        "variant_id": $(this).find(".product-variant-option").find(`option:selected`).val(),
        "product_handle": $(this).find(".looks-product-handle").val(),
        "product_main_image": $(".looks-product-main-image").val(),
        "type": "looks"
      }
      theme_custom.prodArray.push(dataObj);
    });
    theme_custom.customizeURLData  = '';
    theme_custom.customizeURLData += $(`.product-data-card-wrap[data-product-type="looks"]`).find(".looks-product-handle").val() + '=' + $(`.product-data-card-wrap[data-product-type="looks"]`).find(".product-variant-id").val() + '&';
    $.each(productDataCardArr, function(index, value) {
      var customizeURL = ''
      var isLastElement = index == productDataCardArr.length -1;
      if (isLastElement) {
        customizeURL = $(this).find(".looks-product-handle").val() + '=' + $(this).find(".product-variant-option").find(`option:selected`).val()
      } else {
        customizeURL = $(this).find(".looks-product-handle").val() + '=' + $(this).find(".product-variant-option").find(`option:selected`).val() + '&';
      }
      theme_custom.customizeURLData += customizeURL;
    });
    theme_custom.getFavoriteLooks(function(looks){
      theme_custom.favLooks = looks;
      $(".page-loader").addClass("hidden");
      $.fancybox.open(target);
    })
  });


  $(document).on("click", ".product-form__submit", function(e){
    e.preventDefault();
    if($(`.product-block-wrap-suit-wrapper [data-button-label="select-size"]`).length > 0 ){
      $('.error-message').show();
      let errors = $(".product-form__buttons.display-login .error-message:visible");
      let firstError;
      for(let i=0;i<errors.length;i++){
        let item = errors[i];
        if(!$(item).is(':empty')){
          firstError = item;
          break;
        }
      }
      if(firstError){
        let parent = $(firstError).closest('.product-block-item');
        $('html, body').stop().animate({
          'scrollTop': $(parent).offset().top - $("#shopify-section-header").height() - 20
        }, "slow");
      }
      return false;
    }
    if($(".product-block-wrap-suit-wrapper .error-message.error-show").length > 0) {
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
    var button = $(this),
    orderType = $(".order-type").val();
    button.addClass("custom-top-look-disable").addClass("disabled");
    theme_custom.openUpsellPopup = false;
    if(button.hasClass("up-sell-popup")){
      theme_custom.openUpsellPopup = true;
    }
    var getProduct = $(".product-form .bundle-product-wrapper").find(".product-data-card.product-block-item");
    var items = [];
    getProduct.each(function(){
      if($(this).find(".product-variant-id").val() != ""){
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
        var varId = $(this).find(`.product-variant-option option[data-variant-title="${currentVar}"]`).val();
        var item = {}
        if($(this).attr("data-product-type") == 'jacket' || $(this).attr("data-product-type") == 'pants' || $(this).attr("data-product-type") == 'vest'){
          // vest Variant Title
          var vestVariantTitle = ''; 
          if($(`.product-data-card[data-product-type="vest"]`).find(".option-1").length > 0){
            vestVariantTitle = $(`.product-data-card[data-product-type="vest"]`).find(".option-1").text();
          }
          if($(`.product-data-card[data-product-type="vest"]`).find(".option-2").length > 0){
            vestVariantTitle = vestVariantTitle + ' / ' + $(`.product-data-card[data-product-type="vest"]`).find(".option-2").text();
          }
          if($(`.product-data-card[data-product-type="vest"]`).find(".option-3").length > 0){
            vestVariantTitle = vestVariantTitle + ' / ' + $(`.product-data-card[data-product-type="vest"]`).find(".option-3").text();
          }

          // pents Variant Title
          var pantsVariantTitle = ''; 
          if($(`.product-data-card[data-product-type="pants"]`).find(".option-1").length > 0){
            pantsVariantTitle = $(`.product-data-card[data-product-type="pants"]`).find(".option-1").text();
          }
          if($(`.product-data-card[data-product-type="pants"]`).find(".option-2").length > 0){
            pantsVariantTitle = pantsVariantTitle + ' / ' + $(`.product-data-card[data-product-type="pants"]`).find(".option-2").text();
          }
          if($(`.product-data-card[data-product-type="pants"]`).find(".option-3").length > 0){
            pantsVariantTitle = pantsVariantTitle + ' / ' + $(`.product-data-card[data-product-type="pants"]`).find(".option-3").text();
          }
        }
        if ($(this).attr("data-product-type") == 'jacket') {
          item = {
            "id": varId,
            "quantity": 1,
            "properties": {
              "combo-variant-title" : $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="jacket"]`).find(".product-variant-option option:selected").attr("data-variant-title"),
              // "vest-variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="vest"]`).find(`.product-variant-option option[data-variant-title="${vestVariantTitle}"]`).attr("data-variant-title"),
              "pant-variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="pants"]`).find(`.product-variant-option option[data-variant-title="${pantsVariantTitle}"]`).attr("data-variant-title")
            }
          }
        } else if ($(this).attr("data-product-type") == 'pants') {
          item = {
            "id": varId,
            "quantity": 1,
            "properties": {
              "combo-variant-title" : $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="jacket"]`).find(".product-variant-option option:selected").attr("data-variant-title"),
              // "vest-variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="vest"]`).find(`.product-variant-option option[data-variant-title="${vestVariantTitle}"]`).attr("data-variant-title"),
              "pant-variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="pants"]`).find(`.product-variant-option option[data-variant-title="${pantsVariantTitle}"]`).attr("data-variant-title")
            }
          }
        } 
        // else if ($(this).attr("data-product-type") == 'vest') {
        //   item = {
        //     "id": varId,
        //     "quantity": 1,
        //     "properties": {
        //       "combo-variant-title" : $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="jacket"]`).find(".product-variant-option option:selected").attr("data-variant-title"),
        //       "vest-variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="vest"]`).find(`.product-variant-option option[data-variant-title="${vestVariantTitle}"]`).attr("data-variant-title"),
        //       "pant-variant-title": $(".product-form .bundle-product-wrapper").find(`.product-data-card[data-product-type="pants"]`).find(`.product-variant-option option[data-variant-title="${pantsVariantTitle}"]`).attr("data-variant-title")
        //     }
        //   }
        // } 
        else {
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
              button.find(".btn-title").text("Added to Cart");
              setTimeout(() => {
                if(theme_custom.openUpsellPopup){
                  $("html, body").css({
                    "overflow" : "hidden"
                  });
                  $(".product-upsell-wrapper").addClass("show")
                } else {
                  window.location.href = "/cart";
                }
              }, 1500);
            },
            error: function(xhr, status, error) {
              alert(xhr.responseJSON.description);
              button.find(".btn-title").text("Add To Cart");
              button.removeClass("custom-top-look-disable").removeClass("disabled");
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
          button.find(".btn-title").text("Added to Cart");
          setTimeout(() => {
            if(theme_custom.openUpsellPopup){
              $("html, body").css({
                "overflow" : "hidden"
              });
              $(".product-upsell-wrapper").addClass("show")
            } else {
              window.location.href = "/cart";
            }
          }, 1500);
        },
        error: function(xhr, status, error) {
          alert(xhr.responseJSON.description);
          button.find(".btn-title").text("Add To Cart");
          button.removeClass("custom-top-look-disable").removeClass("disabled");
        }
      });
    }
  });

  $(document).on('change','.suit_attr',function(){
    if($(this).val() != ''){
      $(this).siblings('.error_span').remove();
    }
  });

  $(document).on("click",".product-upsell-wrapper .close-icon",function(){
    $(".product-upsell-wrapper").removeClass("show");
    $("html, body").css({
      "overflow" : ""
    });
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
        button.find(".btn-title").text("Added to Cart");
        setTimeout(() => {
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

  $(document).on("click", ".pdp-updates-button", function(){
    var productHandle = $(this).closest(".edit-item-popup").data("product-handle"),
        productType = $(this).closest(".edit-item-popup").data("product-type"),
        itemParent = $(".product-data-card[data-product-handle='"+productHandle+"']"),
        productParent = $(this).closest('.edit-item-popup'),
        variantTitle = '', 
        currentVariantVal, 
        dataHandle = productParent.data("product-handle"),
        v_price, v_img,
        variant_info_wrap =  $(`.variant-info-wrap[data-product-handle="${productHandle}"]`);
    if(productParent.find('[data-option-index="0"] input:checked').length > 0){
      variantTitle = productParent.find('[data-option-index="0"] input:checked').val();
    }
    if(productParent.find('[data-option-index="1"] input:checked').length > 0){
      variantTitle = variantTitle + ' / ' + productParent.find('[data-option-index="1"] input:checked').val();
    }
    if(productParent.find('[data-option-index="2"] input:checked').length > 0){
      variantTitle = variantTitle + ' / ' + productParent.find('[data-option-index="2"] input:checked').val();
    }
    var selectedOption = productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`),
        variantId = selectedOption.attr('value'),
        variantInventoryPolicy = selectedOption.attr('data-variant-inventory-policy'),
        variantInventoryQuantity = selectedOption.attr('data-variant-inventory-quantity'),
        variantEstimateDate = selectedOption.attr('data-variant-estimate-date');
    if(!variantId){
      $(this).find(".loading-overlay").addClass("hidden");
      $(this).closest(".edit-item-popup").find(".error-message").addClass("error-show").text(teme_custom.product_unavailable); 
      $(this).closest(".edit-item-popup").find(`.pdp-updates-button`).addClass("disabled");
    } else {
      productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop("selected",true);
      currentVariantVal = productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('value');
      v_price = productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('data-variant-price');
      v_img = productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('data-variant-image');
      if(productParent.find('[data-option-index="0"] input:checked').length > 0){
        itemParent.find(".variant-title .option-1").text(productParent.find('[data-option-index="0"] input:checked').val());
        variant_info_wrap.find(".option-title .option-1").text(productParent.find('[data-option-index="0"] input:checked').val());        
      }
      if(productParent.find('[data-option-index="1"] input:checked').length > 0){
        itemParent.find(".variant-title .option-2").text(productParent.find('[data-option-index="1"] input:checked').val());
        variant_info_wrap.find(".option-title .option-2").text(productParent.find('[data-option-index="1"] input:checked').val());        
      }
      if(productParent.find('[data-option-index="2"] input:checked').length > 0){
        itemParent.find(".variant-title .option-3").text(productParent.find('[data-option-index="2"] input:checked').val());
        variant_info_wrap.find(".option-title .option-3").text(productParent.find('[data-option-index="2"] input:checked').val());
      }
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".product-variant-id").val(currentVariantVal);        
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-price .money').text(theme_custom.Shopify.formatMoney(v_price, theme_custom.money_format));
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-image img').attr("src",v_img).attr("srcset",v_img);
      if(productType == 'jacket' || productType == 'pants'){
        $(`.variant-info-wrap[data-product-type='${productType}']`).find('.error-message').text('').hide();
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.error-message').text('').hide();
        $(`.variant-info-wrap[data-product-type='${productType}']`).find(".edit-size-title").addClass("hidden");
        $(`.variant-info-wrap[data-product-type='${productType}']`).find(".product-variant-value").removeClass("hidden");
        if($(`.template-product-jacket-pant-separate-product`).length > 0) {
          $(`.variant-info-wrap[data-product-type='${productType}']`).find(".edit-item-button").text("Edit Item").removeClass("slide-up");
        } else {
          $(`.variant-info-wrap[data-product-type='${productType}']`).find(".edit-item-button").text(" - Edit Item").removeClass("slide-up");
        }
        $(`.variant-info-wrap[data-product-type='${productType}']`).find(".error-message").removeClass("error-show").text('').removeClass("product-not-found");
        $(`.edit-item-popup[data-product-handle='${dataHandle}']`).find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop("selected",true);
        if(productType == 'jacket'){
          var variantTitle = productParent.find('[data-option-index="0"] input:checked').val() + ' / ' + productParent.find('[data-option-index="1"] input:checked').val() + ' / ' + productParent.find('[data-option-index="2"] input:checked').val();
          $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="jacket"]`).find('.edit-item-button').attr("data-button-label","edit-item"); 
          if($(`.variant-title[data-product-type="vest"]`).hasClass('vest-not-selected')){
            $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="vest"]`).find('.edit-item-button').attr("data-button-label","edit-item").text(" - Edit Item");
            $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="vest"]`).find('.product-variant-value').removeClass("hidden");
            $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="vest"]`).find('.edit-size-title').hide();
            $(`.edit-item-popup[data-product-type="vest"]`).find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop("selected",true);
            $(`.edit-item-popup[data-product-type="vest"]`).find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop("selected",true);
          }
          if(theme_custom.current_date < variantEstimateDate ) {
            if(variantInventoryQuantity <= 0 && variantInventoryPolicy == 'continue') {
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="jacket"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
            } else {
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="jacket"]`).find(".estimated-variant-error-block-wrap").removeClass("active");
            }
          }
        }
        if(productType == 'pants'){
          $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="pants"]`).find('.edit-item-button').attr("data-button-label","edit-item");
          if(theme_custom.current_date < variantEstimateDate ) {
            if(variantInventoryQuantity <= 0 && variantInventoryPolicy == 'continue') {
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="pants"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
            } else {
              $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="pants"]`).find(".estimated-variant-error-block-wrap").removeClass("active");
            }
          }
        }
        productParent.find(".edit-size-title").addClass("hidden");
      } else if(productType == 'vest' || productType == 'shoes' || productType == 'shirt'){
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".variant-title").removeClass("hidden");
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".edit-item-btn").text("Edit Item").attr("data-button-label","edit-item").removeClass("slide-up");
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".error-message").removeClass("error-show").text('').removeClass("product-not-found");
        var variantTitle = productParent.find('[data-option-index="0"] input:checked').val() + ' / ' + productParent.find('[data-option-index="1"] input:checked').val() + ' / ' + productParent.find('[data-option-index="2"] input:checked').val();
        $(`.edit-item-popup[data-product-handle='${dataHandle}']`).find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop("selected",true);
        if(productType == 'vest'){
          $(`.variant-title[data-product-type="vest"]`).find(".error-message").removeClass("error-show").text('');
        }
        if(theme_custom.current_date < variantEstimateDate ) {
          if(variantInventoryQuantity <= 0 && variantInventoryPolicy == 'continue') {
            $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
          } else {
            $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".estimated-variant-error-block-wrap").removeClass("active");
          }
        }
      } else {
        $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.error-message').removeClass("error-show").text('').hide().removeClass("product-not-found");
        if(theme_custom.current_date < variantEstimateDate ) {
          if(variantInventoryQuantity <= 0 && variantInventoryPolicy == 'continue') {
            $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
          } else {
            $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".estimated-variant-error-block-wrap").removeClass("active");
          }
        }
      }
      if($(".error-message.error-show").length > 0  && getCookie("fit-finder-data") != ''){
        $(".product-form__submit").removeClass("custom-top-look-disable");
      } else {
        $(".product-form__submit").addClass("custom-top-look-disable");
      }
      productParent.find(".fancybox-close-small").click();
      productParent.find(".pdp-updates-button").find(".button").addClass("disabled");
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.add-optional-item-button').addClass("hidden");
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".remove-optional-item-wrapper").removeClass("hidden")
      $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.variant-title').removeClass("hidden").show();
      $(`.product-data-card[data-product-handle='${dataHandle}']`).addClass("product-block-item");
      setTimeout(() => {
        theme_custom.priceCalculator();
      }, 500);
    }
  })

  $(document).on("click",".edit-item-popup .fancybox-button",function(){
    $(this).closest(".edit-item-popup").find(".error-message").removeClass("error-show").text('');
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
  xhr.open('GET', url, true);
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
  $(document).on("click",".add-optional-item-button",function(){
    if($(this).closest(`.product-data-card`).find(".edit-item-popup .pdp-updates-button .button-label").text() == 'Update'){
      $(this).closest(`.product-data-card`).find(".edit-item-popup .pdp-updates-button").removeClass("disabled")
    }
    $(this).closest(`.product-data-card`).find(".edit-item-btn").click();
  });
  $(document).on("click",".remove-optional-item-button",function(){
    $(this).closest(".remove-optional-item-wrapper").addClass("hidden");
    $(this).closest(`.product-data-card`).removeClass("product-block-item");
    $(this).closest(`.product-data-card`).find('.variant-title').addClass("hidden")
    $(this).closest(`.product-data-card`).find(".add-optional-item-button").removeClass("hidden")
    theme_custom.priceCalculator();
  });
  theme_custom.priceCalculator();
});