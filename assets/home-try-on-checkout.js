// Product Data
var variantArray = [];
theme_custom.ProductData = function(productItemsArr){
  var productHtml = productSizeTypeExchangeData = pantProductHTML = productSubTotalPrice = pantEditSizeHTML = "",
      totalPrice= 0,
      subTotal = 0;
  $.map(productItemsArr, function(productItems,index) {
    jQuery.ajax({
      type: 'GET',
      url: `/products/${productItems.product_handle}.json`,
      success: function(response) {
        var prodOptionArray = [];
        var pantsProd_hide = "";
        var getUrl = window.location.href;
        if (getUrl.includes('?')) {
          var getUrlArr = getUrl.split('?'),
            getQueryParam = getUrl.split("?")[1],
            getProductItem = getQueryParam.split("&");
        }
        var productVarId='', productHandleTitle= '';
        var var_id = '';
       
        for(i=0; i<response.product.variants.length;i++){
          var_id = response.product.variants[i];
          if (var_id.id == productItems.variant_id) {
            var_has_available = true;
            break;
          } else {
            var_has_available = false;
          }
        }
        if (var_has_available) {
          $.each(response.product.variants, function (key, value) {
            if(!value.title == ''){
              prodOptionArray += `<option value="${value.id}" data-product-id="${response.product.id}" data-variant-title="${value.title}">${value.title}</option>`;
            }
          });
          $.each(response.product.variants, function (key, value) {
            $(getProductItem).each(function (index,innervalue) {
              productHandleTitle = getProductItem[index].split("=")[0];
              productVarId = parseInt(getProductItem[index].split("=")[1]);
              if(productHandleTitle == 'event_id' || productHandleTitle == 'member_id' ){
                return;
              }
            
                if(value.id == productVarId){
                  variantSelected = value;
                  var variantArrayData ={
                    "variant_id": productVarId,
                    "quantity": 1,
                    "price": parseFloat(variantSelected.price).toFixed(2),
                    "tax_lines": [{
                      "price": 13.50,
                      "rate": 0.00,
                      "title": "State tax"
                    }]
                  }
                  variantArray.push(variantArrayData);
                  var variantSelectedImage = variantSelected.image_id,
                      variantSelectedPrice = variantSelected.price;
                  var subtotalVarPrice = variantSelectedPrice*100;
                  var productPrice = theme_custom.Shopify.formatMoney(variantSelectedPrice, theme_custom.money_format);
                  // variant title print
                  var productType = response.product.product_type.toLowerCase(),
                      productHandleVal = response.product.handle,
                      productSizeTypeExchangeData = optionfirst = optionSecond = optionThird = edit_item_hidden = '';
                  if (variantSelected.option1 == null ) {
                    optionfirst = '';
                  } else {
                    optionfirst = `<span class="option1" data-value="${variantSelected.option1}"><span class="value">${variantSelected.option1}</span></span>`;
                  }
                  if (variantSelected.option2 == null ) {
                    optionSecond = '';
                  } else {
                    optionSecond = `<span class="option2" data-value="${variantSelected.option2}">/ <span class="value">${variantSelected.option2}</span></span>`;
                  }
                  if (variantSelected.option3 == null ) {
                    optionThird = '';
                  } else {
                    optionThird = `<span class="option3" data-value="${variantSelected.option3}">/ <span class="value">${variantSelected.option3}</span></span>`;
                  }

                  if(productType == 'jacket'){
                    if (variantSelected.option1 == null ) {
                      optionfirst = '';
                    } else {
                      optionfirst = `<span>Jacket </span><span class="option1" data-value="${variantSelected.option1}"><span class="value">${variantSelected.option1}</span></span>`;
                    }
                    if (variantSelected.option2 == null ) {
                      optionSecond = '';
                    } else {
                      optionSecond = `<span class="option2" data-value="${variantSelected.option2}"> <span class="value">${variantSelected.option2}</span></span>`;
                    }
                    if (variantSelected.option3 == null ) {
                      optionThird = '';
                    } else {
                      optionThird = '';
                    }
                  }
    
                  if(productType == 'pants'){
                    if (variantSelected.option1 == null ) {
                      optionfirst = '';
                    } else {
                      optionfirst = `<span>|  Pants </span><span class="option1" data-value="${variantSelected.option1}"><span class="value">${variantSelected.option1}</span></span>`;
                    }
                    if (variantSelected.option2 == null ) {
                      optionSecond = '';
                    } else {
                      optionSecond = `<span class="option2" data-value="${variantSelected.option2}"> <span class="value">${variantSelected.option2}</span></span>`;
                    }
                  }


                  if(productType == 'jacket' || productType == 'vest' || productType == 'shoes' || productType == 'pants' || productType == 'shirt'){
                    edit_item_hidden = '';
                  } else {
                    edit_item_hidden = 'hidden';
                  }
                  if(productType == 'jacket'){
                    product_title = response.product.title.replace("Jacket","Suit");
                  }else{
                    product_title = response.product.title;
                  }
                  productSizeTypeExchangeData = `<div class="product-size-type-exchange-wrapper">
                                              <p class="product-size-type-exchange">
                                                <span class="size-wrap">${optionfirst}</span>
                                                <span class="size-wrap">${optionSecond}</span>
                                                <span class="size-wrap">${optionThird}</span>
                                              </p>
                                            </div>`;

                  if(productType == 'pants'){
                    pantEditSizeHTML = `<div data-product-type="${productType}" class="product-size-type-exchange-wrapper">
                                              <p class="product-size-type-exchange">
                                                <span class="size-wrap pants-option">${optionfirst}W</span>
                                                <span class="size-wrap pants-option">${optionSecond}H</span>
                                              </p>
                                              </div>`;
                  }
                  // if(variantSelectedImage == null || variantSelectedImage == '' || variantSelectedImage == undefined){
                  //   productImg = response.product.image.src;
                  // } else { 
                    $.each(response.product.images, function (key, imgValue) {
                      if(imgValue.id == variantSelectedImage){
                        imageSelected = imgValue;
                      }
                    })
                    productImg = imageSelected.src;
                  // }
                  productHtml += `<div class="look-product-wrapper horizontal-product-part-big product-data-card product-card-wrap index-${index}${pantsProd_hide}" data-product-type="${productType}" data-prod-handle="${productHandleVal}">
                                  <div class="product-imge-left">
                                    <img class="prod-img" src="${productImg}" alt="${response.product.title}" />
                                  </div>
                                  <div class="product-info">
                                    <input type="hidden" class="product-id" data-product-id="${response.product.id}" />
                                    <input type="hidden" class="product-type" data-product-type="${productType}" />
                                    <input type="hidden" class="product-handle" data-product-handle="${productHandleVal}" />
                                    <input type="hidden" class="prod-variant-data" data-var-id="${productItems.variant_id}" />
                                    <h4>${product_title}</h4>
                                    ${productSizeTypeExchangeData}
                                  </div>
                                </div>`;
                  subTotal = subTotal + parseInt(subtotalVarPrice)*100;
                }
            });
          });
        } else {
          productImg = response.product.image.src;
          productHtml += `<div class="look-product-wrapper horizontal-product-part-big index-${index}" data-prod-handle="${productItems.product_handle}">
                            <div class="product-imge-left">
                              <img class="prod-img" src="${productImg}" alt="${response.product.title}" />
                            </div>
                            <div class="product-info">
                              <h4>${productItems.product_handle}</h4>
                              <p>We didn't find the Product...</p>
                            </div>
                          </div>`;
        }
        $(`.product-data-wrapper .look-product-block`).html(productHtml);
        $(`.product-data-wrapper .look-product-block [data-product-type="jacket"] .product-info`).append(pantEditSizeHTML);
        // $(" .right-side-product-data .horizontal-product-part-big[data-product-type=pants]").hide();
        // // $(" .right-side-product-data .horizontal-product-part-big[data-product-type=vest]").hide();
        // $(" .right-side-product-data .horizontal-product-part-big[data-product-type=neckties],  .right-side-product-data .horizontal-product-part-big[data-product-type=bow-ties]").hide();
        // $(" .right-side-product-data .horizontal-product-part-big[data-product-type=hanky]").hide();
        $(`.product-data-wrapper .look-product-block .pants-prod-data-wrap`).html(pantProductHTML);
        var taxprice = subTotal * theme_custom.order_tax / 100;
        productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal)/100, theme_custom.money_format);
        $(`.product-data-wrapper .order-footer .right-sub-detail.subtotal`).text(productSubTotalPrice);
        $("h3.right-sub-detail.order-tax").text(theme_custom.Shopify.formatMoney((taxprice)/100, theme_custom.money_format));
        $(".loader-icon").addClass("hidden");
        $(".product-data-wrapper").removeClass("hidden");
        totalPrice = subTotal + taxprice;
        $(".order-flex h3.total-price").text(theme_custom.Shopify.formatMoney((totalPrice)/100, theme_custom.money_format));
        $(".right-summary-total h3").text(theme_custom.Shopify.formatMoney((totalPrice)/100, theme_custom.money_format));
      },
      error: function(xhr, status, error) {
        productHtml += `<div class="look-product-wrapper product-not-found horizontal-product-part-big index-${index}" data-prod-handle="${productItems.product_handle}">
                            <h4>${productItems.product_handle}</h4>
                            <p>We didn't find the Product...</p> 
                          </div>`;
        $(`.product-data-wrapper .look-product-block`).html(productHtml);
        $(".loader-icon").addClass("hidden");
        $(".product-data-wrapper").removeClass("hidden");
        $(".order-footer").hide();
      }
    });
  });
}

