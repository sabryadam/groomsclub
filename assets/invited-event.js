theme_custom.goToCheckout = function(discount){
  if(discount){
    window.location.href = `/checkout?discount=${discount}`
  }else{
    window.location.href = '/checkout'
  }
}

// theme_custom.multipleProductAjax
theme_custom.multipleProductAjax = function(button, parent, payBy){
  var getProduct = parent.find(".product-card-wrap"),
      event_id = $("#weddingevent_id").val(),
      member_id = theme_custom.memberId,
      look_id = $("#look_id").val(),
      items = [],
      attributes= {},
      payByValue = payBy;
  getProduct.each(function(){
    var varId = $(this).find(".prod-variant-data").attr("data-var-id");
    var item = {},
        productType = $(this).attr("data-product-type").toLowerCase();
    if (productType == 'jacket') {
      var pantsSelectedVariant = $(`.product-card-wrap[data-product-type="pants"]`).find(".prod-variant-data").attr("data-var-id"),
          pantsVarTitle = $(`.product-card-wrap[data-product-type="pants"]`).find(`.prod-variant-option [value="${pantsSelectedVariant}"]`).attr("data-variant-title");
      item = {
        "id": varId,
        "quantity": 1,
        "properties": {
          "variant-title": pantsVarTitle,
          "variant-id": pantsSelectedVariant
        }
      }
    } else if (productType == 'pants') {
      var jacketSelectedVariant = $(`.product-card-wrap[data-product-type="jacket"]`).find(".prod-variant-data").attr("data-var-id"),
          jacketVarTitle = $(`.product-card-wrap[data-product-type="jacket"]`).find(`.prod-variant-option [value="${jacketSelectedVariant}"]`).attr("data-variant-title");
      item = {
        "id": varId,
        "quantity": 1,
        "properties": {
          "variant-title": jacketVarTitle,
          "variant-id":jacketSelectedVariant
        }
      }
    } else {
      item = {
        "id": varId,
        "quantity": 1
      }
    }
    items.push(item);
  });
  if(payByValue == 'host'){
    attributes = {
      'event_id': event_id,
      'member_id' : member_id,
      'look_id' : look_id,
      'order_type' : 'virtual'
    }
  } else {
    attributes =  {
      'event_id': event_id,
      'member_id' : member_id,
      'look_id' : look_id,
      'order_type' : 'normal'
    }  
  }
  data = {
    items: items,
    'attributes': attributes
  }
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
          if(payByValue == 'self'){
            $('.account-event-step[data-event-step="purchased"]').addClass("active");   
            setTimeout(() => {
              button.find(".btn-title").text("Added To Cart");
              window.location.href = "/cart";
            }, 2500);
          }
          if(payByValue == 'host'){
            theme_custom.goToCheckout(theme_custom.discount_code);
          }
        },
        error: function(xhr, status, error) {
          button.find(".btn-title").text("Add To Cart");
          alert(xhr.responseJSON.description);
        }
      });
    }
  });
}

// theme_custom.draftOrderFunction API  
theme_custom.draftOrderFunction = function(data){
  $.ajax({
    url: `${theme_custom.api_base_url}/api/order/draft/create`,
    method: "POST",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: 'application/json; charset=utf-8',
    headers: {
      "Authorization": 'Bearer '+localStorage.getItem("customerToken")
    },
    beforeSend: function() {
    }, 
    success: function(result){
      window.location.href = result.data.invoice_url
    },
    error:function(xhr,status,error){
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.my-size-block-main').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.my-size-block-main').html(xhr.responseJSON.message);
      }
    }
  })
};

// theme_custom.draftOrder
theme_custom.draftOrder = function(button,parent){
  var getProduct = parent.find(".product-card-wrap"),
      event_id = $("#weddingevent_id").val(),
      member_id = theme_custom.memberId,
      look_id = $("#look_id").val(),
      customer_id = $("#customer_id").val(),
      items = [];
  getProduct.each(function(){
    var product_var_id = $(this).find(".prod-variant-data").attr("data-var-id");
    var item = {
      "variant_id": product_var_id,
      "quantity": 1
    }
    items.push(item);
  });
  var data = {
    "use_customer_default_address": true,
    "applied_discount": {
      "value_type": "percentage",
      "value": "100.0"
    },
    "note_attributes": [
      {
        "name": "event_id",
        "value": event_id
      },
      {
        "name": "member_id",
        "value": member_id
      },
      {
        "name": "look_id",
        "value": look_id
      },
      {
        "name": "order_type",
        "value": "virtual"
      }
    ],
    "is_cod": false,
    "customer_id": customer_id,
    "tags": "",
    "line_items" : items
  }
  theme_custom.draftOrderFunction(data);
}

