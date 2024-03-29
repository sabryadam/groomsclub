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
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
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
theme_custom.addToCart = function(variantId,qty){
  var items = {
    "quantity" : qty,
    "id" : variantId
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
  updateVid = parent.find('.single-option-selector option[data-title="'+variantTitle+'"]').attr('value');
  updatedTitle = parent.find('.single-option-selector option[data-title="'+variantTitle+'"]').attr('data-var-title');

  $(this).find(".loading-overlay").removeClass("hidden");
  var productVariantTitle = [];
  var selectOptionVar = $(this).closest(".edit-item-popup").find('.single-option-selector option');
  selectOptionVar.each(function(){
    productVariantTitle.push($(this).attr("data-var-title"));    
  });
  if($.inArray(variantTitle,productVariantTitle) == -1){
    $(this).find(".loading-overlay").addClass("hidden");
    $(this).closest(".edit-item-popup").find(".error-message").text(theme_custom.productNotFoundError).show();
    setTimeout(() => {
      $(".error-message").text('').hide();
      $(".fancybox-button").click();
    }, 3000);
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
        theme_custom.addToCart(updateVid,theme_custom.qty);
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
      // vestVariantTitle = $(this).closest(`.cart-item`).attr(`data-vest-variant`),
      pantsVariantTitle = $(this).closest(`.cart-item`).attr(`data-pants-variant`);

  var jacketId = $(this).closest(`.cart-item`).attr(`data-line-item-key`),
      // vestId = $(`.cart-item[line-item-product-type="vest"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`),
      pantsId = $(`.cart-item[line-item-product-type="pants"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`);  
  quantity = parseInt($(this).closest(".cart-item").find(`.quantity__input_custom`).val())-1;
  $(".page-loader").removeClass("hidden");
  // $(".page-loader").append(`<p class="removing-combine-message" style="color:#fff;font-size : 14px">Please Note: We have Add Jacket and Pants both product. As Jacket or Pants can't be purcase individually</p>`);
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
      // vestVariantTitle = $(this).closest(`.cart-item`).attr(`data-vest-variant`),
      pantsVariantTitle = $(this).closest(`.cart-item`).attr(`data-pants-variant`);
  var jacketId = $(this).closest(`.cart-item`).attr(`data-line-item-key`),
      // vestId = $(`.cart-item[line-item-product-type="vest"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`),
      pantsId = $(`.cart-item[line-item-product-type="pants"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`);  
  quantity = parseInt($(this).closest(".cart-item").find(`.quantity__input_custom`).val())+1;
  var jacketTotalQty = parseInt($(`.cart-item[data-line-item-key="${jacketId}"]`).attr(`data-item-variant-qty`)),
      // vestTotalQty = parseInt($(`.cart-item[line-item-product-type="vest"][data-line-item-key="${vestId}"]`).attr(`data-item-variant-qty`)),
      pantsTotalQty = parseInt($(`.cart-item[line-item-product-type="pants"][data-line-item-key="${pantsId}"]`).attr(`data-item-variant-qty`));
  var jacketItemTitle = $(`.cart-item[data-line-item-key="${jacketId}"]`).attr(`data-jacket-item-variant`),
      // vestItemTitle = $(`.cart-item[line-item-product-type="vest"][data-line-item-key="${vestId}"]`).attr(`data-vest-item-variant`),
      pantsItemTitle = $(`.cart-item[line-item-product-type="pants"][data-line-item-key="${pantsId}"]`).attr(`data-pants-item-variant`);
  if(jacketTotalQty >= quantity && pantsTotalQty >= quantity){
    $(".page-loader").removeClass("hidden");
    // $(".page-loader").append(`<p class="removing-combine-message" style="color:#fff;font-size : 14px">Please Note: We have Add Jacket and Pants both product. As Jacket or Pants can't be purcase individually</p>`);
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
    // } else if(vestTotalQty < quantity){
    //   alert(`Oops! We can't add more. We only have ${vestTotalQty} Qty left for the Vest ${vestItemTitle} you are trying to purchase!`)
    } else if(pantsTotalQty < quantity){
      alert(`Oops! We can't add more. We only have ${pantsTotalQty} Qty left for the Pants ${pantsItemTitle} you are trying to purchase!`)
    }
  }
})

// remove combine jacket / pants item
$(document).on("click", ".suit-product-remove", function(){
  var jacketVariantTitle = $(this).closest(`.cart-item`).attr(`data-jacket-variant`),
      // vestVariantTitle = $(this).closest(`.cart-item`).attr(`data-vest-variant`),
      pantsVariantTitle = $(this).closest(`.cart-item`).attr(`data-pants-variant`);

  var jacketId = $(this).closest(`.cart-item`).attr(`data-line-item-key`),
      // vestId = $(`.cart-item[line-item-product-type="vest"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"][data-vest-variant="${vestVariantTitle}"]`).attr(`data-line-item-key`),
      pantsId = $(`.cart-item[line-item-product-type="pants"][data-jacket-variant="${jacketVariantTitle}"][data-pants-variant="${pantsVariantTitle}"]`).attr(`data-line-item-key`);  
  
  var data = `updates[${jacketId}]=0&updates[${pantsId}]=0`;
  $(".page-loader").removeClass("hidden");
  // $(".page-loader").append(`<p class="removing-combine-message" style="color:#fff;font-size : 14px">Please Note: We have removed the Jacket as well. As Jacket or Pants can't be sold individually</p>`)
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