theme_custom.getEventDetails = function (eventId) {
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
          const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          let getDateFormat = result.data.event_date.replace(/-/g, "/");
          const d = new Date(getDateFormat);
          var dateformat = monthNames[d.getMonth()] + " " + d.getDate() + "," + " " + d.getFullYear();
          var getMonth = d.getMonth() + 1,
            getDate = d.getDate();
          var eventDate = getMonth + '/' + getDate + '/' + d.getFullYear();
          // $('#weddingeventdate').html(dateformat).attr("data-event-date", eventDate);
          $('.home-try-on-checkout-content h4.sub-heading.wedding-date').find("span").text(dateformat);
        },
        error: function (xhr, status, error) {
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
            $('.mywedding_api_call_loading .loading-overlay').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
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
            $('.mywedding_api_call_loading .loading-overlay').html(erroData);
          }
        }
      });
    } else {
      alert('we are not able to find event');
    }
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
    if($(`.right-side-product-data .look-product-wrapper[data-product-type="jacket"]`).length>0 ){
      $(`.right-side-product-data .look-product-wrapper[data-product-type="jacket"]`).find(".option1 .value").text(jacketType[0]);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="jacket"]`).find(".option1").attr("data-value",jacketType[0]);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="jacket"]`).find(".option2 .value").text(jacketTypeVal);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="jacket"]`).find(".option2").attr("data-value",jacketTypeVal);
    }
    if($(`.right-side-product-data .look-product-wrapper[data-product-type="vest"]`).length>0){
      $(`.right-side-product-data .look-product-wrapper[data-product-type="vest"]`).find(".option1 .value").text(jacketType[0]);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="vest"]`).find(".option1").attr("data-value",jacketType[0]);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="vest"]`).find(".option2 .value").text(jacketTypeVal);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="vest"]`).find(".option2").attr("data-value",jacketTypeVal);
    }
    if($(`.right-side-product-data .look-product-wrapper[data-product-type="pants"]`).length>0){
      $(`.right-side-product-data .look-product-wrapper[data-product-type="pants"]`).find(".option1 .value").text( theme_custom.pantsWaist);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="pants"]`).find(".option1").attr("data-value",theme_custom.pantsWaist);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="pants"]`).find(".option2 .value").text(theme_custom.pantsLength);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="pants"]`).find(".option2").attr("data-value",theme_custom.pantsLength);
    }
    if($(`.right-side-product-data .look-product-wrapper[data-product-type="shirt"]`).length>0){
      // $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option1 .value").text(data[i].shirt_sleeve+' | '+data[i].shirt_neck);
      // $(`.look-product-wrapper[data-product-type="shirt"]`).find(".option1").attr("data-value",data[i].shirt_sleeve+' | '+data[i].shirt_neck);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="shirt"]`).find(".option1 .value").text(data[i].shirt_neck + ' ' + data[i].shirt_sleeve);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="shirt"]`).find(".option1").attr("data-value",data[i].shirt_neck + ' ' + data[i].shirt_sleeve);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="shirt"]`).find(".option2 .value").text(data[i].fit);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="shirt"]`).find(".option2").attr("data-value",data[i].fit);
    }
    if($(`.right-side-product-data .look-product-wrapper[data-product-type="shoes"]`).length>0){
      var shoe_size = data[i].shoe_size;
      if(shoe_size<10){
        shoe_size = shoe_size.replace('0', '');
      } else {
        shoe_size = shoe_size;
      }
      $(`.right-side-product-data .look-product-wrapper[data-product-type="shoes"]`).find(".option2 .value").text(shoe_size);
      $(`.right-side-product-data .look-product-wrapper[data-product-type="shoes"]`).find(".option2").attr("data-value",shoe_size);
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
      $(".order-footer .fit-finder-alert-msg").addClass("hidden");
      $(".product-data-wrapper .look-product-block, .product-data-wrapper .order-footer").removeClass("hidden");
      if(getCookie("fit-finder-data") == ''){
        $(".order-footer .fit-finder-alert-msg").removeClass("hidden");
        $('.product-size-type-exchange').addClass('hidden');
      } else {
        $(".product-size-type-exchange-wrapper .product-size-type-exchange").removeClass("hidden");
        $('.product-size-type-exchange').removeClass('hidden');
        theme_custom.cartButton = '';
        $(`.look-product-wrapper[data-product-type="jacket"], .look-product-wrapper[data-product-type="vest"], .look-product-wrapper[data-product-type="pants"], .look-product-wrapper[data-product-type="shoes"], .look-product-wrapper[data-product-type="shirt"]`).find(".exchange-item-link").removeClass('hidden');
        // setTimeout(() => {
        //   theme_custom.fitFinderDataSet(result.data);
        // }, 1000);
      }
      // if(checkPayBy=="Host" || checkPayBy=="host") {
      //   $('.price-number').text(theme_custom.Shopify.formatMoney(0000, theme_custom.money_format));
      // }
    },
    error:function(xhr,status,error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.my-size-block-main').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
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
      $('.mywedding_section_wrap .assigned-look-back').addClass("hidden");
      $(".mywedding_section_wrap .not-found-assigned-look-back").addClass("hidden");
      // $(".mywedding_section_wrap").addClass("hidden");

    },
    success: function (result) {
      var htmlBlock = '';
      if( result.message == 'No looks found'){
        htmlBlock += `<p class="text_center">We did't not found any look you have assigned!</p>`;
        $(".mywedding_section_wrap .not-found-assigned-look-back").html(htmlBlock).removeClass("hidden");
        $(".loader-icon").addClass("hidden");
        // $(".account-event-step[data-event-step='verified-fit']").hide();
      } else {
        $(".mywedding_section_wrap .assigned-look-back").removeClass("hidden");
        var payBy = result.data.event_looks[0].pay_by;
        theme_custom.getFitFinderData(payBy);
        $("#look_id").val(result.data.event_looks[0].look_id);
        if(result.data.event_looks[0].look_image == '' || result.data.event_looks[0].look_image == null ||  result.data.event_looks[0].look_image == 'undefined'){
          $(".look-event-data .look-img").attr("src","https://cdn.shopify.com/s/files/1/0585/3223/3402/files/product-img-3.png");
        } else if(result.data.event_looks[0].look_image != '' || result.data.event_looks[0].look_image != null || result.data.event_looks[0].look_image != 'undefined') {
          $(".look-event-data .look-img").attr("src",result.data.event_looks[0].look_image);
        }
        $(".look-event-data .look-name").text(`${result.data.event_looks[0].name}`);
        var productItemsArr = result.data.event_looks[0].items;
        var orderFooter = `<div class="order-footer hidden">
                            <div class="order-subtotal">
                            <div class="order-flex">
                              <div>Discount</div> <h3 class="right-sub-detail">Free Home Try On</h3>
                            </div>
                            <div class="order-flex">
                              <div>Subtotal</div> <h3 class="right-sub-detail subtotal">$304.98</h3>
                            </div>
                            <div class="order-flex">
                              <div>Tax</div> <h3 class="right-sub-detail order-tax">$0.00</h3>
                            </div>
                            <div class="order-flex">
                              <div>Shipping</div> <h3 class="right-sub-detail">$0.00</h3>
                            </div>
                            <div class="order-flex">
                              <div class="checkout-total">Total</div><h3 class="total-price">$211.98</h3>
                            </div>
                            </div>
                            <div class="return-suit-checkout-button">
                              <div class="info-stickey-note">
                                <span class="info-icon"><i class="fas fa-info"></i></span>
                                <div class="info-note-text">
                                  <p class="note-title">You will NOT be charged the amount above until you receive your suit and verify the fit.</p>
                                  <p>Please review our <a href="/policies/refund-policy" class="link" target="_blank" tabindex="0" title="Return Policy">Return Policy.</a></p>
                                </div> 
                              </div>
                            </div>
                          </div>`;
        theme_custom.ProductData(productItemsArr);
        $(".product-data-wrapper").find(".order-footer").remove();
        $(".product-data-wrapper").append(orderFooter); 
        // $('.mywedding_section_wrap .assigned-look-back').removeClass("hidden");
        if(result.data.event_looks[0].is_payment){
          $(".payment_flag").attr("payment_status","status");
          var addTocartBtnDisabled = setInterval(() => {
            if($(".button").hasClass("proceed-to-cart")){
              $(".proceed-to-cart").addClass("order-complete");
              $(".proceed-to-cart").find(".btn-title").text("Order Completed");
              clearInterval(addTocartBtnDisabled);
            }
          }, 500);
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

          // var CheckoutButtonDisabled = setInterval(() => {
          //   if($(".proceed-to-checkout").length>0 && payBy=='Host'){
          //     $(`.proceed-to-checkout`).addClass("disabled");
          //     clearInterval(CheckoutButtonDisabled);
          //   }
          // }, 500);
          // if(payBy=='Host'){
          //   $(`.product-data-wrapper`).append(`<p class="payment-pending-message">Payment by the event owner is pending, please try later.</p>`);
          // }
        }
        if(result.data.event_looks[0].draft_order){
          var proceedToCartDisabled = setInterval(() => {
            if($(".button").hasClass("proceed-to-checkout")){
              $(".proceed-to-checkout").addClass("order-complete");
              $(".proceed-to-checkout").find(".btn-title").text("Order Completed");
              clearInterval(proceedToCartDisabled);
            }
          }, 500);
        }
        $(".loader-icon").removeClass("hidden");
      }      
      $('.mywedding_api_call_loading').addClass('hidden');
      // $('.mywedding_section_wrap').removeClass('hidden');
      // $('.mywedding_section_wrap .assigned-look-back').removeClass("hidden");
    },
    error: function (xhr, status, error) {
      if(xhr.responseJSON.message=='Token is invalid or expired.'){
        $('.look-product-data-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align':'center',
          'color':'red'
        });
        setTimeout(() => {
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

theme_custom.create_stripe_payment = function(shipping_info_data,stripe_card_data,button){
  $.ajax({
    url: `${theme_custom.base_url}/api/stripe/token`,
    method: "POST",
    data: stripe_card_data,
    dataType: "json",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      button.addClass("disabled");
    },
    success: function (result) {
      var token_id = result.data.token_id;
      button.addClass("disabled");
      $('.api_error').addClass("success-event").show().html(result.message);
      setTimeout(() => {
        $('.api_error').removeClass("success-event").html('').hide();
        button.removeClass("disabled");
      }, 5000);
      shipping_info_data.token_id = token_id;
      theme_custom.create_home_try_order(shipping_info_data,button);
    },
    error: function (xhr, status, error) {
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
        setTimeout(() => {
          button.removeClass("disabled");
          $(".api_error").html('').hide();
        }, 10000);
      }
    }
  });
}

theme_custom.create_home_try_order = function(shipping_info_data,button){ 
  $.ajax({
    url: `${theme_custom.base_url}/api/order/create`,
    method: "POST",
    data: JSON.stringify(shipping_info_data),
    dataType: "json",
    contentType: 'application/json; charset=utf-8',
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
      button.addClass("disabled");
    },
    success: function (result) {
      $(".fancybox-button").click();
      button.addClass("disabled");
      $('.api_error').addClass("success-event").show().html(result.message);
      var targetPopup = $(".content-for-layout").find(".hometryon-success-popup-wrapper");
      $.fancybox.open(targetPopup);
      $('.hometryon-success-popup-wrapper .hometryon-success-sub').attr("data-order-id",result.data.order_id);
      setTimeout(() => {
        $('.api_error').removeClass("success-event").html('').hide();
        button.removeClass("disabled");
        $("#shipping-address")[0].reset();
        $(".my-event-continue-btn").click();
      }, 4000);
    },
    error: function (xhr, status, error) {
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
        setTimeout(() => {
          button.removeClass("disabled");
          $(".api_error").html('').hide();
        }, 10000);
      }
    }
  });
}