// Product Data
theme_custom.ProductData = function(productItemsArr){
  var productHtml = productSizeTypeExchangeData = pantProductHTML = productSubTotalPrice = "",
      subTotal = 0;
  var productItemsArrayLooks = productItemsArr;
  var product_ids = '';
  $.map(productItemsArr, function(productItems,index) {
    if(index==0){
      product_ids = `id:${productItems.product_id}`
    } else {
      product_ids += ` OR id:${productItems.product_id}`
    }
    // product_ids.push(productItems.product_id)
  });
  $.ajax({
    // url: `${theme_custom.base_url}/api/shopify/products`,
    url : `/search/?view=getData&q=${product_ids}`,
    dataType: "json",
    headers: {
      // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {},
    success: function (result) {
      debugger;
      var productsArray = result.products;
      $.map(productItemsArrayLooks, function(productItemInfo,index) {
        var product = productsArray.find((item)=>item.id==parseInt(productItemInfo.product_id));
        var selectedVar = product.variants.find((variant)=>variant.id==parseInt(productItemInfo.variant_id));
        productItemsArrayLooks[index]["selectedVar"] = selectedVar;
        productItemsArrayLooks[index]["product"] = product;
      });
      
      $.map(productItemsArrayLooks, function(productItem,index) {
        let product = productItem.product; 
        let variant = productItem.selectedVar;
        if(product.options){
          var productOption = product.options;
          var customSwatchWap = '';
          for (let optionVal = 0; optionVal < productOption.length; optionVal++) {
            var element = productOption[optionVal];
            var customSwatch = '';
            var elementValues = element.values;
            for (let seatchVal = 0; seatchVal < elementValues.length; seatchVal++) {
              var swatchValue = elementValues[seatchVal];
              if(productOption[optionVal].name == 'Color' || productOption[optionVal].name == 'color'){
                var color_name = swatchValue.toLowerCase().replace(" ","-");
                customSwatch += `<div data-title="${swatchValue}" data-value="${swatchValue}" class="swatch-element-item ${swatchValue} active">
                                  <label style="background-image:url(//cdn.shopify.com/s/files/1/0585/3223/3402/files/color_${color_name}.png?v=13538939889425418844)" for="swatch-2-tuxedo-black"></label>
                                </div>`;
              } else {
                customSwatch += `<div data-title="${swatchValue}" data-value="${swatchValue}" class="swatch-element-item ${swatchValue}">
                                  <span>
                                    ${swatchValue}
                                  </span>
                                </div>`;
              }
            }
            customSwatchWap += `<div class="swatches text-center ${productOption[optionVal].name}">
                                  <p class="swatch-title">${productOption[optionVal].name} :</p>
                                  <div class="swatch" data-option-swatch-index="${optionVal}">
                                    ${customSwatch}
                                  </div>
                                </div>`;
          }
        }
        var prodOptionArray = [];
        var pantsProd_hide = "";
        if (variant) {
          $.each(product.variants, function (key, value) {
            if(!value.title == ''){
              if(key == 0){
                prodOptionArray += `<option value="${value.id}" data-variant-inventory="${value.inventory_quantity}" data-product-id="${product.id}" data-variant-title="${value.title}" selected="selected">${value.title}</option>`;
              } else {
                prodOptionArray += `<option value="${value.id}" data-variant-inventory="${value.inventory_quantity}" data-product-id="${product.id}" data-variant-title="${value.title}">${value.title}</option>`;
              }
            }
          });
          // $.each(product.variants, function (key, value) {
            // if(value.id == parseInt(product.variant_id)){
              variantSelected = variant;
              var variantSelectedImage = variantSelected.image_id,
                  variantSelectedPrice = variantSelected.price;
              var subtotalVarPrice = variantSelectedPrice*100;
              var productPrice = theme_custom.Shopify.formatMoney(variantSelectedPrice, theme_custom.money_format);
              // variant title print
              var productType = product.type.toLowerCase(),
                  productHandleVal = product.handle,
                  productSizeTypeExchangeData = optionfirst = optionSecond = optionThird = edit_item_hidden = '';
              if (variantSelected.options.length >= 1) {
                optionfirst = `<span class="option1" data-value="${variantSelected.option1}"><span class="value">${variantSelected.option1}</span></span>`;
              }
              if (variantSelected.options.length >= 2) {
                optionSecond = `<span class="option2" data-value="${variantSelected.option2}">/ <span class="value">${variantSelected.option2}</span></span>`;
              }
              if (variantSelected.options.length == 3 ) {
                optionThird = `<span class="option3" data-value="${variantSelected.option3}">/ <span class="value">${variantSelected.option3}</span></span>`;
              }
              if(productType == 'jacket' || productType == 'vest' || productType == 'shoes' || productType == 'pants' || productType == 'shirt'){
                edit_item_hidden = '';
              } else {
                edit_item_hidden = 'hidden';
              }
              productSizeTypeExchangeData = `<div class="product-size-type-exchange-wrapper">
                                          <p class="product-size-type-exchange">
                                            <span class="size-wrap option-1 hidden">${optionfirst}</span>
                                            <span class="size-wrap option-2 hidden">${optionSecond}</span>
                                            <span class="size-wrap option-3 hidden">${optionThird}</span>
                                            <span class="break hidden">|</span> 
                                            <span class="exchange-item-link link">Edit Size</span>
                                          </p>
                                          <div class="product-swatch-option ${productType}" data-product-handle="${productHandleVal}">
                                            <div class="product-swatches-main"><h4>${product.title}</h4>${customSwatchWap}</div>
                                            <select class="prod-variant-option hidden">${prodOptionArray}</select>
                                            <button type="button" name="exchange-look-item" class="button button--full-width button--primary exchange-look-item disabled" data-text="Updating..">Update</button>
                                          </div>
                                        </div>`;
              // if(variantSelectedImage == null || variantSelectedImage == '' || variantSelectedImage == undefined){
              //   productImg = productItem.image.src;
              // } else { 
                // $.each(product.images, function (key, imgValue) {
                //   if(imgValue.id == variantSelectedImage){
                //     imageSelected = imgValue;
                //   }
                // })
                productImg = variant.featured_image;
              // }
              productHtml += `<div class="look-product-wrapper horizontal-product-part-big product-data-card product-card-wrap index-${index}${pantsProd_hide}" data-product-type="${productType}" data-prod-handle="${product.handle}">
                              <div class="product-imge-left">
                                <img class="prod-img" src="${productImg}" alt="${product.title}" />
                              </div>
                              <div class="product-info">
                                <input type="hidden" class="product-id" data-product-id="${product.id}" />
                                <input type="hidden" class="product-type" data-product-type="${productType}" />
                                <input type="hidden" class="product-handle" data-product-handle="${product.handle}" />
                                <input type="hidden" class="prod-variant-data" data-var-id="${variantSelected.id}" />
                                <h4>${product.title}</h4>
                                ${productSizeTypeExchangeData}
                              </div>
                              <div class="product-price">
                                <p class="price">${productPrice}</p>
                              </div>
                            </div>`;
              subTotal = subTotal + parseInt(subtotalVarPrice);
            // }
          // });
        } else {
          productImg = product.image.src;
          productHtml += `<div class="look-product-wrapper horizontal-product-part-big index-${index}" data-prod-handle="${product.handle}">
                            <div class="product-imge-left">
                              <img class="prod-img" src="${productImg}" alt="${product.title}" />
                            </div>
                            <div class="product-info">
                              <h4>${product.title}</h4>
                              <p>We didn't find the Product...</p>
                            </div>
                          </div>`;
        }
        $(`.product-data-wrapper .look-product-block`).html(productHtml);
        $(`.product-data-wrapper .look-product-block .pants-prod-data-wrap`).html(pantProductHTML);
        productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal)/100, theme_custom.money_format);
        $(`.product-data-wrapper .order-footer .price-number`).text(productSubTotalPrice);
        // $(`.product-data-wrapper .look-product-block`).prepend(`<h2 class="border-heading title">Your Assigned Look</h2>`);
        $(".loader-icon").addClass("hidden");
        $(".product-data-wrapper").removeClass("hidden");
      })
    },
    error: function (xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.mywedding_api_call_loading .loading-overlay').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        var erroData = '';
        erroData = '<p>' + xhr.responseJSON.message + '</p>';
        $('.mywedding_api_call_loading .loading-overlay').html(erroData);
      }
    }
  });
}

