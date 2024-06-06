class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-items').updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();

    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    if (event.target.dataset.index) {
      var eventTargetValue = Math.ceil(parseInt(event.target.value));
      event.target.value = eventTargetValue;
      this.updateQuantity(event.target.dataset.index, eventTargetValue, document.activeElement.getAttribute('name'));
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      }
    ];
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        this.classList.toggle('is-empty', parsedState.item_count === 0);
        document.getElementById('main-cart-footer')?.classList.toggle('is-empty', parsedState.item_count === 0);

        this.getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        }));
        $(".totals__subtotal-value,.totals__subtotal-value.total-value").text(theme_custom.Shopify.formatMoney(parsedState.items_subtotal_price, theme_custom.money_format));
        if(parsedState.item_count == 0) {
          $(`.cart-fit-finder-wrapper`).remove();
        }
        var cart_items = parsedState.items;
        var fit_finder_data_enable = false;
        $(cart_items).each(function(index, value) {
          var check_product_type = value.product_type;
          if (check_product_type.includes("Jacket") || check_product_type.includes("Pants") || check_product_type.includes("Vest")) {
            // String contains "a", continue to next iteration
            fit_finder_data_enable = true;
            return true;
          }
        });
        if(fit_finder_data_enable) {
          $(`.order-details-wrapper`).show();
          $(`.contiune-payment`).removeClass(`hidden`);
          $(`.cart__ctas.checkout_btn_link`).addClass(`hidden`)
        } else {
          $(`.order-details-wrapper`).hide();
          $(`.contiune-payment`).addClass(`hidden`);
          $(`.cart__ctas.checkout_btn_link`).removeClass(`hidden`)
        }
        this.updateLiveRegions(line, parsedState.item_count);
        document.getElementById(`CartItem-${line}`)?.querySelector(`[name="${name}"]`)?.focus();
        this.disableLoading();
      }).catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        document.getElementById('cart-errors').textContent = window.cartStrings.error;
        this.disableLoading();
      });
  }

  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      document.getElementById(`Line-item-error-${line}`)
        .querySelector('.cart-item__error-text')
        .innerHTML = window.cartStrings.quantityError.replace(
          '[quantity]',
          document.getElementById(`Quantity-${line}`).value
        );
    }

    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    document.getElementById('main-cart-items').classList.add('cart__items--disabled');
    this.querySelectorAll('.loading-overlay:not(.remove_item):not(.upsell_loading)')[line - 1].classList.remove('hidden');
    this.querySelectorAll('.loading-overlay.remove_item')[line - 1].classList.remove('hidden');
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading() {
    document.getElementById('main-cart-items').classList.remove('cart__items--disabled');
  }
}

customElements.define('cart-items', CartItems);

