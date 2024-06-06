theme_custom.checkCustomizeProduct = function(){
  var targetLength = $(".bundle-product-wrapper .product-data-card").length;
  if(targetLength==0) {
    $(".product-form__buttons .customize-button-customize-look").hide();
  }
}



document.addEventListener("DOMContentLoaded", function() {
  const productMainImage = setInterval(function(){
    if($('.product-main-image').length>0){
      $('.product-main-image').on('init', function (event, slick) {
        const product_main_image_slider = this;
        setTimeout(function() {
          let slick_list = $(product_main_image_slider).find(".slick-list");
          $(slick_list).attr("role","listitem");
        });
      });
      $('.product-main-image').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        fade: true,
        asNavFor: '.product-thumb-image',
        adaptiveHeight : true,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: true,
              infinite: true
            }
          }
        ]
      });
      $('.product-thumb-image').on('init', function (event, slick) {
        const product_thumb_image_slider = this;
        setTimeout(function() {
          let slick_list = $(product_thumb_image_slider).find(".slick-list");
          $(slick_list).attr("role","listitem");
          
          let thumb_image = $('.slick-track .thumb-image', product_thumb_image_slider);
          $.each(thumb_image, function(i,e) {
            $(this).attr("aria-label",`slick-slider`);
            $(this).attr("role",`option`);
          });
        });
      });
      $('.product-thumb-image').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.product-main-image',
        dots: false,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: '30px'
      });
      $('.product-main-image').on('afterChange', function(event, slick, currentSlide){
        var slideSlideItem = slick.$slides[currentSlide];
        if($(slideSlideItem).hasClass("product-video")){
          $('.product-video video').trigger('play');
        } else {
          $('.product-video video').trigger('pause');
        }
      });
      if ($(window).width() < 767) {
        $('.icon-width-text-slider .icontextblock_container').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: true,
          focusOnSelect: true
        });
      }
      if($(".product-type").val() != 'Suit'){
        var selectVariant = $(".product-variant-option").val(),
            getImageId = $(`.product-variant-option option[data-variant-id='${selectVariant}']`).attr("data-variant-image-id"),
            getImageIndex = $(`.product__media-item[data-image-id='${getImageId}']`).attr("data-slick-index");
        $('.product-main-image').slick('slickGoTo',getImageIndex);
      }
      clearTimeout(productMainImage);
    }
  },500)
});