// Click Event
theme_custom.clickEventInvited = function(){

  var clickEvent = document.ontouchstart !== null ? 'click' : 'touchstart';
  $(document).on(clickEvent, ".product-swatches-main .swatch-element-item", function () {
    let parent = $(this).closest('.product-swatch-option');
    let select = $('.prod-variant-option',parent);
    let subParent = $(this).closest('.swatch');
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    let variantTitle = "";
    $('.swatches',parent).each((i,item)=>{
        if(variantTitle == ""){
          variantTitle = $('.swatch-element-item.active',item).attr('data-title');
        }else{  
          variantTitle = variantTitle + ' / ' + $('.swatch-element-item.active',item).attr('data-title');
        }
    })
         
    let option = $(`select option[data-variant-title="${variantTitle}"]`,parent);
    let btn = $('.exchange-look-item',parent);
    if(option.length > 0){
      let qty = parseInt(option.attr('data-variant-inventory'))
      if(qty <= 0){
        $(btn).addClass('disabled');
        $(btn).text('Out of stock'); 
        return
      }
      optionValue = option.val();;
      $(`select`,parent).val(optionValue);
      $(btn).text('Update');
      let productType = $(btn).attr('data-product-type');
      let selectedVid = $(`.look-product-wrapper[data-product-type="${productType}"] .overview-variant-id`).attr('data-variant-id')
      if(selectedVid == optionValue){
        $(btn).addClass('disabled');
      }else{
        $(btn).removeClass('disabled');
      }
      var producthandle = parent.attr("data-product-handle");
      $(`.look-product-wrapper[data-prod-handle="${producthandle}"]`).find(".error-msg").remove();
    }else{
      $(btn).addClass('disabled');
      $(btn).text('Unavailable');
    }
  });

  $(document).on("click", ".account-event-step.tab-header", function(){
    if($(this).attr("data-event-step")=="received-order"){
      $(".product-data-wrapper").addClass("hidden")
      $(".guest-details-wrapper").removeClass("hidden")
    } else {
      $(".product-data-wrapper").removeClass("hidden")
      $(".guest-details-wrapper").addClass("hidden")
    }
  })
  $(document).on("click", ".exchange-look-item", function(){
    var button = $(this),
        targetVarID = $(this).closest(".product-swatch-option").find("select.prod-variant-option").val(),
        targetVarTitle = $(this).closest(".product-swatch-option").find("select.prod-variant-option option:selected").data("variant-title"),
        buttonText = button.data("text"),
        productHandle = button.parent(".product-swatch-option").data("product-handle");
        button.removeClass("disabled");
    button.text(buttonText);
    var targetVarTitleArr = targetVarTitle.split(" / ");
    if(targetVarTitleArr[0]!=''){ 
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".option1").attr("data-value",targetVarTitleArr[0])
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".option1 .value").text(targetVarTitleArr[0]);
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".size-wrap.option-1").removeClass("hidden");
    } 
    if(targetVarTitleArr[1] != ''){
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".option2").attr("data-value",targetVarTitleArr[0])
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".option2 .value").text(targetVarTitleArr[1]);
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".size-wrap.option-2").removeClass("hidden");
    } 
    if(targetVarTitleArr[2] != ''){
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".option3").attr("data-value",targetVarTitleArr[0])
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".option3 .value").text(targetVarTitleArr[2]); 
      $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".size-wrap.option-3").removeClass("hidden");
    }
    $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".break").removeClass("hidden");
    $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".exchange-item-link").text("Edit Item");
    $(`.look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".prod-variant-data").val(targetVarID).attr("data-var-id",targetVarID);
    button.text("Updated");
    // if($(".error-msg").length==0){
    //   $(".return-suit-checkout-button").find(".proceed-to-cart").removeClass("disabled");
    //   $(".return-suit-checkout-button").find(".proceed-to-checkout").removeClass("disabled");
    // }
    $(".fancybox-button").click();
  })

  // product option popup open
  $(document).on("click", ".exchange-item-link", function(){
    var productSwatchOption = $(this).closest(".product-size-type-exchange-wrapper").find(".product-swatch-option");
    var productType = $(this).closest(".look-product-wrapper").attr("data-product-type");
    $(this).closest(".product-size-type-exchange-wrapper").find(".exchange-look-item").addClass("disabled");
    var currentSelected = '';
    if ($(this).closest(".product-size-type-exchange-wrapper").find(".option1").length>0) {
      currentSelected = $(this).closest(".product-size-type-exchange-wrapper").find(".option1").attr("data-value")
    }
    if ($(this).closest(".product-size-type-exchange-wrapper").find(".option2").length>0) {
      currentSelected = currentSelected +' / '+ $(this).closest(".product-size-type-exchange-wrapper").find(".option2").attr("data-value");
    }
    if ($(this).closest(".product-size-type-exchange-wrapper").find(".option3").length>0) {
      currentSelected = currentSelected +' / '+ $(this).closest(".product-size-type-exchange-wrapper").find(".option3").attr("data-value");
    }    
    var targetVal =  $(".product-swatch-option").find(`option[data-variant-title='${currentSelected}']`).attr('value');
    $(`.look-product-wrapper[data-product-type="${productType}]"`).find(`.product-swatch-option option[data-variant-title='${currentSelected}']`).closest('.prod-variant-option').val(targetVal);
    $.fancybox.open(productSwatchOption);
  });

  // Create Order Functionality
  $(document).on("click", ".return-suit-checkout-button .button", function(e){
    e.preventdefault;
    var errorLength = $(".error-msg");
    if(errorLength.length > 0){
      $('html, body').stop().animate({
        'scrollTop': $(".error-msg").closest(".look-product-wrapper").offset().top - 10 - $("#shopify-section-header").height()
      }, 900);
      return false
    }
    if($(this).hasClass("proceed-to-checkout")){
      $('.account-event-step[data-event-step="purchased"]').addClass("active"); 
      var button = $(this),
          button_text = $(this).data("text"),
          payBy = 'host';
      button.addClass("disabled");
      button.find(".btn-title").text(button_text);
      parent = $(this).closest(".product-data-wrapper");
      // theme_custom.draftOrder(button, parent);
      theme_custom.multipleProductAjax(button, parent,payBy);
    }
    if($(this).hasClass("proceed-to-cart")){
      $('.account-event-step[data-event-step="purchased"]').addClass("active"); 
      var button = $(this),
          button_text = $(this).data("text"),
          payBy = 'self';
      button.find(".btn-title").text(button_text);
      parent = $(this).closest(".product-data-wrapper");
      theme_custom.multipleProductAjax(button, parent, payBy);
    }
  })

  // variant update  
  $(document).on('change', '.prod-variant-option', function() {
    var targetVal = $(this).val(),
        varintTitle = $(this).closest(".product-swatch-option").find(`.prod-variant-option option[value='${targetVal}']`).attr("data-variant-title"),
        productHandle = $(this).closest(".product-swatch-option").attr("data-product-handle");
    if ($(this).find('option').filter('[data-variant-title="'+varintTitle+'"]').length == 0) {
      $(this).closest(".product-swatch-option").append("<p class='error-msg' style='color:red; text-align:center'>"+theme_custom.productNotFoundError+"</p>");
      $(this).closest(".product-swatch-option").find(".exchange-look-item").addClass("disabled");
      $(".return-suit-checkout-button .button").addClass("disabled")
    } else {
      $(`.look-product-wrapper[data-prod-handle='${productHandle}']`).find(".product-size-type-exchange-wrapper").next().remove();
      $(`.look-product-wrapper[data-prod-handle='${productHandle}']`).addClass("product-card-wrap");
      $(this).closest(".product-swatch-option .error-msg").remove();
      $(this).closest(".product-swatch-option").find(".exchange-look-item").removeClass("disabled");
      if ($(".payment_flag").attr("payment_status")=='pending') {
        $(".return-suit-checkout-button .button").addClass("disabled");
      } else {
        $(".payment-pending-message").remove();
        $(".return-suit-checkout-button .button").removeClass("disabled");
      }
    }
  });

  // invited-event-fit-finder-button
  $(document).on("click", ".invited-event-fit-finder-button", function(){
    var getEventIdLink = window.location.href.split('?')[1];
    localStorage.setItem("invited-event-fit-finder-button","true");
    localStorage.setItem("invited-event-url",getEventIdLink);
    window.location.href = '/pages/fit-finder';
  })
}


// theme_custom.getProfileImage
theme_custom.getProfileImage = function(result){
  var profileImgHTML = previewImage = '' ;
  if(result.data.eventImage == null ){
    profileImgHTML = `<img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/default-event-img.jpg?v=1654156190" alt="no image" />`;
    previewImage = 'https://cdn.shopify.com/s/files/1/0585/3223/3402/files/default-event-img.jpg?v=1654156190';
  } else {
    profileImgHTML = `<img src="${result.data.eventImage}" alt="User profile" />`
    previewImage = result.data.eventImage;
  }
  $(".profile-pic-part").html(profileImgHTML);
  $(".avatar-preview #imagePreview").css("background-image","url('"+previewImage+"')")
}

