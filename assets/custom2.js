// $(".product-form__input.product-form__input--dropdown:nth-child(3) option").remove();
 $('.product-form__input.product-form__input--dropdown:nth-child(3) select').attr('disabled', true);

$(document).ready(function(){
   var jck = $('.variant-title[data-product-type="jacket"] .option-1').text();



$('#exampleFormControlSelect1 option[value="0"]').text(jck);
 $('#exampleFormControlSelect1').on('click', function() {
            $("option[value='0']").remove();
            
        });

});


$(document).ready(function(){
   var pnt = $('.variant-title[data-product-type="pants"] .option-1').text();



$('#exampleFormControlSelect2 option[value="0"]').text(pnt);
 $('#exampleFormControlSelect2').on('click', function() {
            $("option[value='0']").remove();
            
        });

});



