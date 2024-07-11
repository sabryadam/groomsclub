theme_custom.checkFitFinderCookie = function(){
  if(document.querySelector(".product-type").value=="suit" || document.querySelector(".product-type").value=="looks"){
    if(!getCookie("fit-finder-data")){
      $(".product-form__submit").addClass("disabled");
    } else {
      $(".product-form__submit").removeClass("disabled");
    }
  }
}

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    try{
      this.updatePickupAvailability();
    }catch(e){
    }
    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      try{
        $('.product-main-image').slick('slickGoTo', this.currentVariant.featured_media.position-1);
      }catch(e){
      }
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {

    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
    if(this.currentVariant != undefined) {
      if($(`.product-variant-option`).length > 0) {
        var selectedVariant = $(`.product-variant-option option[data-variant-title="${this.currentVariant.title}"]`);
        var check_inventory_quantity = selectedVariant.attr(`data-variant-inventory-quantity`);
        var check_inventory_policy = selectedVariant.attr(`data-variant-inventory-policy`);
        var data_variant_estimate_date = selectedVariant.attr(`data-variant-estimate-date`);
        if(theme_custom.current_date < data_variant_estimate_date) {
          if(check_inventory_quantity <= 0 && check_inventory_policy == "continue" ){
            $(`.estimated-variant-error-block-wrap`).removeClass("active");
            $(`.estimated-variant-error-block-wrap[data-varaint-title="${this.currentVariant.title}"]`).addClass("active")
          } else {
            $(`.estimated-variant-error-block-wrap`).removeClass("active");
          }
        } else {
          $(`.estimated-variant-error-block-wrap`).removeClass("active");
        }
      }
      if(!this.currentVariant.available) {
        if($(`.parent-product.product-type-jacket`).length > 0){
          var option1 = $(`[name="Chest Size"]:checked`).val();
          var option2 = $(`[name="Style"]:checked`).val();
          $(`.parent-product.product-type-jacket`).find(`[data-option-title="Chest Size"]`).text(`${option1}`);
          $(`.parent-product.product-type-jacket`).find(`[data-option-title="Style"]`).text(` ${option2} `);
          $(`.parent-product.product-type-jacket`).find(`.parent-error-msg`).addClass('static').attr("variant-not-found",window.variantStrings.unavailable).text(`Size ${window.variantStrings.soldOut}`).show();
        }
        if($(`.parent-product.product-type-pants`).length > 0){
          var option1 = $(`[name="Waist"]:checked`).val();
          var option2 = $(`[name="Length"]:checked`).val();
          $(`.parent-product.product-type-pants`).find(`[data-option-title="Waist"]`).text(`${option1}`);
          $(`.parent-product.product-type-pants`).find(`[data-option-title="Length"]`).text(` x ${option2} `);
          $(`.parent-product.product-type-pants`).find(`.parent-error-msg`).addClass('static').attr("variant-not-found",window.variantStrings.unavailable).text(`Size ${window.variantStrings.soldOut}`).show();
        }
      } else {
        var current_variant = this.currentVariant;
        if($(`.parent-product.product-type-jacket`).length > 0){
          $(`.parent-product.product-type-jacket`).find(`.option-1`).text(`${current_variant.option1}`);
          $(`.parent-product.product-type-jacket`).find(`.option-2`).text(` ${current_variant.option2} `);
          $(`.parent-product.product-type-jacket`).find(`.edit-item-popup`).find(`label[data-option-value="${current_variant.option1}"]`).click();
          $(`.parent-product.product-type-jacket`).find(`.edit-item-popup`).find(`label[data-option-value="${current_variant.option2}"]`).click();
          $(`.parent-product.product-type-jacket`).find(`.edit-item-popup .product-variant-option option[data-variant-title="${current_variant.option1} / ${current_variant.option2} / ${current_variant.option3}"]`).prop("selected",true);
          $(`.parent-product.product-type-jacket`).find(`.parent-error-msg`).text('').hide().removeClass(`static undefined`).removeAttr(`variant-not-found`);
        }
        if($(`.parent-product.product-type-pants`).length > 0){
          $(`.parent-product.product-type-pants`).find(`[data-option-title="Waist"]`).text(`${current_variant.option1}`);
          $(`.parent-product.product-type-pants`).find(`[data-option-title="Length"]`).text(` x ${current_variant.option2} `);
          $(`.parent-product.product-type-pants`).find(`.edit-item-popup`).find(`label[data-option-value="${current_variant.option1}"]`).click();
          $(`.parent-product.product-type-pants`).find(`.edit-item-popup`).find(`label[data-option-value="${current_variant.option2}"]`).click();
          $(`.parent-product.product-type-pants`).find(`.edit-item-popup .product-variant-option option[data-variant-title="${current_variant.option1} / ${current_variant.option2} / ${current_variant.option3}"]`).prop("selected",true);
          $(`.parent-product.product-type-pants`).find(`.parent-error-msg`).text('').hide().removeClass(`static undefined`).removeAttr(`variant-not-found`);
        }
      }
    } else {
      if($(`.parent-product.product-type-jacket`).length > 0){
        var option1 = $(`[name="Chest Size"]:checked`).val();
        var option2 = $(`[name="Style"]:checked`).val();
        $(`.parent-product.product-type-jacket`).find(`[data-option-title="Chest Size"]`).text(`${option1}`);
        $(`.parent-product.product-type-jacket`).find(`[data-option-title="Style"]`).text(` ${option2}`);
        $(`.parent-product.product-type-jacket`).find(`.parent-error-msg`).addClass('static').attr("variant-not-found",window.variantStrings.unavailable).text(`Size ${window.variantStrings.unavailable}`).show();
      }
      if($(`.parent-product.product-type-pants`).length > 0){
        var option1 = $(`[name="Waist"]:checked`).val();
        var option2 = $(`[name="Length"]:checked`).val();
        $(`.parent-product.product-type-pants`).find(`[data-option-title="Waist"]`).text(`${option1}`);
        $(`.parent-product.product-type-pants`).find(`[data-option-title="Length"]`).text(` x ${option2}`);
        $(`.parent-product.product-type-pants`).find(`.parent-error-msg`).addClass('static').attr("variant-not-found",window.variantStrings.unavailable).text(`Size ${window.variantStrings.unavailable}`).show();
      }
    }
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
    );
    if (!newMedia) return;
    const parent = newMedia.parentElement;
    parent.prepend(newMedia);
    window.setTimeout(() => { parent.scroll(0, 0) });
  }

  updateURL() {
    if (!this.currentVariant) return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant?.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        document.getElementById(`price-${this.dataset.section}`)?.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, "Sold out");

        
        if (this.currentVariant.available) {
          this.toggleAddButton(false, window.variantStrings.addToCart);
        }
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
    const addButtonText = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('.btn-title');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', true);
      addButton.style.opacity = "0.5";
      if (text) addButton.textContent = text;
      theme_custom.checkFitFinderCookie();
    } else {
      addButton.removeAttribute('disabled');
      addButton.classList.remove('disabled');
      if (text) addButton.textContent = text;
      addButton.style.opacity = "1";
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
    const addButtonText = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('.btn-title');
    if (!addButton) return;
    $(addButton).text(window.variantStrings.unavailable)
    // addButtonText.textContent = window.variantStrings.unavailable;
    document.getElementById(`price-${this.dataset.section}`)?.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
  }
}

customElements.define('variant-radios', VariantRadios);