// get Event Details
theme_custom.getEventDetails = function(eventId) {
  var event_id = eventId;
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

      },
      success: function (result) {
        theme_custom.eventResult = result;
        $('#weddingeventname').html(result.data.event_name);
        $('.breadcrumb .active-page').text(result.data.event_name);
        $('#weddingevent_id').val(result.data.event_id);
        var getMemberID = window.location.href.split('?')[1].split('&')[1].split("=")[1];
        $('#member_id').val(getMemberID);
        theme_custom.memberId = $('#member_id').val();
        // $('.event-edit-hosted').html(`<i class="fas fa-user-tie"></i> Hosted By Bobby Jones`);
        $('.account-event-step[data-event-step="invited"]').addClass("active");
        if(result.data.event_members.length > 0){
          $('.account-event-step.invite_party_members_step').addClass('active');
        }
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        // const d = new Date('"' + result.data.event_date + '"');
        let getDateFormat = result.data.event_date.replace(/-/g, "/");
        const d = new Date(getDateFormat);
        var dateformat = monthNames[d.getMonth()] + " " + d.getDate() + "," + " " + d.getFullYear();
        $('#weddingeventdate').html(dateformat);

        let user = result?.data?.event_members.find((user)=> user.is_host == 1);
        if(user){
          $('.event-edit-hosted .user-name').html(`${user.first_name} ${user.last_name}`);
        }else{
          $('.event-edit-hosted .user-name').html(localStorage.getItem("hosted-by"));
        }
        var weddingeventarray = result.data.event_members,
            eventNewArray = [],
            editEventData = '';
        for (var i = 0; i < weddingeventarray.length; i++) {
          editEventData = '';
          editEventData = '<div class="single-member-detail-part">';
          editEventData += '<div class="normal-open background-part">';
          editEventData += '<h4 class="member-name"><span class="evntfirst_name"> ' + weddingeventarray[i].first_name + ' ' + weddingeventarray[i].last_name +  '</span> <p class="evntlast_email"> ' + weddingeventarray[i].email  +  '</p> <p class="event_phone"> ' + weddingeventarray[i].phone.substring(2) + '</p></h4>';
          // editEventData += '<h5 class="secound-title">' + weddingeventarray[i].look_name + '</h5>';
          editEventData += '</div></div>';
          eventNewArray.push(editEventData);
        }
        $(".party-invite-member-part").append(eventNewArray);
        $('.mywedding_api_call_loading').addClass('hidden');
        $('.mywedding_section_wrap').removeClass('hidden');
        theme_custom.getProfileImage(result);


      },
      error: function (xhr, status, error) {
        if(xhr.responseJSON.message=='Token is invalid or expired.'){
          $('.mywedding_api_call_loading .loading-overlay').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
            'text-align':'center',
            'color':'red'
          });
          setTimeout(() => {
            theme_custom.removeLocalStorage();
            window.location.href = '/account/logout';
          }, 5000);
        } else {
          var erroData = '';
          erroData = '<p>' + xhr.responseJSON.message + '</p>';
          $('.mywedding_api_call_loading .loading-overlay').html(erroData);
        }
      }
    });
  } else {
    alert('we are not able to find event');
  }
}

