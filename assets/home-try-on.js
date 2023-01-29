  // product option popup open
  $(document).on("click", ".exchange-item-link", function(){
    var variantId = $(this).closest('.product-info').find('.prod-variant-data').attr('data-variant-id');
    var productHandle = $(this).closest('.look-product-wrapper').attr('data-prod-handle');
    var productSwatchOption = $(this).closest(".product-size-type-exchange-wrapper").find(".product-swatch-option");
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
    var targetVal =  $(".product-swatch-option").find(`option[data-variant-title='${currentSelected}']`).attr('value')
    $(".product-swatch-option").find(`option[data-variant-title='${currentSelected}']`).closest('.prod-variant-option').val(targetVal);
    $(`.product-swatch-option[data-product-handle="${productHandle}"] .prod-variant-option`).val(variantId);
    $.fancybox.open(productSwatchOption);
  });

    // exchange-look-item
    $(document).on("click", ".exchange-look-item", function () {
      var button = $(this),
        targetVarID = $(this).closest(".product-swatch-option").find("select.prod-variant-option").val(),
        targetVarTitle = $(this).closest(".product-swatch-option").find("select.prod-variant-option option:selected").attr("data-variant-title"),
        buttonText = button.attr("data-text"),
        productHandle = button.parent(".product-swatch-option").attr("data-product-handle"),
        productType = button.attr('data-product-type');
      button.removeClass("disabled"),
        productImg = $(this).closest(".product-swatch-option").find("select.prod-variant-option option[data-variant-title='" + targetVarTitle + "']").attr("data-variant-featured-img");
      button.text(buttonText);
      var targetVarTitleArr = targetVarTitle.split(" / ");
      if (targetVarTitleArr[0] != '') {
        $(`.product-data-wrapper .look-product-wrapper[data-prod-handle="${productHandle}"]`).find(`.product-size-type-exchange-wrapper[data-product-type="${productType}"] .option1`).text(targetVarTitleArr[0]);
      }
      if (targetVarTitleArr[1] != '') {
        $(`.product-data-wrapper .look-product-wrapper[data-prod-handle="${productHandle}"]`).find(`.product-size-type-exchange-wrapper[data-product-type="${productType}"] .option2`).text(targetVarTitleArr[1]);
      }
      if (targetVarTitleArr[2] != '') {
        $(`.product-data-wrapper .look-product-wrapper[data-prod-handle="${productHandle}"]`).find(`.product-size-type-exchange-wrapper[data-product-type="${productType}"] .option3`).text(targetVarTitleArr[2]);
      }
      $(`.product-data-wrapper .look-product-block .look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".product-imge-left img").attr('src', productImg);
      $(`.product-data-wrapper .look-product-block .look-product-wrapper[data-prod-handle="${productHandle}"]`).find(".prod-variant-data").attr("data-variant-id", targetVarID);
      if(productType == 'jacket'){
        // $(`.product-data-wrapper .look-product-block .look-product-wrapper[data-product-type="jacket"] .option1`).text(targetVarTitleArr[0]);
        // $(`.product-data-wrapper .look-product-block .look-product-wrapper[data-product-type="jacket"] .option2`).text(targetVarTitleArr[1]);
      }else if(productType == 'pants'){
        $(`.product-data-wrapper .look-product-block .look-product-wrapper[data-product-type="jacket"] .pants-option .option1`).text(targetVarTitleArr[0]);
        $(`.product-data-wrapper .look-product-block .look-product-wrapper[data-product-type="jacket"] .pants-option .option2`).text(targetVarTitleArr[1]);
      }
      button.text("Updated");
      $(".fancybox-button").click();
    })

// Product Data
theme_custom.ProductData = function(productItemsArr){
  var productHtml = productSizeTypeExchangeData = pantProductHTML = productSubTotalPrice = pantEditSizeHTML = "",
      subTotal = suitPrice = 0;
  $.map(productItemsArr, function(productItems,index) {
    jQuery.ajax({
      type: 'GET',
      url: `/products/${productItems.product_handle}.json`,
      success: function(response) {
        var prodOptionArray = [];
        var pantsProd_hide = "";
        for(i=0; i<response.product.variants.length;i++){
          var var_id = response.product.variants[i];
          if (var_id.id == productItems.variant_id) {
            var_has_available = true;
            break;
          } else {
            var_has_available = false;
          }
        }
        if (var_has_available) {
          $.each(response.product.variants, function (key, value) {
            variantSelected = value;
            var variantSelectedImageId = variantSelected.image_id;
            $.each(response.product.images, function (key, imgValue) {
              if(imgValue.id == variantSelectedImageId){
                imageSelected = imgValue;
              }
            })
            feature_variant_productImg = imageSelected.src;
            if(!value.title == ''){
              prodOptionArray += `<option value="${value.id}" data-variant-featured-img="${feature_variant_productImg}"  data-product-id="${response.product.id}" data-variant-title="${value.title}" data-v-price="${value.price}">${value.title}</option>`;
            }
          });
          $.each(response.product.variants, function (key, value) {
            if(value.id == productItems.variant_id){
              variantSelected = value;
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
                  optionfirst = `<span>Pants </span><span class="option1" data-value="${variantSelected.option1}"><span class="value">${variantSelected.option1}</span></span>`;
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
              productSizeTypeExchangeData = `<div data-product-type="${productType}" class="product-size-type-exchange-wrapper">
                                          <p class="product-size-type-exchange hidden">
                                            <span class="size-wrap">${optionfirst}</span>
                                            <span class="size-wrap">${optionSecond}</span>
                                            <span class="size-wrap">${optionThird}</span>
                                            <span class="exchange-item-link link hidden"><span class="break">|</span> Edit Size</span>
                                          </p>
                                          <div class="product-swatch-option" data-product-handle="${productHandleVal}">
                                            <select class="prod-variant-option">${prodOptionArray}</select>
                                            <button type="button" name="exchange-look-item" class="button button--full-width button--primary exchange-look-item disabled" data-product-type="${productType}" data-text="Updating..">Update</button>
                                          </div>
                                        </div>`;

              
              if(productType == 'pants'){
                pantEditSizeHTML = `<div data-product-type="${productType}" class="product-size-type-exchange-wrapper">
                                          <p class="product-size-type-exchange hidden">
                                            <span class="size-wrap pants-option">${optionfirst}W</span>
                                            <span class="size-wrap pants-option">${optionSecond}H</span>
                                            <span class="exchange-item-link link hidden"><span class="break">|</span> Edit Size</span>
                                          </p>
                                          <div class="product-swatch-option" data-product-handle="${productHandleVal}">
                                            <select class="prod-variant-option">${prodOptionArray}</select>
                                            <button type="button" name="exchange-look-item" class="button button--full-width button--primary exchange-look-item disabled" data-product-type="${productType}" data-text="Updating..">Update</button>
                                          </div>
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
              var product_title='';
              if(productType == 'jacket'){
                product_title = response.product.title.replace("Jacket","Suit");
              }else{
                product_title = response.product.title;
              }
              productHtml += `<div class="look-product-wrapper horizontal-product-part-big product-data-card product-card-wrap index-${index}${pantsProd_hide}" data-product-type="${productType}" data-prod-handle="${productHandleVal}">
                              <div class="product-imge-left">
                                <img class="prod-img" src="${productImg}" alt="${response.product.title}" />
                              </div>
                              <div class="product-info">
                                <input type="hidden" class="product-id" data-product-id="${response.product.id}" />
                                <input type="hidden" class="product-type" data-product-type="${productType}" />
                                <input type="hidden" class="product-handle" data-product-handle="${productHandleVal}" />
                                <input type="hidden" class="prod-variant-data" data-variant-id="${productItems.variant_id}" />
                                <h4>${product_title}</h4>
                                ${productSizeTypeExchangeData}
                              </div>
                              <div class="product-price">
                                <p class="price">${productPrice}</p>
                              </div>
                            </div>`;
              subTotal = subTotal + parseInt(subtotalVarPrice)*100;
              if(productType == 'jacket' || productType == 'pants'){
                suitPrice = suitPrice + parseInt(subtotalVarPrice);
              }
            }
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
        $(`.product-data-wrapper .look-product-block [data-product-type="jacket"] .product-price .price`).html(theme_custom.Shopify.formatMoney(suitPrice, theme_custom.money_format));
        $(".invited-assigned-look .horizontal-product-part-big[data-product-type=pants]").hide();
        // $(".invited-assigned-look .horizontal-product-part-big[data-product-type=vest]").hide();
        // $(".invited-assigned-look .horizontal-product-part-big[data-product-type=neckties], .invited-assigned-look .horizontal-product-part-big[data-product-type=bow-ties]").hide();
        // $(".invited-assigned-look .horizontal-product-part-big[data-product-type=hanky]").hide();
        $(`.product-data-wrapper .look-product-block .pants-prod-data-wrap`).html(pantProductHTML);
        productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal)/100, theme_custom.money_format);
        $(`.product-data-wrapper .order-footer .price-number`).text(productSubTotalPrice);
        $(`.product-data-wrapper .look-product-block`).prepend(`<h2 class="border-heading title">Review Your Look</h2>`);
        $(".loader-icon").addClass("hidden");
        $(".product-data-wrapper").removeClass("hidden");
      },
      error: function(xhr, status, error) {
        productHtml += `<div class="look-product-wrapper product-not-found horizontal-product-part-big index-${index}" data-prod-handle="${productItems.product_handle}">
                            <h4>${productItems.product_handle}</h4>
                            <p>We didn't find the Product...</p> 
                          </div>`;
        $(`.product-data-wrapper .look-product-block`).html(productHtml);
        $(".loader-icon").addClass("hidden");
        $(".product-data-wrapper").removeClass("hidden");
        $(`.product-data-wrapper .look-product-block`).prepend(`<h2 class="border-heading title">Your Assigned Look</h2>`);
        $(".order-footer").hide();
      }
    });
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
        htmlBlock += `<p class="text_center">We did not find any looks you have been assigned!</p>`;
        $(".mywedding_section_wrap .not-found-assigned-look-back").html(htmlBlock).removeClass("hidden");
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
                              <div class="tooltip-main upper-side-open question-tooltip">
                                <i class="far fa-question-circle"></i>
                                <p class="information_content">
                                  <b>The Event Host has prepaid for your look!</b> Proceed to enter your shipping information.
                                </p>
                              </div>
                              <div>Subtotal:</div> <h3 class="price-number">$304.98</h3>
                            </div>
                            <div class="alerts-part fit-finder-alert-msg">
                              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
                              <div class="alerts-info">
                                <p class="alerts-title">Sizing Information Required</p>
                                <p class="alerts-content">Before you're able to checkout, we will need to know your size for the items above, To find your perfect fit, please use our <button class="invited-event-fit-finder-button link">Fit Finder <i class="fas fa-arrow-right"></i></button></p>
                              </div>
                            </div>
                            <div class="return-suit-checkout-button">
                              <div class="info-stickey-note">
                                <span class="info-icon"><i class="fas fa-info"></i></span>
                                <div class="info-note-text">
                                  <p class="note-title">Need to return your suit? </p>
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
              $(".exchange-item-link").addClass("hidden");
              clearInterval(addTocartBtnDisabled);
            }
          }, 500);
        } else {
          $(".payment_flag").attr("payment_status","pending");
          if(payBy=='Me'){
            var lookProductWrapper = setInterval(() => {
              if($(".exchange-item-link").length>0){
                // $(`.look-product-wrapper[data-product-type="jacket"], .look-product-wrapper[data-product-type="vest"], .look-product-wrapper[data-product-type="pants"], .look-product-wrapper[data-product-type="shoes"], .look-product-wrapper[data-product-type="shirt"]`).find(".exchange-item-link").removeClass('hidden');
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
              $(".exchange-item-link").addClass("hidden");
              clearInterval(proceedToCartDisabled);
            }
          }, 500);
        }
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

// theme_custom.productVariantSeledtUpdate
theme_custom.productVariantSeledtUpdate = function(){
  var target = $(".look-product-wrapper");
  $(target).each(function(){
    var varintTitle='' ;
    if($(this).find('.option1').length > 0){
      varintTitle = $(this).find('.option1').attr("data-value");
    }
    if($(this).find('.option2').length > 0){
      varintTitle = varintTitle + ' / ' + $(this).find('.option2').attr("data-value");
    }
    if($(this).find('.option3').length > 0){
      varintTitle = varintTitle + ' / ' + $(this).find('.option3').attr("data-value");
    }
    
    if ($(this).find('.prod-variant-option option').filter('[data-variant-title="'+varintTitle+'"]').length == 0) {
      $(this).removeClass("product-card-wrap")
      $(this).find(".product-info").append("<p class='error-msg' style='color:red; font-size : 14px; margin-top:5px'>"+theme_custom.productNotFoundError+"</p>");
    } else {
      $(this).find('.prod-variant-option option').removeAttr('selected').filter('[data-variant-title="'+varintTitle+'"]').attr('selected', true);
      var selectedvarId = $(this).find('.prod-variant-option').val();
      $(this).find(".prod-variant-data").attr("data-variant-id",selectedvarId).val(selectedvarId);
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
    setTimeout(() => {
      theme_custom.productVariantSeledtUpdate();
      // if($('.error-msg').length > 0 && getCookie("fit-finder") == '' || $(".payment_flag").attr("payment_status")=='pending' && $(".proceed-to-checkout").length > 0){
      //   $(".return-suit-checkout-button .button").addClass("disabled");
      // } else {
      //   $(".return-suit-checkout-button .button").removeClass("disabled");
      // }
    }, 500);
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
        $('.product-size-type-exchange').addClass('hidden');
      } else {
        $(".product-size-type-exchange-wrapper .product-size-type-exchange").removeClass("hidden");
        $(".order-footer .fit-finder-alert-msg").addClass("hidden");
        $('.product-size-type-exchange').removeClass('hidden');
        theme_custom.cartButton = '';
        $(`.look-product-wrapper[data-product-type="jacket"], .look-product-wrapper[data-product-type="vest"], .look-product-wrapper[data-product-type="pants"], .look-product-wrapper[data-product-type="shoes"], .look-product-wrapper[data-product-type="shirt"], .look-product-wrapper[data-product-type="belts"], .look-product-wrapper[data-product-type="bow ties"], .look-product-wrapper[data-product-type="hanky"], .look-product-wrapper[data-product-type="tie bar"], .look-product-wrapper[data-product-type="neckties"]`).find(".exchange-item-link").removeClass('hidden');
        // setTimeout(() => {
        //   theme_custom.fitFinderDataSet(result.data);
        // }, 1000);
      }
      if(checkPayBy=="Host" || checkPayBy=="host") {
        // $('.price-number').text(theme_custom.Shopify.formatMoney(0000, theme_custom.money_format));
        buttonHtml += `<button type="button" class="button button--primary button-lr-small-padding proceed-to-checkout ${theme_custom.cartButton}" data-text="Adding...">
                        <span class="btn-title">Proceed to Cart</span> <i class="fas fa-shopping-cart"></i>
                      </button>`;
      }  else {
        buttonHtml += `<button type="button" class="button button--primary button-lr-small-padding proceed-to-cart  ${theme_custom.cartButton}" data-text="Adding...">
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
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        $('.my-size-block-main').html(xhr.responseJSON.message);
      }
    }
  });
}

// theme_custom.getEventData
theme_custom.getEventDataForHomeTryOn = function (eventId) {
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
      "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
    },
    beforeSend: function () {
    },
    success: function (result) {
      if (result.data.events.length > 0) {
        $(".page-loader").addClass("hidden");
        $("html,body").css("overflow", "visible");
        var productDataCardArr = $(".customize-look-overview-product.product-block-var-data"),
          dataObj = {};
        theme_custom.newArray = [],
          productDataCardArr.each(function () {
            if ($(this).attr("data-variant-id") != '') {
              dataObj = {
                "product_id": $(this).attr("data-product-id"),
                "variant_id": $(this).attr("data-variant-id"),
                "product_handle": $(this).attr("data-product-handle"),
                "type": "looks"
              }
              theme_custom.newArray.push(dataObj);
            }
          })
        var dataOptionArray = result.data.events;
        var optionVal = '';
        optionVal += `<option value="">Select Event</option>`;
        for (let i = 0; i < dataOptionArray.length; i++) {
          if(dataOptionArray[i].hostedBy == "Me" || dataOptionArray[i].hostedBy == 'me'){
            optionVal += `<option value="${dataOptionArray[i].event_id}" data-member-id="${dataOptionArray[i].member_id}">${dataOptionArray[i].name}</option>`;
          }
        }
        $(".choose-an-event select#event-id").html(optionVal);
      } else {
        $(".page-loader").addClass("hidden");
        $("html,body").css("overflow", "visible");
      }
    },
    error: function (xhr, status, error) {
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.assign-member-look-popup-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
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

// theme_custom.setUrlData function
theme_custom.setUrlData = function (eventId,memberId) {
  var url_arr = [];
  $(".look-product-wrapper").each(function () {
    var productHandle = $(this).attr("data-prod-handle");
    var productVariantID = $(this).find(".prod-variant-data").attr("data-variant-id");
    var var_id;
    if (typeof productVariantID !== typeof undefined && productVariantID !== false) {
      var_id = $(this).find(".prod-variant-data").attr("data-variant-id")
    }else{
       var_id = $(this).find(".prod-variant-data").attr("data-variant-id");
    }
    var product_data_url = '';
    product_data_url = productHandle + '=' + var_id;
    url_arr.push(product_data_url)
  });
  var new_url = url_arr.join("&");
  var redirect_url = "/pages/checkout?event_id="+eventId+"&member_id="+memberId+"&"+new_url+"";
  window.location.href= redirect_url;
}

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
      // $(`.look-product-wrapper[data-prod-handle='${productHandle}']`).find(".product-size-type-exchange-wrapper").next().remove();
      $(`.look-product-wrapper[data-prod-handle='${productHandle}']`).addClass("product-card-wrap");
      $(this).closest(".product-swatch-option .error-msg").remove();
      $(this).closest(".product-swatch-option").find(".exchange-look-item").removeClass("disabled");
      if ($(".payment_flag").attr("payment_status")=='pending') {
        $(".return-suit-checkout-button .button").removeClass("disabled");
      } else {
        $(".payment-pending-message").remove();
        $(".return-suit-checkout-button .button").removeClass("disabled");
        $(this).closest(".product-swatch-option").find(".exchange-look-item").removeClass("disabled");
      }
    }
  });
$(document).ready(function () {
  var apiIdVal = window.location.search.replace('?','').split("+");
  var eventId = apiIdVal[0].replace("event_id=",'');
  theme_custom.getEventDataForHomeTryOn(eventId);

  $(document).on('change', '.choose-an-event #event-id', function() {
    var eventId = $(this).val();
    var memberId = $(this).find(':selected').attr("data-member-id");
    theme_custom.getMemberLooksData(eventId,memberId);
    $(".background-color-spacing.default-select-event-msg").addClass("hidden");

  });

  $(document).on("click",".proceed-to-checkout",function() {
    var eventId = $(this).closest(".mywedding_section_wrap").find(':selected').val();
    var memberId = $(this).closest(".mywedding_section_wrap").find(':selected').attr("data-member-id");
    theme_custom.setUrlData(eventId,memberId);
  });

  $(document).on("click", ".invited-event-fit-finder-button", function(){
    var getEventIdLink = window.location.href.split('?')[1];
    localStorage.setItem("invited-event-fit-finder-button","true");
    localStorage.setItem("home-try-on-event-url",getEventIdLink);
    window.location.href = '/pages/fit-finder';
  });
});