// Add to cart AJAX API
theme_custom.addToCart = function(variantId,qty,product_has_saparate){
  if(product_has_saparate == "saparate_product") {
    var items = {
      "quantity" : qty,
      "id" : variantId,
      "properties": {
        "saparate-product": "saparate-product"
      }
    }
  } else {
    var items = {
      "quantity" : qty,
      "id" : variantId
    }
  }
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: items,
    dataType: 'json', 
    success: function () { 
      location.reload();
    }
  });
}
// Upsell Product add to cart
$(document).on('click', '.upsell_product_added', function(){
  var vId = $(this).closest(".upsell-product-form").find(".upsellProdId").val(),
      qty = 1;
  $(this).find(".loading-overlay").removeClass("hidden");
  theme_custom.addToCart(vId,qty);
})
// Update cart 
$(document).on('click', '.updates-button button', function(){
  var product_has_saparate = $(this).closest(`.edit-item-popup`).attr("data-product-has-saparate");
  var parent = $(this).closest(".edit-item-popup"),
      variantId = $(this).closest('.edit-item-popup').data("line-item-id");
      targetProduct = $(this).closest(".edit-item-popup").attr("data-product-handle");  
  theme_custom.qty = parseInt($(`.cart-item[line-item-product-handle='${targetProduct}']`).find(".quantity__input").val());  
  if(parent.find('[data-option-index="0"] input:checked').length > 0){
    variantTitle = parent.find('[data-option-index="0"] input:checked').val();
  }
  if(parent.find('[data-option-index="1"] input:checked').length > 0){
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
  }
  if(parent.find('[data-option-index="2"] input:checked').length > 0){
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
  }
  updateVid = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('value');
  updatedTitle = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('data-variant-title');
  $(this).find(".loading-overlay").removeClass("hidden");
  if(!updateVid){
    $(this).find(".loading-overlay").addClass("hidden");
    $(this).closest(".edit-item-popup").find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
  } else {
    jQuery.ajax({
      type: 'POST',
      url: '/cart/change.js', 
      data: { 
        quantity: 0,
        id: variantId 
      }, 
      dataType: 'json',
      success: function() {
        theme_custom.addToCart(updateVid,theme_custom.qty,product_has_saparate);
      },
      error: function(xhr, status, error) {
        button.find(".btn-title").text("Update to cart");
        alert(xhr.responseJSON.description);
      }
    });
  }  
}) 
// remove-upsell-item
$(document).on("click", ".remove-upsell-item", function(){
  $(this).closest(".also-like-part").remove()
})
// edit-item-title
$(document).on("click", ".edit-item-title", function(){
  var target = $(this).closest(".cart-item").find(".edit-item-popup");
  var option1 = $(this).closest(".cart-item").find(".option-1").text().toLocaleLowerCase(),
      option2 = $(this).closest(".cart-item").find(".option-2").text().toLocaleLowerCase(),
      option3 = $(this).closest(".cart-item").find(".option-3").text().toLocaleLowerCase();
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
// Edit suit-item product
$(document).on("click", ".custom-edit-item", function(){
  var target = $(this).closest(".suit-product-info").attr("data-product-handle");
  var variantTitle = $(this).attr("data-item-variant-title");
  var pantsVariantTitleName = $(this).closest('.cart-item').attr("data-item-variant-title-name");
  var jacketItemTitle = $(this).closest('.cart-item').attr("data-jacket-item-variant-title");
  var editItemPopup = $(`.cart-item[line-item-product-handle="${target}"][data-item-variant-title="${variantTitle}"][data-pants-item-variant-title="${jacketItemTitle}"]`).find(".edit-item-popup");
  var pantsOption = pantsVariantTitleName.split(' / ');
  var optionOne = pantsOption[0],
      optionSecond = pantsOption[1],
      optionThird = pantsOption[2];
  if($(`[data-option-index="0"]`).length > 0 && optionOne != ''){
    $(editItemPopup).find(`[data-option-index="0"] label[data-option-value="${optionOne}"]`).click()
  }
  if ($(`[data-option-index="1"]`).length > 0 && optionSecond != '') {
    $(editItemPopup).find(`[data-option-index="1"] label[data-option-value="${optionSecond}"]`).click()
  }
  if ($(`[data-option-index="2"]`).length > 0 && optionThird != '') {
    $(editItemPopup).find(`[data-option-index="2"] label[data-option-value="${optionThird}"]`).click()
  }
  $.fancybox.open(editItemPopup);
});
// suit qty plus minus cusom function
$(document).on(`click`, `.custom-qty-button .quantity__button[name="minus"]`, function(){
  var jacketVariantTitle = $(this).closest(`.cart-item`).attr(`data-jacket-variant`),
      pantsVariantTitle = $(this).closest(`.cart-item`).attr(`data-pants-variant`);
  var jacketId = $(this).closest(`.cart-item`).attr(`data-line-item-key`),
      pantsId = $(`.cart-item[line-item-product-type="pants"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`);  
  quantity = parseInt($(this).closest(".cart-item").find(`.quantity__input_custom`).val())-1;
  $(".page-loader").removeClass("hidden");
  var data = `updates[${jacketId}]=${quantity}&updates[${pantsId}]=${quantity}`;
  $.ajax({
    type: 'POST',
    url: '/cart/update.js',
    data: data,
    success: function(response) {
      setTimeout(() => {
        $(".removing-combine-message").remove();
        $(".page-loader").addClass("hidden");
        window.location.reload();
      }, 5000);
    },
    error: function(XMLHttpRequest) {
      alert('(' + XMLHttpRequest.responseText + ')');
    }
  });
})
// suit qty plus minus cusom function
$(document).on(`click`, `.custom-qty-button .quantity__button[name="plus"]`, function(){
  var jacketVariantTitle = $(this).closest(`.cart-item`).attr(`data-jacket-variant`),
      pantsVariantTitle = $(this).closest(`.cart-item`).attr(`data-pants-variant`);
  var jacketId = $(this).closest(`.cart-item`).attr(`data-line-item-key`),
      pantsId = $(`.cart-item[line-item-product-type="pants"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`);  
  quantity = parseInt($(this).closest(".cart-item").find(`.quantity__input_custom`).val())+1;
  var jacketTotalQty = parseInt($(`.cart-item[data-line-item-key="${jacketId}"]`).attr(`data-item-variant-qty`)),
      pantsTotalQty = parseInt($(`.cart-item[line-item-product-type="pants"][data-line-item-key="${pantsId}"]`).attr(`data-item-variant-qty`));
  var jacketItemTitle = $(`.cart-item[data-line-item-key="${jacketId}"]`).attr(`data-jacket-item-variant`),
      pantsItemTitle = $(`.cart-item[line-item-product-type="pants"][data-line-item-key="${pantsId}"]`).attr(`data-pants-item-variant`);
  if(jacketTotalQty >= quantity && pantsTotalQty >= quantity){
    $(".page-loader").removeClass("hidden");
    var data = `updates[${jacketId}]=${quantity}&updates[${pantsId}]=${quantity}`;
    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: data,
      success: function(response) {
        setTimeout(() => {
          $(".removing-combine-message").remove();
          $(".page-loader").addClass("hidden");
          window.location.reload();
        }, 5000);
      }
    });
  } else {
    if(jacketTotalQty < quantity){
      alert(`Oops! We can't add more. We only have ${jacketTotalQty} Qty left for the Jacket ${jacketItemTitle} you are trying to purchase!`)
    } else if(pantsTotalQty < quantity){
      alert(`Oops! We can't add more. We only have ${pantsTotalQty} Qty left for the Pants ${pantsItemTitle} you are trying to purchase!`)
    }
  }
})
// remove combine jacket / pants item
$(document).on("click", ".suit-product-remove", function(){
  var jacketVariantTitle = $(this).closest(`.cart-item`).attr(`data-jacket-variant`),
      pantsVariantTitle = $(this).closest(`.cart-item`).attr(`data-pants-variant`);

  var jacketId = $(this).closest(`.cart-item`).attr(`data-line-item-key`),
      pantsId = $(`.cart-item[line-item-product-type="pants"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`);  
  
  var data = `updates[${jacketId}]=0&updates[${pantsId}]=0`;
  $(".page-loader").removeClass("hidden");
  $.ajax({
    type: 'POST',
    url: '/cart/update.js',
    data: data,
    success: function(response) {
      var responseJson = JSON.parse(response);
      setTimeout(() => {
        $(".cart-count-bubble span[aria-hidden='true']").text(responseJson.item_count);
        $(".cart-count-bubble .visually-hidden").text(responseJson.item_count+' items');
        $(".totals__subtotal-value").text(theme_custom.Shopify.formatMoney(responseJson.original_total_price, theme_custom.money_format));
        $(".removing-combine-message").remove();
        $(".page-loader").addClass("hidden");
        location.reload();
        if(responseJson.item_count==0){
          $('cart-items,#main-cart-footer').addClass("is-empty");
        }
      }, 5000);
    },
    error: function(XMLHttpRequest) {
      alert('(' + XMLHttpRequest.responseText + ')');
    }
  });
})
$(document).on("click",".contiune-payment",function(){
  var error_count = 0;
  if($(`.height_val`).val() == ''){
    $(`.height-input`).find(`.error-message`).show();
    error_count = 1;
  }  else {
    $(`.height-input`).find(`.error-message`).hide();
  }
  if($(`#weight`).val() == ''){
    $(`.weight-input`).find(`.error-message`).show();
    error_count = 1;
  }  else {
    $(`.weight-input`).find(`.error-message`).hide();
  }
  if($(`#pant-waist`).val() == ''){
    $(`.pant-waist-wrap`).find(`.error-message`).show();
    error_count = 1;
  }  else {
    $(`.pant-waist-wrap`).find(`.error-message`).hide();
  }
  if(error_count == 1 ){
    return;
  } else {
    var button = $(this); 
    $(this).addClass('disabled').find(`span`).text(button.find(`span`).attr('data-text'));
    var data = {
      attributes:{
        "height_val" : $(`.height_val`).val(),
        "weight" : $(`#weight`).val(),
        "Age" : $(`#age`).val(),
        "pant-waist" : $(`#pant-waist`).val(),
        "pant-inseam-length" : $(`#pant-inseam-length`).val()
      }
    };
    // Make AJAX request to update the cart note
    $.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: data,
      dataType: 'json',
        success: function(response) {
        window.location.href = '/checkout';
      },
      error: function(xhr, status, error) {
        console.error('Error updating cart:', error);
      }
    });
  }
});
$(document).on("keyup","#weight",function(){
  $(this).closest(`.weight-input`).find(`.error-message`).hide();
  if($(this).val() < 90 && $(this).val() != ''){
    $(`.confirm-weight-msg.less-then-weight`).removeClass(`hide`);
  } else if($(this).val() > 400){
    $(`.confirm-weight-msg.more-then-weight`).removeClass(`hide`);
  } else {
    $(`.confirm-weight-msg`).addClass(`hide`);
    theme_custom.recommandation_size();
  }
})
$(document).on("change",`.height_val`,function(){
  if($(this).val() != ''){
    $(this).closest(`.height-input`).find(`.error-message`).removeClass('hide').hide();
    setTimeout(() => {
      theme_custom.recommandation_size();
    }, 500);
  } else {
    $(this).closest(`.height-input`).find(`.error-message`).addClass('hide').show();
  }
})
$(`#pant-waist`).on("change",function(){
  if($(this).val() != ''){
    $(this).closest(`.pant-waist-wrap`).find(`.error-message`).removeClass('hide').hide();
  } else {
    $(this).closest(`.pant-waist-wrap`).find(`.error-message`).addClass('show').show();
  }
})