// theme_custom.productVariantSeledtUpdate
theme_custom.productVariantSeledtUpdate = function(){
  var target = $(".look-product-wrapper");
  $(target).each(function(){
    var varintTitle = '', 
        currentOptionValue = '';
    if($(this).find('.option1').length > 0){
      currentOptionValue = $(this).find('.option1').attr("data-value");
      varintTitle = $(this).find('.option1').attr("data-value");
      if($(this).find(`[data-option-swatch-index="0"] .swatch-element-item[data-title="${currentOptionValue}"]`).length > 0){
        $(this).find(`[data-option-swatch-index="0"] .swatch-element-item[data-title="${currentOptionValue}"]`).addClass("active");
      } else {
        $(this).find(`[data-option-swatch-index="0"] .swatch-element-item:first`).addClass("active");
      }
      $(this).find(".size-wrap.option-1").removeClass("hidden");
    }
    if($(this).find('.option2').length > 0 ){
      currentOptionValue = $(this).find('.option2').attr("data-value");
      varintTitle = varintTitle + ' / ' + $(this).find('.option2').attr("data-value");
      if($(this).find(`[data-option-swatch-index="1"] .swatch-element-item[data-title="${currentOptionValue}"]`).length > 0){
        $(this).find(`[data-option-swatch-index="1"] .swatch-element-item[data-title="${currentOptionValue}"]`).addClass("active");
      } else {
        $(this).find(`[data-option-swatch-index="1"] .swatch-element-item:first`).addClass("active");
      }
      $(this).find(".size-wrap.option-2").removeClass("hidden");
    }
    if($(this).find('.option3').length > 0){
      currentOptionValue = $(this).find('.option3').attr("data-value");
      varintTitle = varintTitle + ' / ' + $(this).find('.option3').attr("data-value");
      if($(this).find(`[data-option-swatch-index="2"] .swatch-element-item[data-title="${currentOptionValue}"]`).length > 0){
        $(this).find(`[data-option-swatch-index="2"] .swatch-element-item[data-title="${currentOptionValue}"]`).addClass("active");
      } else {
        $(this).find(`[data-option-swatch-index="2"] .swatch-element-item:first`).addClass("active");
      }
      $(this).find(".size-wrap.option-3").removeClass("hidden");
    }
    $(this).find(".break").removeClass("hidden");
    if ($(this).find('.prod-variant-option option').filter('[data-variant-title="'+varintTitle+'"]').length == 0) {
      $(this).find('.prod-variant-option option:first').prop('selected', true);
      $(this).find(".product-info").append("<p class='error-msg' style='color:red; font-size : 14px; margin-top:5px'>"+theme_custom.productNotFoundError+"</p>");
    } else {
      $(this).find('.prod-variant-option option[data-variant-title="'+varintTitle+'"]').prop('selected', true);
      var selectedvarId = $(this).find('.prod-variant-option').val();
      $(this).find(".prod-variant-data").attr("data-var-id",selectedvarId).val(selectedvarId);
    }
  });
}

