$.map(productItemsArr, function(productItems,index) {
  jQuery.ajax({
    type: 'GET',
    dataType: 'json',
    // url: `/products/${productItems.product_handle}.json`,
    url : `/products/${productItems.product_handle}?view=product-get-data`,
    success: function(response) {
      if(response.product.options){
        var productOption = response.product.options;
        var customSwatchWap = '';
        for (let optionVal = 0; optionVal < productOption.length; optionVal++) {
          var element = productOption[optionVal];
          var customSwatch = '';
          var elementValues = element.values;
          for (let seatchVal = 0; seatchVal < elementValues.length; seatchVal++) {
            var swatchValue = elementValues[seatchVal];
            if(productOption[optionVal].name == 'Color' || productOption[optionVal].name == 'color'){
              var color_name = swatchValue.toLowerCase().replace(" ","-");
              customSwatch += `<div data-title="${swatchValue}" data-value="${swatchValue}" class="swatch-element-item ${swatchValue}">
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
          if(!value.title == ''){
            if(key == 0){
              prodOptionArray += `<option value="${value.id}" data-product-id="${response.product.id}" data-variant-title="${value.title}" selected="selected">${value.title}</option>`;
            } else {
              prodOptionArray += `<option value="${value.id}" data-product-id="${response.product.id}" data-variant-title="${value.title}">${value.title}</option>`;
            }
          }
        });
        $.each(response.product.variants, function (key, value) {
          if(value.id == parseInt(productItems.variant_id)){
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
            if(productType == 'jacket' || productType == 'vest' || productType == 'shoes' || productType == 'pants' || productType == 'shirt'){
              edit_item_hidden = '';
            } else {
              edit_item_hidden = 'hidden';
            }
            productSizeTypeExchangeData = `<div class="product-size-type-exchange-wrapper">
                                        <p class="product-size-type-exchange hidden">
                                          <span class="size-wrap">${optionfirst}</span>
                                          <span class="size-wrap">${optionSecond}</span>
                                          <span class="size-wrap">${optionThird}</span>
                                          <span class="exchange-item-link link hidden"><span class="break">|</span> Edit Size</span>
                                        </p>
                                        <div class="product-swatch-option ${productType}" data-product-handle="${productHandleVal}">
                                          <div class="product-swatches-main"><h4>${response.product.title}</h4>${customSwatchWap}</div>
                                          <select class="prod-variant-option hidden">${prodOptionArray}</select>
                                          <button type="button" name="exchange-look-item" class="button button--full-width button--primary exchange-look-item disabled" data-text="Updating..">Update</button>
                                        </div>
                                      </div>`;
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
                              <h4>${response.product.title}</h4>
                              ${productSizeTypeExchangeData}
                            </div>
                            <div class="product-price">
                              <p class="price">${productPrice}</p>
                            </div>
                          </div>`;
            subTotal = subTotal + parseInt(subtotalVarPrice)*100;
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
      $(`.product-data-wrapper .look-product-block .pants-prod-data-wrap`).html(pantProductHTML);
      productSubTotalPrice = theme_custom.Shopify.formatMoney((subTotal)/100, theme_custom.money_format);
      $(`.product-data-wrapper .order-footer .price-number`).text(productSubTotalPrice);
      // $(`.product-data-wrapper .look-product-block`).prepend(`<h2 class="border-heading title">Your Assigned Look</h2>`);
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