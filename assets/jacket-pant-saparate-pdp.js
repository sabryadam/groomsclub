$(document).ready(function () {
  if (getCookie("fit-finder-data") != undefined || getCookie("fit-finder-data") != '') {
    if($(`#custom_email`).length > 0){
      $.ajax({
        url: `${theme_custom.api_base_url}/api/customer/myFit`,
        method: "GET",
        data: '',
        dataType: "json",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("customerToken")}`
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

                $(`[name="Chest Size"][value='${jacket_size}']`).attr("checked", true).change();
                $(`[name="Style"][value='${jacket_type}']`).attr("checked", true).change();

                $(`[name="Waist"][value='${result.data[0].pants_waist}']`).attr("checked", true).change();
                $(`[name="Length"][value='${result.data[0].pants_hight}']`).attr("checked", true).change();
                
                if($(`.parent-product.product-type-jacket`).length > 0) {
                  $(`.parent-product.product-type-jacket`).find(`[data-option-title="Chest Size"]`).text(`${jacket_size}`);
                  $(`.parent-product.product-type-jacket`).find(`[data-option-title="Style"]`).text(` ${jacket_type} `);
                  var option_third = $(`.parent-product.product-type-jacket`).find(`.option-3`).text();
                  $(`.parent-product.product-type-jacket`).find(`.edit-item-popup`).find(`label[data-option-value="${jacket_size}"]`).click();
                  $(`.parent-product.product-type-jacket`).find(`.edit-item-popup`).find(`label[data-option-value="${jacket_type}"]`).click();
                  $(`.parent-product.product-type-jacket`).find(`.edit-item-popup .product-variant-option option[data-variant-title="${jacket_size} / ${jacket_type} / ${option_third}"]`).prop("selected",true);
                }

                if($(`.parent-product.product-type-pants`).length > 0) {
                  $(`.parent-product.product-type-pants`).find(`[data-option-title="Waist"]`).text(`${result.data[0].pants_waist}`);
                  $(`.parent-product.product-type-pants`).find(`[data-option-title="Length"]`).text(` x ${result.data[0].pants_hight} `);
                  var option_third = $(`.parent-product.product-type-pants`).find(`.option-3`).text();
                  $(`.parent-product.product-type-pants`).find(`.edit-item-popup`).find(`label[data-option-value="${result.data[0].pants_waist}"]`).click();
                  $(`.parent-product.product-type-pants`).find(`.edit-item-popup`).find(`label[data-option-value="${result.data[0].pants_hight}"]`).click();
                  $(`.parent-product.product-type-pants`).find(`.edit-item-popup .product-variant-option option[data-variant-title="${result.data[0].pants_waist} / ${result.data[0].pants_hight} / ${option_third}"]`).prop("selected",true);
                }

                
                setTimeout(() => {
                  var selected_variant_title  =  $(`[data-option-index="0"]`).find(`input:checked`).val();
                  if($(`[data-option-index="1"]`).length > 0) {
                    selected_variant_title = selected_variant_title + ' / ' + $(`[data-option-index="1"]`).find(`input:checked`).val();
                  }
                  if($(`[data-option-index="2"]`).length > 0) {
                    selected_variant_title = selected_variant_title +  ' / ' + $(`[data-option-index="2"]`).find(`input:checked`).val();
                  }
                  var data_variant_inventory_policy = $(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-inventory-policy");
                  var data_variant_inventory_quantity = parseInt($(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-inventory-quantity"));
                  var data_variant_estimate_date = $(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-estimate-date")
                  if(theme_custom.current_date < data_variant_estimate_date) {
                    if(data_variant_inventory_policy == "continue" && data_variant_inventory_quantity <= 0){
                      $(`.estimated-variant-error-block-wrap[data-varaint-title="${selected_variant_title}"]`).addClass("active");
                    }
                  }                
                }, 500);
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
      var check_fit_finder = getCookie("fit-finder-data");
      if(check_fit_finder){
        var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
        var ff_html = '';
        var jacket_size = 'NA';
        var jacket_type = 'NA';
        var jacket_allsizes = getFitFinder.jacketSize;
        if(jacket_allsizes){
          jacket_type = jacket_allsizes.split(":");
          jacket_size = jacket_type[0];
          if (jacket_type[1] == "S") {
            jacket_type = 'Short'
          } else if (jacket_type[1] == "R") {
            jacket_type = 'Regular'
          } else if (jacket_type[1] == "L") {
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

        $(`[name="Chest Size"][value='${jacket_size}']`).attr("checked", true).change();
        $(`[name="Style"][value='${jacket_type}']`).attr("checked", true).change();

        $(`[name="Waist"][value='${getFitFinder.pants_waist}']`).attr("checked", true).change();
        $(`[name="Length"][value='${getFitFinder.pants_hight}']`).attr("checked", true).change();

        if($(`.parent-product.product-type-jacket`).length > 0) {
          $(`.parent-product.product-type-jacket`).find(`[data-option-title="Chest Size"]`).text(`${jacket_size}`);
          $(`.parent-product.product-type-jacket`).find(`[data-option-title="Style"]`).text(` ${jacket_type} `);
          var option_third = $(`.parent-product.product-type-jacket`).find(`.option-3`).text();
          $(`.parent-product.product-type-jacket`).find(`.edit-item-popup`).find(`label[data-option-value="${jacket_size}"]`).click();
          $(`.parent-product.product-type-jacket`).find(`.edit-item-popup`).find(`label[data-option-value="${jacket_type}"]`).click();
          $(`.parent-product.product-type-jacket`).find(`.edit-item-popup .product-variant-option option[data-variant-title="${jacket_size} / ${jacket_type} / ${option_third}"]`).prop("selected",true);
        }

        if($(`.parent-product.product-type-pants`).length > 0) {
          $(`.parent-product.product-type-pants`).find(`[data-option-title="Waist"]`).text(`${getFitFinder.pants_waist}`);
          $(`.parent-product.product-type-pants`).find(`[data-option-title="Length"]`).text(` x ${getFitFinder.pants_hight} `);
          var option_third = $(`.parent-product.product-type-pants`).find(`.option-3`).text();
          $(`.parent-product.product-type-pants`).find(`.edit-item-popup`).find(`label[data-option-value="${getFitFinder.pants_waist}"]`).click();
          $(`.parent-product.product-type-pants`).find(`.edit-item-popup`).find(`label[data-option-value="${getFitFinder.pants_hight}"]`).click();
          $(`.parent-product.product-type-pants`).find(`.edit-item-popup .product-variant-option option[data-variant-title="${getFitFinder.pants_waist} / ${getFitFinder.pants_hight} / ${option_third}"]`).prop("selected",true);
        }

        setTimeout(() => {
          var selected_variant_title  =  $(`[data-option-index="0"]`).find(`input:checked`).val();
          if($(`[data-option-index="1"]`).length > 0) {
            selected_variant_title = selected_variant_title + ' / ' + $(`[data-option-index="1"]`).find(`input:checked`).val();
          }
          if($(`[data-option-index="2"]`).length > 0) {
            selected_variant_title = selected_variant_title +  ' / ' + $(`[data-option-index="2"]`).find(`input:checked`).val();
          }

          var data_variant_inventory_policy = $(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-inventory-policy");
          var data_variant_inventory_quantity = parseInt($(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-inventory-quantity"));
          var data_variant_estimate_date = $(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-estimate-date")
          if(theme_custom.current_date < data_variant_estimate_date) {
            if(data_variant_inventory_policy == "continue" && data_variant_inventory_quantity <= 0){
              $(`.estimated-variant-error-block-wrap[data-varaint-title="${selected_variant_title}"]`).addClass("active");
            }
          }                
        }, 500); 

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
  var current_product = button.parents('.product__info-container');
  var variantTitle = '';
  button.find(".btn-title").text(button.find(".btn-title").attr("data-text"));
  if (current_product.find('.swatch-product-form[data-option-index="0"] input:checked').length > 0) {
    variantTitle = current_product.find('.swatch-product-form[data-option-index="0"] input:checked').val();
  }
  if (current_product.find('.swatch-product-form[data-option-index="1"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + current_product.find('.swatch-product-form[data-option-index="1"] input:checked').val();
  }
  if (current_product.find('.swatch-product-form[data-option-index="2"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + current_product.find('.swatch-product-form[data-option-index="2"] input:checked').val();
  }
  var varId = current_product.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('data-variant-id');
  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: {
      "id": varId,
      "quantity": 1,
      "properties": {
        "saparate-product": "saparate-product"
      }
    },
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
});