// theme_custom.fitFinderDataSet 
theme_custom.fitFinderDataSet = function(data){
  for(var i=0; i<data.length; i++){
    var jacketType = data[i].jacketSize.split(":");
    var jacketTypeVal = '';
    if(jacketType[1] == "S") {
      jacketTypeVal = 'Short'
    } else if(jacketType[1] == "R") {
      jacketTypeVal = 'Regular'
    } else if(jacketType[1] == "L"){
      jacketTypeVal = 'Long'
    }
    theme_custom.jacketSize = jacketType[0];
    theme_custom.jacketType = jacketTypeVal;
    theme_custom.pantsWaist = data[i].pants_waist;
    theme_custom.pantsLength = data[i].pants_hight;
    if($(`.look-product-wrapper[data-product-type="jacket"]`).length>0 ){
      $(`.look-product-wrapper[data-product-type="jacket"]`).find(".option1 .value").text(jacketType[0]);
      $(`.look-product-wrapper[data-product-type="jacket"]`).find(".option1").attr("data-value",jacketType[0]);
      $(`.look-product-wrapper[data-product-type="jacket"]`).find(".option2 .value").text(jacketTypeVal);
      $(`.look-product-wrapper[data-product-type="jacket"]`).find(".option2").attr("data-value",jacketTypeVal);
    }
    if($(`.look-product-wrapper[data-product-type="vest"]`).length>0){
      $(`.look-product-wrapper[data-product-type="vest"]`).find(".option1 .value").text(jacketType[0]);
      $(`.look-product-wrapper[data-product-type="vest"]`).find(".option1").attr("data-value",jacketType[0]);
      $(`.look-product-wrapper[data-product-type="vest"]`).find(".option2 .value").text(jacketTypeVal);
      $(`.look-product-wrapper[data-product-type="vest"]`).find(".option2").attr("data-value",jacketTypeVal);
    }
    if($(`.look-product-wrapper[data-product-type="pants"]`).length>0){
      $(`.look-product-wrapper[data-product-type="pants"]`).find(".option1 .value").text( theme_custom.pantsWaist);
      $(`.look-product-wrapper[data-product-type="pants"]`).find(".option1").attr("data-value",theme_custom.pantsWaist);
      $(`.look-product-wrapper[data-product-type="pants"]`).find(".option2 .value").text(theme_custom.pantsLength);
      $(`.look-product-wrapper[data-product-type="pants"]`).find(".option2").attr("data-value",theme_custom.pantsLength);
    }
    if($(`.look-product-wrapper[data-product-type="shirt"]`).length>0){
      // $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option1 .value").text(data[i].shirt_sleeve+' | '+data[i].shirt_neck);
      // $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option1").attr("data-value",data[i].shirt_sleeve+' | '+data[i].shirt_neck);
      $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option1 .value").text(data[i].shirt_neck + ' ' + data[i].shirt_sleeve);
      $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option1").attr("data-value",data[i].shirt_neck + ' ' + data[i].shirt_sleeve);
      $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option2 .value").text(data[i].fit);
      $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option2").attr("data-value",data[i].fit);
    }
    if($(`.look-product-wrapper[data-product-type="shoes"]`).length>0){
      var shoe_size = data[i].shoe_size;
      if(shoe_size<10){
        shoe_size = shoe_size.replace('0', '');
      } else {
        shoe_size = shoe_size;
      }
      $(`.look-product-wrapper[data-product-type="shoes"]`).find(".option2 .value").text(shoe_size);
      $(`.look-product-wrapper[data-product-type="shoes"]`).find(".option2").attr("data-value",shoe_size);
    }
    theme_custom.productVariantSeledtUpdate();
    $(".return-suit-checkout-button .button").hide();
    if(theme_custom.discount_code != '' || getCookie("fit-finder-data") == ''){
      $(".return-suit-checkout-button .button").addClass("disabled").fadeIn();
    } else {
      $(".return-suit-checkout-button .button").removeClass("disabled").fadeIn();
    }
  }
}