theme_custom.recommandation_size = function(){
  var userNewHeight = $(`.height_val`).val(), userWeight = $(`#weight`).val(), recommand_jacket_size = "0:0", recommand_pants_size = "0";
  $(`.recommand-error-message`).text(``).hide();
  if(userNewHeight == ''){
    $(`.height-input .error-message`).show();
    return false;
  }
  if(userWeight == ''){
    $(`.weight-input .error-message`).show();
    return false;
  }
  if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 1 && userWeight <= 124)) {
    recommand_jacket_size = "32:S"
    recommand_pants_size = "26x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 125 && userWeight <= 140)) {
    recommand_jacket_size = "34:S"
    recommand_pants_size = "28x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 141 && userWeight <= 160)) {
    recommand_jacket_size = "36:S"
    recommand_pants_size = "30x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 161 && userWeight <= 180)) {
    recommand_jacket_size = "38:S"
    recommand_pants_size = "32x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 181 && userWeight <= 195)) {
    recommand_jacket_size = "40:S"
    recommand_pants_size = "34x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 196 && userWeight <= 210)) {
    recommand_jacket_size = "42:S"
    recommand_pants_size = "36x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 211 && userWeight <= 225)) {
    recommand_jacket_size = "44:S"
    recommand_pants_size = "38x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.08) && (userWeight >= 226 && userWeight <= 240)) {
    recommand_jacket_size = "46:S"
    recommand_pants_size = "40x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.08) && (userWeight >= 241 && userWeight <= 250)) {
    recommand_jacket_size = "48:S"
    recommand_pants_size = "42x30";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.08) && (userWeight >= 251 && userWeight <= 260)) {
    recommand_jacket_size = "50:S"
    recommand_pants_size = "44x30";
  } else if ((userNewHeight >= 5.10 && userNewHeight <= 9.0) && (userWeight >= 1 && userWeight <= 140)) {
    recommand_jacket_size = "34:R"
    recommand_pants_size = "28x32";
  } else if ((userNewHeight >= 5.10 && userNewHeight <= 9.0) && (userWeight >= 141 && userWeight <= 160)) {
    recommand_jacket_size = "36:R"
    recommand_pants_size = "30x32";
  } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 161 && userWeight <= 180)) {
    recommand_jacket_size = "38:R"
    recommand_pants_size = "32x32";
  } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 181 && userWeight <= 195)) {
    recommand_jacket_size = "40:R"
    recommand_pants_size = "34x32";
  } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 196 && userWeight <= 210)) {
    recommand_jacket_size = "42:R"
    recommand_pants_size = "36x32";
  } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 211 && userWeight <= 225)) {
    recommand_jacket_size = "44:R"
    recommand_pants_size = "38x32";
  } else if ((userNewHeight >= 5.09 && userNewHeight <= 6.01) && (userWeight >= 226 && userWeight <= 240)) {
    recommand_jacket_size = "46:R"
    recommand_pants_size = "40x32";
  } else if ((userNewHeight >= 5.09 && userNewHeight <= 6.01) && (userWeight >= 241 && userWeight <= 250)) {
    recommand_jacket_size = "48:R"
    recommand_pants_size = "42x32";
  } else if ((userNewHeight >= 5.09 && userNewHeight <= 6.01) && (userWeight >= 251 && userWeight <= 260)) {
    recommand_jacket_size = "50:R"
    recommand_pants_size = "44x32";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 261 && userWeight <= 270)) {
    recommand_jacket_size = "52:R"
    recommand_pants_size = "44x32";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 271 && userWeight <= 280)) {
    recommand_jacket_size = "54:R"
    recommand_pants_size = "46x32";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 281 && userWeight <= 290)) {
    recommand_jacket_size = "56:R"
    recommand_pants_size = "48x32";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 291 && userWeight <= 300)) {
    recommand_jacket_size = "58:R"
    recommand_pants_size = "50x32";
  } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 301 && userWeight <= 999)) {
    recommand_jacket_size = "60:R"
    recommand_pants_size = "52x32";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 165 && userWeight <= 185)) {
    recommand_jacket_size = "38:L"
    recommand_pants_size = "32x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 186 && userWeight <= 199)) {
    recommand_jacket_size = "40:L"
    recommand_pants_size = "34x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 200 && userWeight <= 212)) {
    recommand_jacket_size = "42:L"
    recommand_pants_size = "36x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 213 && userWeight <= 228)) {
    recommand_jacket_size = "44:L"
    recommand_pants_size = "38x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 229 && userWeight <= 240)) {
    recommand_jacket_size = "46:L"
    recommand_pants_size = "40x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 241 && userWeight <= 250)) {
    recommand_jacket_size = "48:L"
    recommand_pants_size = "42x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 251 && userWeight <= 260)) {
    recommand_jacket_size = "50:L"
    recommand_pants_size = "44x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 261 && userWeight <= 270)) {
    recommand_jacket_size = "52:L"
    recommand_pants_size = "44x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 271 && userWeight <= 280)) {
    recommand_jacket_size = "54:L"
    recommand_pants_size = "46x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 281 && userWeight <= 290)) {
    recommand_jacket_size = "56:L"
    recommand_pants_size = "48x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 291 && userWeight <= 300)) {
    recommand_jacket_size = "58:L"
    recommand_pants_size = "50x34";
  } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 301 && userWeight <= 999)) {
    recommand_jacket_size = "60:L"
    recommand_pants_size = "52x34";
  }
  
  // jacket Size
  var jacket_size = recommand_jacket_size.split(':');
  if (jacket_size[1] == "S") {
    jacket_type = 'Short'
  } else if (jacket_size[1] == "R") {
    jacket_type = 'Regular'
  } else if (jacket_size[1] == "L") {
    jacket_type = 'Long'
  }           
  var ff_html = `<div class="ff-data jacket-wrap"><strong>Jacket : </strong><span>${jacket_size[0]} ${jacket_type}</span></div>`;''

  // Panst size 
  var pants_size = recommand_pants_size.split('x');
  var pants_hight = pants_size[1];
  var pants_waist = pants_size[0];
  $(`#pant-waist`).val(pants_waist).change();
  ff_html += `<div class="ff-data"><strong>Pants : </strong><span>${pants_waist} x ${pants_hight}</span></div>`;
 
  $(".fit-finder-output #ff-data-box").html(ff_html);
  $(`.fit-finder-output`).removeClass("hidden");
}