$(document).ready(function () {
  if (getCookie("fit-finder-data") != undefined || getCookie("fit-finder-data") != '') {
    if($(`#custom_email`).length > 0){
    $.ajax({
      url: `${theme_custom.api_base_url}/api/customer/myFit`,
      method: "GET",
      data: '',
      dataType: "json",
      headers: {
        "Authorization": `Bearer${localStorage.getItem("customerToken")}`
      },
      beforeSend: function () { },
      success: function (result) {
        if (result.success) {
          if (result.data.length > 0) {
            var jacket_size = 'NA';
            var jacket_type = 'NA';
            var jacket_allsizes = result.data[0].jacketSize;
            if (jacket_allsizes) {
              jacketType = jacket_allsizes.split(":");
              jacket_size = jacketType[0];
              if (jacketType[1] == "S") {
                jacket_type = 'Short'
              } else if (jacketType[1] == "R") {
                jacket_type = 'Regular'
              } else if (jacketType[1] == "L") {
                jacket_type = 'Long'
              }
            }
            var ff_html = '';
            if (result.data.length > 0) {
              ff_html += `<div class="ff-data jacket-wrap">
                            <strong>Jacket : </strong>
                            <span>${jacket_size} ${jacket_type}</span>
                          </div>`;
              if( result.data[0].pants_waist || result.data[0].pants_hight ){
                ff_html += `<div class="ff-data">
                              <strong>Pants : </strong>
                              <span>${result.data[0].pants_waist}x${result.data[0].pants_hight}</span>
                            </div>`;
              }
              $("#suit_fit_finder").hide();
              $("#ff-data-box").html(ff_html);
              $("#fit_finder_data_auto").show();
            }
          }
        } else {
          $("#suit_fit_finder").show();
          $("#fit_finder_data_auto").hide();
        }
      },
      error: function (xhr, status, error) {
        $("#suit_fit_finder").show();
        $("#fit_finder_data_auto").hide();
      }
    });
    } else {
    var getFitFinder = getCookie("fit-finder-data");
    if(getFitFinder){
      getFitFinder = JSON.parse(getCookie("fit-finder-data"));
      var ff_html = '';
      var jacket_size = 'NA';
      var jacket_type = 'NA';
      var jacket_allsizes = getFitFinder.jacketSize;
      if(jacket_allsizes){
        jacketType = jacket_allsizes.split(":");
        jacket_size = jacketType[0];
        if (jacketType[1] == "S") {
          jacket_type = 'Short'
        } else if (jacketType[1] == "R") {
          jacket_type = 'Regular'
        } else if (jacketType[1] == "L") {
          jacket_type = 'Long'
        }
      }
      setTimeout(() => {      
        $(`.edit-item-popup[data-product-type="jacket"] select[data-name="chest size"]`).val(jacket_size);
        $(`.edit-item-popup[data-product-type="jacket"] select[data-name="style"]`).val(jacket_type);
        $(`.edit-item-popup[data-product-type="vest"] select[data-name="chest size"]`).val(jacket_size);
        $(`.edit-item-popup[data-product-type="vest"] select[data-name="style"]`).val(jacket_type);
        $(`.edit-item-popup[data-product-type="pants"] select[data-name="waist"]`).val(getFitFinder.pants_waist);
        $(`.edit-item-popup[data-product-type="pants"] select[data-name="length"]`).val(getFitFinder.pants_hight);
      },200);
      ff_html += `<div class="ff-data jacket-wrap">
                      <strong>Jacket : </strong>
                      <span>${jacket_size} ${jacket_type}</span>
                  </div>`;
      if( getFitFinder.pants_waist || getFitFinder.pants_hight ){
        ff_html += `<div class="ff-data">
                        <strong>Pants : </strong>
                        <span>${getFitFinder.pants_waist}x${getFitFinder.pants_hight}</span>
                    </div>`;
      }
      $("#suit_fit_finder").hide();
      $("#ff-data-box").html(ff_html);
      $("#fit_finder_data_auto").show();
    }else{
      $("#suit_fit_finder").show();
      $("#fit_finder_data_auto").hide();
    }
  }
  }
});
$(document).on("click", ".product-form__submit", function (e) {
  e.preventDefault();
  var button = $(this);
  button.addClass(`disabled`);
  var btnText = button.find(".btn-title").attr("data-text");
  var current_product = button.parents('.product__info-container');
  var variantTitle = '', varId;
  button.find(".btn-title").text(btnText);
  if (current_product.find('.swatch-product-form[data-option-index="0"] input:checked').length > 0) {
    variantTitle = current_product.find('.swatch-product-form[data-option-index="0"] input:checked').val();
  }
  if (current_product.find('.swatch-product-form[data-option-index="1"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + current_product.find('.swatch-product-form[data-option-index="1"] input:checked').val();
  }
  if (current_product.find('.swatch-product-form[data-option-index="2"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + current_product.find('.swatch-product-form[data-option-index="2"] input:checked').val();
  }
  varId = current_product.find(`.single-option-selector option[data-var-title="${variantTitle}"]`).attr('data-v-id');
  var item = {};
  var selectedvar = $(`[name="id"]`).val();
  var target_variant =  $(`.single-option-selector option[data-v-id="${selectedvar}"]`).attr(`data-title`);
  if ($(`.product-form__submit`).hasClass(`combo-product`)) {
    if($(`.jacket-pant-saparate-wrapper[data-product-type="pants"]`).length > 0){
      var pants_selected_var = $(`.jacket-pant-saparate-wrapper[data-product-type="pants"]`).find(`.single-option-selector`).val();
      item = [
        {
          "id": varId,
          "quantity": 1,
          "properties": {
            "combo-variant-title" : target_variant,
            "pant-variant-title" : $(`.jacket-pant-saparate-wrapper[data-product-type="pants"]`).find(`.single-option-selector option[data-v-id="${pants_selected_var}"]`).attr(`data-title`)
          }
        },
        {
          "id": pants_selected_var,
          "quantity": 1,
          "properties": {
            "combo-variant-title" : target_variant,
            "pant-variant-title" : $(`.jacket-pant-saparate-wrapper[data-product-type="pants"]`).find(`.single-option-selector option[data-v-id="${pants_selected_var}"]`).attr(`data-title`)
          }
        }
      ]
    };
    data = {
      items: item
    };
    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
      dataType: 'json',
      success: function () {
        button.find(".btn-title").text("Added to Cart");
        window.location.href = "/cart";
      },
      error: function (xhr, status, error) {
        button.find(".btn-title").text("Add To Cart");
        button.removeClass("disabled");
      }
    });
  } else {
    item = {
      "id": varId,
      "quantity": 1,
      "properties": {
        "saparate-product": "saparate-product"
      }
    };
    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: item,
      dataType: 'json',
      success: function () {
        button.find(".btn-title").text("Added to Cart");
        window.location.href = "/cart";
      },
      error: function (xhr, status, error) {
        button.find(".btn-title").text("Add To Cart");
        button.removeClass("disabled");
      }
    });
  }
  
});
$(document).on("click", ".edit-item-button", function () {
  var target = $(this).closest(".upsell-product-wrap").find(".edit-item-popup");
  var option1 = $(this).closest(".upsell-product-wrap").find(".option-1").text().toLocaleLowerCase(),
      option2 = $(this).closest(".upsell-product-wrap").find(".option-2").text().toLocaleLowerCase(),
      option3 = $(this).closest(".upsell-product-wrap").find(".option-3").text().toLocaleLowerCase();
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
$(document).on("click", ".edit-item-btn", function () {
  var target = $(this).closest(".product-suit-wrapper").find(".edit-item-popup");
  var option1 = $(this).closest(".product-data-card").find(".option-1").text().toLocaleLowerCase(),
    option2 = $(this).closest(".product-data-card").find(".option-2").text().toLocaleLowerCase(),
    option3 = $(this).closest(".product-data-card").find(".option-3").text().toLocaleLowerCase();
  if (option1 != '') {
    target.find(`[data-option-index="0"]`).find(`[type="radio"][data-value="${option1}"]`).prop("checked", true);
  }
  if (option2 != '') {
    target.find(`[data-option-index="1"]`).find(`[type="radio"][data-value="${option2}"]`).prop("checked", true);
  }
  if (option3 != '') {
    target.find(`[data-option-index="2"]`).find(`[type="radio"][data-value="${option3}"]`).prop("checked", true);
  }
  $.fancybox.open(target);
});
$(document).on("click", ".pdp-updates-button button", function () {
  var productHandle = $(this).closest(".edit-item-popup").data("product-handle"),
    itemParent = $(".upsell-product-wrap[data-product-handle='" + productHandle + "']"),
    parent = $(this).closest('.edit-item-popup'),
    variantTitle = '',
    currentVariantVal,
    dataHandle = parent.data("product-handle"),
    v_price, v_img,
    variant_info_wrap = $(".variant-info-wrap[data-product-handle='" + productHandle + "']");
  if (parent.find('[data-option-index="0"] input:checked').length > 0) {
    variantTitle = parent.find('[data-option-index="0"] input:checked').val();
  }
  if (parent.find('[data-option-index="1"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
  }
  if (parent.find('[data-option-index="2"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
  }
  var productVariantTitle = [];
  var selectOptionVar = $(this).closest(".edit-item-popup").find('.single-option-selector option');
  selectOptionVar.each(function () {
    productVariantTitle.push($(this).attr("data-var-title"));
  });
  if ($.inArray(variantTitle, productVariantTitle) == -1) {
    $(this).find(".loading-overlay").addClass("hidden");
    $(this).closest(".edit-item-popup").find(".error-message").text('').hide();
    $(this).closest(".edit-item-popup").find(".error-message").text(theme_custom.productNotFoundError).show();
  } else {
    parent.find('.single-option-selector option[data-title="' + variantTitle + '"]').prop("selected", true);
    currentVariantVal = parent.find('.single-option-selector option[data-title="' + variantTitle + '"]').attr('value');
    v_price = parent.find('.single-option-selector option[data-title="' + variantTitle + '"]').attr('data-v-price');
    v_img = parent.find('.single-option-selector option[data-title="' + variantTitle + '"]').attr('data-variant-image');
    if (parent.find('[data-option-index="0"] input:checked').length > 0) {
      itemParent.find(".variant-title .option-1").text(parent.find('[data-option-index="0"] input:checked').val());
      variant_info_wrap.find(".option-title .option-1").text(parent.find('[data-option-index="0"] input:checked').val());
    }
    if (parent.find('[data-option-index="1"] input:checked').length > 0) {
      itemParent.find(".variant-title .option-2").text(parent.find('[data-option-index="1"] input:checked').val());
      variant_info_wrap.find(".option-title .option-2").text(parent.find('[data-option-index="1"] input:checked').val());
    }
    if (parent.find('[data-option-index="2"] input:checked').length > 0) {
      itemParent.find(".variant-title .option-3").text(parent.find('[data-option-index="2"] input:checked').val());
      variant_info_wrap.find(".option-title .option-3").text(parent.find('[data-option-index="2"] input:checked').val());
    }
    $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".looks-product-var-id").val(currentVariantVal);
    $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-price .money').text(theme_custom.Shopify.formatMoney(v_price, theme_custom.money_format));
    $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-image img').attr("src", v_img).attr("srcset", v_img);
    $(`.variant-info-wrap`).removeClass(`hidden`);
    $(`.edit-item-btn`).text(`Edit Size`);
    if ($(".error-message.error-show").length > 0) {
      $(".product-form__submit").addClass("disabled");
    } else {
      $(".product-form__submit").removeClass("disabled");
    }
    parent.find(".pdp-updates-button").find(".button").addClass("disabled");
    parent.find(".fancybox-close-small").click();
  }
})

theme_custom.getVariantDataEditItemPopup = function (parentEl) {
  var variantDataGetArr = [];
  var parent = parentEl,
    productId = parent.attr("data-product-id");

  var variantTitle = '', variantId, variantImage, variantPrice, selectedOption;
  if (parent.find('[data-option-index="0"] input:checked').length > 0) {
    variantTitle = parent.find('[data-option-index="0"] input:checked').val();
  }
  if (parent.find('[data-option-index="1"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
  }
  if (parent.find('[data-option-index="2"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
  }
  selectedOption = parent.find(`[data-product-id="${productId}"][data-var-title="${variantTitle}"]`);
  $(`[data-product-id="${productId}"]`).attr('selected', false);
  selectedOption.attr('selected', true);
  variantPrice = selectedOption.attr('data-v-price');
  variantId = selectedOption.attr('value');
  variantImage = selectedOption.attr('data-variant-image');
  variantQuantity = selectedOption.attr('data-v-inventory');
  variantInventoryPolicy = selectedOption.attr('data-inventory-policy');
  variantDataGetArr['productId'] = productId;
  variantDataGetArr['variantId'] = variantId;
  variantDataGetArr['variantImage'] = variantImage;
  variantDataGetArr['variantPrice'] = variantPrice;
  variantDataGetArr['variantTitle'] = variantTitle;
  variantDataGetArr['variantQty'] = variantQuantity;
  variantDataGetArr['variantInventoryPolicy'] = variantInventoryPolicy;
  parent.find('.looks-product-var-id').val(variantId);
  parent.find(`.single-option-selector option[data-var-title="${variantTitle}"]`).prop("selected", true)
  var targetElment = parent.attr("data-product-handle");
  $(`.product-data-card-wrap.product-block-item[data-product-handle="${targetElment}"]`).find(`.product-image img`).attr("src", 'https:' + variantImage).attr("srcset", '');
  if (!variantId) {
    parent.find(".pdp-updates-button .button").addClass("disabled").find(".button-label").text("Unavailable");
    parent.find(".error-message").text('Product is not available for this specific combination.').show().addClass("error-show");
  } else {
    if (variantInventoryPolicy == 'continue') {
      parent.find('.pdp-updates-button button').removeClass('disabled').find(".button-label").text("Update");
      parent.find(".error-message").text('').hide().removeClass("error-show");
    } else {
      if (parseInt(variantQuantity) > 0) {
        parent.find('.pdp-updates-button button').removeClass('disabled').find(".button-label").text("Update");
        parent.find(".error-message").text('').hide().removeClass("error-show");
      } else {
        parent.find(".pdp-updates-button .button").addClass("disabled").find(".button-label").text("Out of Stock");
        parent.find(".error-message").text('This Variant is out of stock. Please choose another variant.').show().addClass("error-show");
      }
    }
  }
  return variantDataGetArr;
}

$(document).on("change", ".swatch-element [type='radio']", function () {
  var parent = $(this).closest('.edit-item-popup');
  theme_custom.getVariantDataEditItemPopup(parent);
})
$(document).on("click",".frequently-bought-together .checkbox",function(){
  var target_price, final_price;
  if($(this).hasClass("checked")){
    $(this).removeClass("checked");
    target_price = parseInt($(`.frequently-bought-together .footer-wrap .price-wrap .price`).attr(`data-price`));
    final_price = target_price - parseInt($(this).closest(`.upsell-product-wrap`).find(`.product-price .money`).attr("data-price"));
  } else {
    $(this).addClass("checked");
    target_price = parseInt($(`.frequently-bought-together .footer-wrap .price-wrap .price`).attr(`data-price`));
    final_price = target_price + parseInt($(this).closest(`.upsell-product-wrap`).find(`.product-price .money`).attr("data-price"));
  }
  if($(`.frequently-bought-together .checkbox.checked`).length >= 1){
    $(`.fbt-add-to-cart`).removeClass("disabled");
  } else {
    $(`.fbt-add-to-cart`).addClass("disabled");
  }  
  $(".frequently-bought-together .footer-wrap .price-wrap .price").attr("data-price", final_price).text(theme_custom.Shopify.formatMoney(final_price, theme_custom.money_format));
})