// theme_custom.getFitFinderData()
theme_custom.getFitFinderData = function(payBy){
  var checkPayBy = payBy;
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
      var buttonHtml = '';
      $(".order-footer .fit-finder-alert-msg").addClass("hidden");
      $(".product-data-wrapper .look-product-block, .product-data-wrapper .order-footer").removeClass("hidden");
      if(getCookie("fit-finder-data") == ''){
        $(".order-footer .fit-finder-alert-msg").removeClass("hidden");
        theme_custom.cartButton = 'disabled';
        $(".account-event-step[data-event-step='verified-fit']").hide();
        // $('.product-size-type-exchange').addClass('hidden');
        $('.exchange-item-link').text("Select Size");
      } else {
        $(".account-event-step[data-event-step='sized'], .account-event-step[data-event-step='verified-fit']").addClass("active");
        $(".product-size-type-exchange-wrapper .product-size-type-exchange").removeClass("hidden");
        $(".order-footer .fit-finder-alert-msg").addClass("hidden");
        // $('.product-size-type-exchange').removeClass('hidden');
        $('.exchange-item-link').text("Edit Size");
        theme_custom.cartButton = '';
        theme_custom.fitFinderDataSet(result.data);
      }
      
      if(checkPayBy=="Host" || checkPayBy=="host") {
        $('.price-number').text(theme_custom.Shopify.formatMoney(0000, theme_custom.money_format));
        buttonHtml += `<button type="button" class="button button--primary button-lr-small-padding proceed-to-checkout" data-text="Adding...">
                        <span class="btn-title">Proceed to Checkout</span> <i class="fas fa-shopping-cart"></i>
                      </button>`;
      }  else {
        buttonHtml += `<button type="button" class="button button--primary button-lr-small-padding proceed-to-cart" data-text="Adding...">
                        <span class="btn-title">Proceed to Cart</span> <i class="fas fa-shopping-cart"></i>
                      </button>`;
      }
      $(".order-footer .return-suit-checkout-button").find(".button").remove();
      $(".order-footer .return-suit-checkout-button").append(buttonHtml);
    },
    error:function(xhr,status,error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.my-size-block-main').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.my-size-block-main').html(xhr.responseJSON.message);
      }
    }
  });
}