$(document).ready(function () {
  var apiIdVal = window.location.search.replace('?','').split("&");
  var eventId = apiIdVal[0].replace("event_id=",'');
  var memberId = apiIdVal[1].replace("member_id=",'');
  theme_custom.getMemberLooksData(eventId,memberId);
  theme_custom.getEventDetails(eventId);
  $(".mywedding_section_wrap .page-back-link").find(".link").attr('href', '/pages/home-try-on?event_id=' + eventId);
});

$(document).on("click",".left-summary h3",function() {
  $(this).toggleClass("active");
  $('.right-side-product-data').toggleClass("active");
});

$(document).on("click",".proceed-to-shipping-main .proceed-shipping-btn",function(e) {
  e.preventDefault();
  var parent = $(this).closest(".content-for-layout");
  form = $(this).parents('#shipping-address'),
  error_count = 0;
  error_count = error_count + theme_custom.nameValidation(form.find('[name="customer[first_name]"]'));
  error_count = error_count + theme_custom.nameValidation(form.find('[name="customer[last_name]"'));
  // error_count = error_count + theme_custom.nameValidation(form.find('[name="customer[company]"'));
  error_count = error_count + theme_custom.nameValidation(form.find('[name="customer[city]"'));
  error_count = error_count + theme_custom.textareaValidation(form.find('[name="customer[address]"'));
  // error_count = error_count + theme_custom.textareaValidation(form.find('[name="customer[address2]"'));
  error_count = error_count + theme_custom.zipValidation(form.find('[name="customer[zipcode]"'));
  error_count = error_count + theme_custom.phoneValidation(form.find('[name="customer[phone]"'));
  error_count = error_count + theme_custom.countryValidation (form.find('[name="customer[country]"'));
  error_count = error_count + theme_custom.countryValidation (form.find('[name="customer[state]"'));
  if(error_count > 0){
    e.preventDefault();
    return false;
  }else{
    $.fancybox.open(parent.find('.stripe-payment-popup-wrapper'));  
    $('#stripe-payment-form')[0].reset();
    $('.pay-now-btn').removeClass("disabled");
    return true;
  } 
});

