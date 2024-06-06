if(window.jQuery){
  $(document).ready(function(){
  // Image multi slider    
  let slider = $('.slidercontent_container');
  var autoplay = slider.data('autoplay');
  var arrow = slider.data('arrow');
  var dots = slider.data('dots');
  var loop = slider.data('loop');

  $('.sliderinner_container').slick({
    dots: dots,
    arrows: arrow,
    infinite: loop,
    autoplay: autoplay,
    prevArrow:"<img alt='slider-prev'  class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
    nextArrow:"<img alt='slider-next' class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  //my-account slider
  $('.feature-looks-slider').slick({
      dots: false,
      arrows: true,
      infinite: true,
      autoplay: false,
      prevArrow:"<img alt='slider-prev'  class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
      nextArrow:"<img alt='slider-next'  class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
      speed: 1000,
      autoplaySpeed: 5000,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 300,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  });
  // Icon text 
    $('.tooltip-main .information').click(function(){
      $(this).siblings('.information_content').toggle();
  }); 
  window.onclick = function(event) {
    if (!$(event.target).closest('.tooltip-main').length > 0) {
      $('.information_content').hide();
    }
  }

  // feature Product
  let productslider = $('.slider-feature-product');
  var autoplay = productslider.data('autoplay');
  var arrow = productslider.data('arrow');
  var dots = productslider.data('dots');
  var loop = productslider.data('loop');
  $('.slider_featureproduct').slick({
    dots: dots,
    arrows: arrow,
    infinite: loop,
    autoplay: autoplay,
    prevArrow:"<img alt='slider-prev' class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
    nextArrow:"<img alt='slider-next' class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
    speed: 500,
    autoplaySpeed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  //collection page slider
  $('.slider_collectionlist').on('init', function (event, slick) {
    const product_thumb_image_slider = this;
    setTimeout(function() {
      let slick_list = $(product_thumb_image_slider).find(".slick-list");
      $(slick_list).attr("role","listitem");
      let slick_track = $(product_thumb_image_slider).find(".slick-track li");
      $.each(slick_track, function(i,e) {
        $(this).attr("aria-hidden",`false`);
      });
    });
  });
  let collectionlistslider = $('.slider-collection-list');
  var autoplay = collectionlistslider.data('autoplay');
  var arrow = collectionlistslider.data('arrow');
  var dots = collectionlistslider.data('dots');
  var loop = collectionlistslider.data('loop');
  $('.slider_collectionlist').slick({
    dots: dots,
    arrows: arrow,
    infinite: loop,
    autoplay: autoplay,
    prevArrow:"<img alt='slider-prev'  class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
    nextArrow:"<img alt='slider-next'  class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
    speed: 500,
    autoplaySpeed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToScroll: 1,
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  $(".beforeafterinput").on("input change", (e)=>{
    var sliderPos = e.target.value;
    // Update the width of the foreground image
     $('.beforeafter_agterimage').css('width', `calc(${sliderPos}% - 5px)`)
    // Update the position of the slider button
      $('.beforeslider-button').css('left', `calc(${sliderPos}% - 21px)`)
  });

  // party part slider 
  $('.the-party-part-slider').slick({
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: false,
    prevArrow:"<img alt='slider-prev'  class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0585/3223/3402/files/slider_arrow_left-white.png'>",
    nextArrow:"<img alt='slider-next'  class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0585/3223/3402/files/slider_arrow_right-white.png'>",
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  //accordion for question-answer-section
  $('.question-heading').click(function(e) {
    e.preventDefault();
    let $this = $(this);
    if ($this.next().hasClass('show')) {
      $this.next().removeClass('show');
      $this.removeClass('open');
      $this.next().slideUp(350);
    } else {
      $this.parent().parent().find('.question-answer-wrapper .answer-content').removeClass('show');
      $this.parent().parent().find('.question-answer-wrapper .answer-content').slideUp(350);
      $this.parent().parent().find('.question-heading').removeClass('open');
      $this.next().toggleClass('show');
      $this.toggleClass('open');
      $this.next().slideToggle(350);
    }
  });
  //loadmore on blog page
  var show_url;
  $(document).on('click','.btnshow',function(){
    $(this).addClass('displaynone');
    show_url=$('.load-more').attr('href');
    $.ajax({
      type:'GET',
      url:show_url,
      success:function(data){
        var ul_data = $(data).find("div.blog-articles").slideToggle("slow").html();
        $('div.blog-articles').append(ul_data);
        var total_data = $('div.blog-articles div.blog-articles__article').length;
        $('div.blog-counter span').text(total_data);
        var page_number = $(data).find('ul.pagination__list').html();
        $('ul.pagination__list').html(page_number);
      }
    });
  });
  $(".blog-filter-label").on("click", function() {
    $(this).toggleClass("selected");
    $(this).next(".filter-tag").toggle();
  });
  var allOptions = $(".filter-tag");
  $(".filter-tag").on("click", "li",  function() {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $(".blog-filter-label").html($(this).html());
    allOptions.toggle();
  });
  //video play on how to work page
  $('.play').click(function() {
    if($(this).siblings('.video').get(0).paused) {
        $(this).siblings('.video').get(0).play();
        $(this).siblings('.video').addClass('pause');
      } else { $(this).siblings('.video').get(0).pause();
        $(this).siblings('.video').removeClass('pause')
      }
    });
    theme_custom.init();
  });
  // theme_custom.formValidation
  theme_custom.formValidation = function () {
    $(".form_email").bind("keypress keyup keydown", function (e) {
      if (e.which == 32) {
        return false;
      }
      if ($(this).closest(".form-wrap").find(".form-error.active").length > 0) {
        $(this).closest(".form-wrap").find(".form-error.active").removeClass("active");
      }
      // theme_custom.emailValidation($(this));
    });
    $(".form_field").bind("keypress keyup keydown", function (e) {
      if (e.which == 32) {
        return false;
      }
      theme_custom.fieldValidation($(this));
    });
    $('.form_name').bind("keyup", function (e) {
      theme_custom.nameValidation($(this));
    });

    $(".form_phone").bind("keypress keyup keydown", function(e) {
      theme_custom.phoneValidation($(this));
    });
  };
  //theme_custom.emailValidation
  theme_custom.emailValidation = function ($this) {
    var count = 0;
    var parent = $this.closest(".form-wrap");
    if ($this.val() == "" || $.trim($this.val()) == '') {
      parent.find('.form-error').text('This field is required').addClass("active");
      var count = 1;
    } else {
      function ValidateEmail(email) {
        var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return expr.test(email);
      };
      if (!ValidateEmail($this.val())) {
        parent.find('.form-error').text('Please enter valid email').addClass("active");
        var count = 1;
      } else {
        parent.find('.form-error').removeClass("active");
      }
    }
    return count;
  }
  // theme_custom.fieldValidation
  theme_custom.fieldValidation = function ($this) {
    var count = 0;
    var parent = $this.closest(".form-wrap");
    var passwordMinlength = parseInt($this.attr("minlength"));
    var passwordMaxlength = parseInt($this.attr("maxlength"));
    
    if ($this.val() == "" || $.trim($this.val()) == '') {
      parent.find('.form-error').text('This field is required').addClass("active");
      count = 1;
    } else {
      if ($this.val().length > passwordMaxlength || $this.val().length < passwordMinlength) {
        parent.find('.form-error').text('Please enter minimum ' + passwordMinlength + ' & maximum length ' + passwordMaxlength + ' ! ').addClass("active");
        count = 1;
      } else {
        parent.find('.form-error').removeClass("active");
      }
    }
    return count;
  }
  // theme_custom.nameValidation
  theme_custom.nameValidation = function ($this) {
    var count = 0;
    var parent = $this.closest(".form-wrap");
    var regex = new RegExp("^[a-zA-Z ]+$");
    var str = $this.val();
    if ($this.val() == "" || $.trim($this.val()) == '') {
      parent.find('.form-error').text('This field is required').addClass("active");
      count = 1;
    } else if ($this.length > 0) {
      if ($this.val().length > 49) {
        if ($this.val().length > 49) {
          parent.find(".form-error").text('First name is too long (maximum is 50 characters)').addClass("active");
        } else {
          parent.find(".form-error").text('First name is too long (maximum is 50 characters)').removeClass("active");
        }
      } else {
        parent.find(".form-error").text('First name is too long (maximum is 50 characters)').removeClass("active");
        if (regex.test(str)) {
          parent.find(".form-error").text('Please enter Alphabets').removeClass("active");
        } else {
          parent.find(".form-error").text('Please enter Alphabets').addClass("active");
          count = 1;
        }
      }
    } else {
      parent.find(".form-error").removeClass("active");
    }
    return count;
  }
  // theme_custom.submitEvent
  theme_custom.submitEvent = function () {
    $('#customer_login').submit(function (e) {
      var error_count = 0;
      error_count = error_count + theme_custom.emailValidation($(this).find('[name="customer[email]"]'));
      error_count = error_count + theme_custom.fieldValidation($(this).find('[name="customer[password]"]'));
      if (error_count > 0) {
        e.preventDefault();
        return false;
      }
    });
    $('#create_customer').submit(function (e) {
      var error_count = 0;
      error_count = error_count + theme_custom.emailValidation($(this).find('[name="customer[email]"]'));
      error_count = error_count + theme_custom.fieldValidation($(this).find('[name="customer[password]"]'));
      error_count = error_count + theme_custom.nameValidation($(this).find('[name="customer[first_name]"]'));
      error_count = error_count + theme_custom.nameValidation($(this).find('[name="customer[last_name]"]'));
      
      if (error_count > 0) {
        return false;
      }
    });
    $('#recovery-form-login').submit(function (e) {
      var error_count = 0;
      error_count = error_count + theme_custom.emailValidation($(this).find('#RecoverEmail'));
      if (error_count > 0) {
        e.preventDefault();
        return false;
      }
    });
  }
  theme_custom.init = function () {
    theme_custom.formValidation();
    theme_custom.submitEvent();
  }
  document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "complete") {
      if ($(".template-customers-login").length > 0) {
        var loginPageFormSubmit = setInterval(function() {
          if ($("#customer_login[onsubmit]").length > 0) {
            $("#customer_login").removeAttr("onsubmit");
            $(".btn").removeClass("disable");
            clearInterval(loginPageFormSubmit);
          }
        }, 100);
        var loginPageFormSubmitRecover = setInterval(function() {
          if ($("[action='/account/recover'][onsubmit]").length > 0) {
            $("[action='/account/recover']").removeAttr("onsubmit");
            $(".btn").removeClass("disable");
            clearInterval(loginPageFormSubmitRecover);
          }
        }, 100);
      }
      if ($(".template-customers-register").length > 0) {
        var loginPageFormSubmit = setInterval(function() {
          if ($("#create_customer[onsubmit]").length > 0) {
            $("#create_customer").removeAttr("onsubmit");
            $(".btn").removeClass("disable");
            clearInterval(loginPageFormSubmit);
          }
        }, 100);
      }
    }
  });
}