// theme_custom.getMemberLooksData
theme_custom.getMemberLooksData = function(eventId,memberId){
  var data = {
    "event_id": eventId,
    "member_id": memberId
  }
  $.ajax({
    url: `${theme_custom.base_url}/api/event/memberLooks`,
    method: "POST",
    data: data,
    dataType: "json",
    headers: {
      // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      $(".mywedding_api_call_loading").removeClass("hidden");
      $(".mywedding_section_wrap").addClass("hidden");
    },
    success: function (result) {
      var htmlBlock = '';
      theme_custom.discount_code = result.data.event_looks[0].discount_code;
      if( result.message == 'No looks found' || result?.data?.event_looks?.length <= 0){
        htmlBlock += `<p class="text_center">We did't not found any look you have assigned!</p>`;
        $(".assigned-look-back").html(htmlBlock).removeClass("hidden");
        // $(".account-event-step[data-event-step='verified-fit']").hide();
      } else {
        var payBy = result.data.event_looks[0].pay_by;
        theme_custom.getFitFinderData(payBy);
        $("#look_id").val(result.data.event_looks[0].look_id);
        if(result.data.event_looks[0].look_image == '' || result.data.event_looks[0].look_image == null ||  result.data.event_looks[0].look_image == 'undefined'){
          $(".look-event-data .look-img").attr("src","https://cdn.shopify.com/s/files/1/0585/3223/3402/files/product-img-3.png");
        } else if(result.data.event_looks[0].look_image != '' || result.data.event_looks[0].look_image != null || result.data.event_looks[0].look_image != 'undefined') {
          $(".look-event-data .look-img").attr("src",result.data.event_looks[0].look_image);
        }
        if(result.data.event_looks[0].sized == false){
          $(".account-event-step[data-event-step='verified-fit']").hide();
        }
        $(".look-event-data .look-name").text(`${result.data.event_looks[0].name}`);
        var productItemsArr = result.data.event_looks[0].items;
        var orderFooter = `<div class="order-footer hidden">
                            <div class="order-subtotal">
                              <div class="tooltip-main upper-side-open question-tooltip">
                                <i class="far fa-question-circle"></i>
                                <p class="information_content">
                                  <b>The Event Host has prepaid for your look!</b> Proceed to enter your shipping information.
                                </p>
                              </div>
                              <div class="subtotal-label">Subtotal:</div> <h3 class="price-number">$304.98</h3>
                            </div>
                            <div class="alerts-part fit-finder-alert-msg">
                              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                              <div class="alerts-info">
                                <p class="alerts-title">Sizing Information Required</p>
                                <p class="alerts-content">Before you're able to checkout, we will need to know your size for the items above, To find your perfect fit, please use our <button class="invited-event-fit-finder-button link">Fit Finder <i class="fas fa-arrow-right"></i></button></p>
                              </div>
                            </div>
                            <div class="return-suit-checkout-button">
                              <div class="info-stickey-note" style="display:none !important">
                                <div class="info-note-text">
                                  <p class="note-title"><span class="info-icon"><i class="fas fa-info"></i></span> Need to return your suit? </p>
                                  <p class="note-title-info">Please review our <a href="/policies/refund-policy" class="link" target="_blank" tabindex="0" title="Return Policy">Return Policy.</a></p>
                                </div> 
                              </div>
                            </div>
                          </div>`;
        $(".product-data-wrapper").find(".order-footer").remove();
        $(".product-data-wrapper").append(orderFooter); 
        $(".assigned-look-back").removeClass("hidden");
        if(result.data.event_looks[0].is_payment){
          $(".payment_flag").attr("payment_status","status");
          var addTocartBtnDisabled = setInterval(() => {
            if($(".button").hasClass("proceed-to-cart")){
              $(".proceed-to-cart").addClass("order-complete");
              $(".proceed-to-cart").find(".btn-title").text("Order Completed");
              // $(".exchange-item-link").addClass("hidden");
              clearInterval(addTocartBtnDisabled);
            }
          }, 2000);
        } else {
          $(".payment_flag").attr("payment_status","pending");
          if(payBy=='Me'){
            var lookProductWrapper = setInterval(() => {
              if($(".exchange-item-link").length>0){
                $(`.look-product-wrapper[data-product-type="jacket"], .look-product-wrapper[data-product-type="vest"], .look-product-wrapper[data-product-type="pants"], .look-product-wrapper[data-product-type="shoes"], .look-product-wrapper[data-product-type="shirt"]`).find(".exchange-item-link").removeClass('hidden');
                clearInterval(lookProductWrapper);
              }
            }, 1000);
          }
          var CheckoutButtonDisabled = setInterval(() => {
            //  && result.data.event_looks[0].discount_code == null
            if($(".proceed-to-checkout").length>0 && payBy=='Host' && result.data.event_looks[0].discount_code == ''){
              $(`.proceed-to-checkout`).addClass("disabled");
              clearInterval(CheckoutButtonDisabled);
            }
          }, 5000);
          //  && result.data.event_looks[0].discount_code == null
          if(payBy=='Host' && result.data.event_looks[0].discount_code == ''){
            $(`.product-data-wrapper`).append(`<p class="payment-pending-message">Payment by the event owner is pending, please try later.</p>`);
          }
        }
        if(result.data.event_looks[0].draft_order){
          var proceedToCartDisabled = setInterval(() => {
            if($(".button").hasClass("proceed-to-checkout")){
              $(".proceed-to-checkout").addClass("order-complete");
              $(".proceed-to-checkout").find(".btn-title").text("Order Completed");
              $(".exchange-item-link").addClass("hidden");
              clearInterval(proceedToCartDisabled);
            }
        }, 5000);
      }
        theme_custom.ProductData(productItemsArr);
        setTimeout(() => {
          if(getCookie("fit-finder-data") != ''){
            $(".product-size-type-exchange, .exchange-item-link").removeClass("hidden");
          }
        }, 2000);
      }      
      $('.mywedding_api_call_loading').addClass('hidden');
      $('.mywedding_section_wrap').removeClass('hidden');
      
      let itemInterval = setInterval(()=>{
        if($('.invite-event-main-content [data-product-type="jacket"]').length > 0 && $('.invite-event-main-content [data-product-type="pants"]').length > 0){
          $('.invite-event-main-content [data-product-type="jacket"]').addClass('pant-exist');
          $('.invite-event-main-content [data-product-type="pants"]').addClass('jacket-exist');
          clearInterval(itemInterval);
        }
      },500);
      
    },
    error: function (xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.look-product-data-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        var erroData = '';
        erroData = '<p>' + xhr.responseJSON.message + '</p>';
        $('.look-product-data-wrapper .api_error').show().html(erroData);
        setTimeout(() => {
          $('.look-product-data-wrapper .api_error').hide()
        }, 5000);
      }
    }
  });
};

$(document).ready(function () {
  $(".Squer-radio-button-big").removeClass("open-popup");
  var apiIdVal = window.location.search.replace('?','').split("&");
  var eventId = apiIdVal[0].replace("event_id=",'');
  var memberId = apiIdVal[1].replace("member_id=",'');
  theme_custom.getEventDetails(eventId);
  theme_custom.getMemberLooksData(eventId,memberId);
  theme_custom.clickEventInvited();
  setTimeout(function(){
    if(getCookie('fit-finder-data')==''){
      $(".return-suit-checkout-button .button").addClass("disabled");
    } else {
      $(".return-suit-checkout-button .button").removeClass("disabled");
    }
  },3000);
});