$(document).on("submit","#stripe-payment-form",function(e) {
  e.preventDefault();
  var error_count = 0,
  form = $(this),
  button = $(this).find(".pay-now-btn");
  error_count = error_count + theme_custom.eventReminderTitleValidation(form.find('[name="nameoncard"]'));
  error_count = error_count + theme_custom.cardNumberValidation(form.find('[name="cardnumber"'));
  error_count = error_count + theme_custom.expiryDateValidation(form.find('[name="expirationdate"'));
  error_count = error_count + theme_custom.cvvValidation(form.find('[name="cvv"'));
  if(error_count > 0){      
      return false;
  }else{
    if (error_count == 0) {
      var shipping_add_first_name = $("#Contact-FirstName").val();
      var shipping_add_last_name = $("#Contact-LastName").val();
      var shipping_add_company = $("#Contact-Company").val();
      var shipping_add_address = $("#Contact-Address").val();
      var shipping_add_address2 = $("#Contact-Address2").val();
      var shipping_add_city = $("#Contact-City").val();    
      var shipping_add_country = $("#Contact-Country").val();
      var shipping_add_state = $("#Contact-State").val();
      var shipping_add_zipcode = $("#Contact-Zipcode").val();
      var phone = $("#Contact-Phone").val().replace('(','').replace(' ','').replace(')','').replace('-','');
      var customer_email = $("#custom_email").val();
      var customer_id = $("#customer_id").val().replaceAll("","");
      // var financial_status = $(".payment_flag").attr("payment_status");
      var apiIdVal = window.location.search.replace('?','').split("&");
      var eventId = apiIdVal[0].replace("event_id=",'');
      var memberId = apiIdVal[1].replace("member_id=",'');
      var look_id = $("#look_id").val();
      var shipping_addressData = {
        "first_name":shipping_add_first_name,
        "last_name":shipping_add_last_name,
        "company":shipping_add_company,
        "address1":shipping_add_address,
        "address2":shipping_add_address2,
        "city":shipping_add_city,
        "province":shipping_add_state,
        "country":shipping_add_country,
        "zip":shipping_add_zipcode
      }
    }
    var shipping_info_data ={
      "use_customer_default_address":true,
      "email": customer_email,
      "phone": phone,
      "line_items": variantArray,
      "total_tax": 13.50,
      "is_cod": false,
      "customer_id": customer_id,
      "shipping_address":shipping_addressData,
      "tags": "home_try_on",
      "financial_status": "pending",
      "send_receipt": true,
      "send_fulfillment_receipt": true,
      "payment_gateway_names": [
        "Stripe"
      ],
      "note_attributes":[
        {
          "name": "event_id",
          "value": eventId,
        },
        {
          "name": "member_id",
          "value":memberId
        },
        {
          "name": "look_id",
          "value": look_id
        },
        {
          "name": "order_type",
          "value": "home_try_on"
        }
      ],
      "processing_method": "direct",
      "note": "Home try on order"
    }
    var card_number = form.find("#cardnumber").val().replaceAll(' ','');
    var expirydate = form.find("#expirationdate").val().split('/');
    var exp_month = expirydate[0];
    var exp_year = expirydate[1];
    var exp_cvv = form.find("#cvv").val();
    var stripe_card_data = {
      "number": card_number,
      "exp_month" : exp_month,
      "exp_year": exp_year,
      "cvc": exp_cvv
    }
    theme_custom.create_stripe_payment(shipping_info_data,stripe_card_data,button);
  }
 
});

$(document).on("click",".my-event-continue-btn",function(e) {
  var apiIdVal = window.location.search.replace('?','').split("&");
  var eventId = apiIdVal[0].replace("event_id=",'');
  var order_id =$('.hometryon-success-popup-wrapper .hometryon-success-sub').attr("data-order-id");
  localStorage.setItem("order_id", order_id );
  window.location.href = '/pages/my-event?event_id='+eventId;
});