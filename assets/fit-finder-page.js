theme_custom.base_url = theme_custom.api_base_url;

// Fit Finder API Save 
theme_custom.saveFitFinder = function (fitFinderJson, button) {
  var fitFinderJsonData = fitFinderJson,
    pantSize = fitFinderJsonData.pantSize.split('x'),
    pantWaistSize = pantSize[0],
    pantWaistInseam = pantSize[1],
    age_qus = fitFinderJson.age_qus,
    age = fitFinderJson.age,
    build_qus = fitFinderJsonData.build_qus,
    build = fitFinderJsonData.build,
    fit_qus = fitFinderJsonData.fit_qus,
    fit = fitFinderJsonData.fit,
    height_qus = fitFinderJsonData.height_qus,
    height = fitFinderJsonData.height,
    stomach_qus = fitFinderJsonData.stomach_qus,
    stomach = fitFinderJsonData.stomach,
    weight_qus = fitFinderJsonData.weight_qus,
    weight = fitFinderJsonData.weight,
    jacket_size_qus = fitFinderJsonData.jacket_size_qus,
    jacket_size = fitFinderJsonData.jacket_size,
    jacket_type_qus = fitFinderJsonData.jacket_type_qus,
    jacket_type = fitFinderJsonData.jacket_type,
    pants_waist_qus = fitFinderJsonData.pants_waist_qus,
    pants_waist = pantWaistSize,
    pants_hight_qus = fitFinderJsonData.pants_hight_qus,
    pants_hight = pantWaistInseam,
    shirt_neck_qus = fitFinderJsonData.shirt_neck_qus,
    shirt_neck = fitFinderJsonData.shirt_neck,
    shirt_sleeve_qus = fitFinderJsonData.shirt_sleeve_qus,
    shirt_sleeve = fitFinderJsonData.shirt_sleeve,
    shoe_size_qus = fitFinderJsonData.shoe_size_qus,
    shoe_size = fitFinderJsonData.shoe_size,
    jacketSize = fitFinderJsonData.jacketSize,
    jacketSize_result = fitFinderJsonData.jacketSize_result;
  var header = '';
  var userID = $("#customer_id").val(),
    userEmail = $("#customer_email").val();
  fitFinder = {
    "customer_id": userID,
    "user_email": userEmail,
    "age_qus": age_qus,
    "age": age,
    "build_qus": build_qus,
    "build": build,
    "fit_qus": fit_qus,
    "fit": fit,
    "height_qus": height_qus,
    "height": height,
    "stomach_qus": stomach_qus,
    "stomach": stomach,
    "weight_qus": weight_qus,
    "weight": weight,
    "jacket_type_question": jacket_type_qus,
    "jacket_type": jacket_type,
    "jacket_size_question": jacket_size_qus,
    "jacket_size": jacket_size,
    "pantSize": pantSize,
    "pants_waist_question": pants_waist_qus,
    "pants_waist_output": pants_waist,
    "pants_waist": pants_waist,
    "pants_hight_question": pants_hight_qus,
    "pants_hight_output": pants_hight,
    "pants_hight": pants_hight,
    "shirt_neck_question": shirt_neck_qus,
    "shirt_neck_output": shirt_neck,
    "shirt_neck": shirt_neck,
    "shirt_sleeve_question": shirt_sleeve_qus,
    "shirt_sleeve_output": shirt_sleeve,
    "shirt_sleeve": shirt_sleeve,
    "shoe_size_question": shoe_size_qus,
    "shoe_size_output": shoe_size,
    "shoe_size": shoe_size,
    "jacketSize_output": jacketSize,
    "jacketSize_result": jacketSize_result,
    "jacketSize": jacketSize
  }
  console.log("Fit finder fitFinderJsonData",fitFinderJsonData);
  console.warn("Fit Finder Data",fitFinder);
  header = {
    // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
    "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
  };

  $.ajax({
    url: `${theme_custom.base_url}/api/customer/myFit`,
    method: "POST",
    data: fitFinder,
    dataType: "json",
    header: header,
    beforeSend: function () {
    },
    success: function (result) {
      button.text("Saved").removeClass("disabled");
      localStorage.removeItem("edit-fit-finder");
      $('.fit-finder-result-wrapper .form-wrapper, .api_error.success-event').remove();
      var successMsg = `<p class="api_error success-event" style="width: 100%;text-align: center;display: block;">${result.message}</p>`
      $('.fit-finder-result-wrapper .my-size-block-main').after(successMsg).show();
      $(".step-sixteen.step-wrapper[data-step-title='Result']").find(".button-wrap .btn-prev-step").addClass("disabled button").hide();
      $(".step-sixteen.step-wrapper[data-step-title='Result']").find(".button-wrap .btn-prev-step").addClass("disabled button").hide();
      setTimeout(() => {
        $('.step-wrapper[data-step-title="Result"] .api_error').hide()
        // location.reload();
        if (localStorage.getItem("customizerlookPageFitFinder")) {
          window.location.href = '/pages/customize-your-look';
          localStorage.setItem("gotoFitFinder", "true");
        } else if (localStorage.getItem("previous-page-link")) {
          var getProductLink = localStorage.getItem("page-link");
          window.location.href = getProductLink;
        } else if (localStorage.getItem("invited-event-fit-finder-button")) {
          var getInvitedEventUrl = localStorage.getItem("invited-event-url");
          window.location.href = '/pages/invited?' + getInvitedEventUrl;
        } else if (localStorage.getItem("invited-event-fit-finder-button")) {
          var getHometryOnEventUrl = localStorage.getItem("home-try-on-event-url");
          window.location.href = '/pages/my-event?' + getHometryOnEventUrl;
          console.log("Home try on event url",getHometryOnEventUrl);
        }
         else {
          $(".edit-size-button").removeClass("hidden").show();
          $(".continue-shopping-btn").removeClass("hidden disabled").show();
        }
      }, 3000);
    },
    error: function (xhr, status, error) {
      button.text("Saved My Sizes")
      button.removeClass("disabled");
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.api_error').removeClass("hidden").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
        });
        setTimeout(() => {
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        var event_date_msg = '';
        if (xhr.responseJSON.data != '') {
          $.map(xhr.responseJSON.data, function (value, index) {
            event_date_msg += `<span>${value}</span>`;
          });
        } else {
          event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
        }
        $('.api_error').removeClass("hidden").html(event_date_msg);
        setTimeout(function () {
          $('.api_error').addClass("hidden")
        }, 10000);
      }
    }
  });
}

// Fit Finder Weight Validation
theme_custom.weightValidation = function ($this) {
  var count = 0;
  var parent = $($this).closest(".page-content-wrapper");
  var targetEl = $($this).val().length;
  var targetNumber = parseInt($($this).val());
  var numbers = /^[0-9]+$/;
  if (targetEl == 0) {
    parent.find(".required-error").remove();
    parent.append(theme_custom.requiredErrorMsg);
    count = 1;
  } else {
    if ($this.val() != "") {
      if (!$this.val().match(numbers)) {
        parent.find(".required-error").remove();
        parent.append(theme_custom.NumberErrorMsg);
        parent.closest(".step-wrapper").find(".next-button").addClass("disabled");
        count = 1;
      } else {
        if (targetNumber < 1 || targetNumber > 999) {
          parent.find(".required-error").remove();
          parent.append(theme_custom.globalErrorMessage);
          parent.closest(".step-wrapper").find(".next-button").addClass("disabled");
          count = 1;
        } else {
          parent.closest(".step-wrapper").find(".next-button").removeClass("disabled");
          parent.find(".required-error").remove();
        }
      }
    }
  }
  return count;
}

// Fit Finder Age Validation
theme_custom.ageValidation = function ($this) {
  var count = 0;
  var parent = $($this).closest(".page-content-wrapper");
  var targetEl = $($this).val().length;
  var targetNumber = parseInt($($this).val());
  var numbers = /^[0-9]+$/;
  // if (targetEl == 0) {
  //   parent.find(".required-error").remove();
  //   parent.append(theme_custom.requiredErrorMsg);
  //   parent.closest(".step-wrapper").find(".next-button").addClass("disabled");
  //   count = 1;
  // } else {
  //   if ($this.val() != "") {
  //     if (!$this.val().match(numbers)) {
  //       parent.find(".required-error").remove();
  //       parent.append(theme_custom.NumberErrorMsg);
  //       parent.closest(".step-wrapper").find(".next-button").addClass("disabled");
  //       count = 1;
  //     } else {
  //       if (targetNumber < 14 || targetNumber > 100) {
  //         parent.find(".required-error").remove();
  //         parent.append(theme_custom.globalErrorMessage);
  //         parent.closest(".step-wrapper").find(".next-button").addClass("disabled");
  //         count = 1;
  //       } else {
  //         parent.closest(".step-wrapper").find(".next-button").removeClass("disabled");
  //         parent.find(".required-error").remove();
  //       }
  //     }
  //   }
  // }
  return count;
}

// User Height Set
theme_custom.userHeightSet = function () {
  var parent = $(".step-wrapper[data-step-title='Height']");
  if (parent.find('input[type="radio"][name="height"]').is(':checked')) {
    $('input[type="radio"][name="height"]').prop('checked', false);
  }
  var userHeightFeet = parent.find(".height-feet").val();
  var userHeightInch = parent.find(".height-inche").val();
  var UserHeight = userHeightFeet + '.' + userHeightInch;
  $(".user-height").val(UserHeight);
}


// Previous Element Show function 
theme_custom.prevElmShow = function (parent) {
  var parent = parent;
  parent.removeClass("active");
  parent.prev(".step-wrapper").addClass("active");
};

// Next Element Show function 
theme_custom.nextElmShow = function (parent) {
  var parent = parent;
  parent.removeClass("active");
  parent.next(".step-wrapper").addClass("active");
};

// Fit Finder Change Event
theme_custom.fitFinderChangeEvent = function () {
  $('input[type=radio][name=height]').on('click', function () {
    setTimeout(() => {
      $(".required-error").remove();
      $(".button").removeClass("disabled");
      var selectedVal = $(this).val(),
        selectedValueArr = selectedVal.split(".");
      $(".step-wrapper[data-step-title='Height']").find(".height-feet").val(selectedValueArr[0]);
      $(".step-wrapper[data-step-title='Height']").find(".height-inche").val(selectedValueArr[1]);
      $(".step-wrapper[data-step-title='Height']").find(".user-height").val(selectedVal);
      $(this).closest('.step-wrapper').find('.next-button').click();
    }, 300)
  });
  if(localStorage.getItem("edit-fit-finder")){
    $('.go-next-step-wrapper .form-wrap label').on('click',function(e){
      setTimeout(() => {
        $(this).parent().find(`[type="radio"]`).attr("checked",true);
        let parent = $(this).closest('.go-next-step-wrapper');
        let nextButton = $('.next-button',parent);
        nextButton.click();
      }, 300);
    })
  } else {
    $('.go-next-step-wrapper input[type="radio"]').on('click',function(e){
      setTimeout(() => {
        let parent = $(this).closest('.go-next-step-wrapper');
        let nextButton = $('.next-button',parent);
        nextButton.click();
      }, 300);
    })
  }
}

theme_custom.jacketSizefunction = function (jacketSize, jacketSizeVal, jacketPantVal, fitFinder) {
  $(".fit-finder-result").removeAttr("data-fit-finder-result").text('');
  $(".fit-finder-result").attr("data-fit-finder-result", jacketSize).text(jacketSizeVal);
  $(".fit-finder-pant-result").removeAttr("data-fit-finder-pant-result").text('');
  $(".fit-finder-pant-result").attr("data-fit-finder-pant-result", jacketPantVal).text(jacketPantVal);
  fitFinder["jacketSize"] = $(".fit-finder-result").attr("data-fit-finder-result");
  fitFinder["pantSize"] = $(".fit-finder-pant-result").attr("data-fit-finder-pant-result");
  console.log("fitfinder size",fitFinder["pantSize"] = $(".fit-finder-pant-result").attr("data-fit-finder-pant-result"));
  fitFinder["jacketSize_result"] = "Your Jacket size result";
}

// theme_custom.heightValValidation
theme_custom.heightValValidation = function (feetVal, inchVal) {
  var count = 0,
    parentElm = $(`.step-wrapper[data-step-handle="height"]`).find(".fit-finder-main-wrapper"),
    feetValLength = feetVal.val().length,
    inchValLength = inchVal.val().length,
    feetValNumber = parseInt(feetVal.val().trim()),
    inchNumber = parseInt(inchVal.val().trim()),
    numbers = /^[0-9]+$/;
  if (feetValLength == 0 || inchValLength == 0) {
    if (!feetVal.val().match(numbers) || !inchVal.val().match(numbers)) {
      if (!feetVal.val().match(numbers)) {
        parentElm.find(".required-error").remove();
        parentElm.find(".page-content-wrapper").append(theme_custom.NumberErrorMsg);
        parentElm.find(".next-button").addClass("disabled");
        count = 1;
      }
      if (!inchVal.val().match(numbers)) {
        parentElm.find(".required-error").remove();
        parentElm.find(".page-content-wrapper").append(theme_custom.NumberErrorMsg);
        parentElm.find(".next-button").addClass("disabled");
        count = 1;
      }
    }
    if (feetVal.val() == '' && inchVal.val() == '') {
      parentElm.find(".required-error").remove();
      parentElm.find(".page-content-wrapper").append(theme_custom.requiredErrorMsg);
      parentElm.find(".next-button").addClass("disabled");
      count = 1;
    }
  } else {
    if (feetVal.val() != '' || inchVal.val() != '') {
      if (!feetVal.val().match(numbers) || !inchVal.val().match(numbers)) {
        parentElm.find(".required-error").remove();
        parentElm.find(".page-content-wrapper").append(theme_custom.NumberErrorMsg);
        parentElm.find(".next-button").addClass("disabled");
        count = 1;
      } else {
        if ((feetValNumber < 1 || feetValNumber > 9) || (inchNumber > 12)) {
          parentElm.find(".required-error").remove();
          parentElm.find(".page-content-wrapper").append(theme_custom.globalErrorMessage);
          parentElm.find(".next-button").addClass("disabled");
          count = 1;
        } else {
          parentElm.find(".next-button").removeClass("disabled");
          parentElm.find(".required-error").remove();
        }
      }
    }
  }
}

theme_custom.windowScrolTop = function () {
  $('html, body').stop().animate({
    'scrollTop': $(".page-heading").offset().top - $("#shopify-section-header").height() + 100
  }, 900);
}

// Fit Finder All Click Event 
theme_custom.fitFinderClickEvent = function () {
  var fitFinder = [],
    parent = $(".fit-finder-wrapper");

  // Height Feet Validation 
  $(".input-ft").bind("keyup", function (e) {
    $(this).val($(this).val().trim());
    $(".required-error").remove();
    $(".button").removeClass("disabled");
    var feetVal = $(this);
    var inchVal = $(".input-in");
    theme_custom.heightValValidation(feetVal, inchVal);
    theme_custom.userHeightSet();
  });

  // Height Inche Validation 
  $(".input-in").bind("keyup", function (e) {
    $(this).val($(this).val().trim());
    $(".required-error").remove();
    $(".button").removeClass("disabled");
    var feetVal = $(".input-ft");
    var inchVal = $(this);
    theme_custom.heightValValidation(feetVal, inchVal);
    theme_custom.userHeightSet();
  });

  // Height Inche Validation 
  $(".weight-value").bind("keyup", function (e) {
    $(".required-error").remove();
    theme_custom.weightValidation($(this));
  });

  // Age Validation 
  $(".age-wrap .text-field").bind("keyup", function (e) {
    $(".required-error").remove();
    theme_custom.ageValidation($(this));
  });

  // Previous button Click Event
  $(document).on("click", ".prev-button", function () {
    if ($(this).hasClass("previous-page-link")) {
      window.location.href = $(this).attr("data-previous-page-link");
      localStorage.removeItem("page-link");
      localStorage.removeItem("previous-page-link")
      if (localStorage.getItem("customizerlookPageFitFinder")) {
        localStorage.setItem("gotoFitFinder", "true");
      }
    } else {
      var parent = $(this).closest(".step-wrapper");
      if (parent.attr("data-step-title") == "Result") {
        $(".page-header-title h1").text("Fit Finder");
      }
      theme_custom.prevElmShow(parent);
      theme_custom.windowScrolTop();
    }
  });

  // Next button Click Event
  $(document).on("click", ".next-button", function () {
    $(".required-error").remove();
    var parent = $(this).closest(".step-wrapper");
    stepTitle = selectedVal = '';
    var error_count = 0;
    if (parent.find(".height--wrap").length > 0) {
      // Height Feet Validation 
      if (parent.find("input[type='radio']").is(':checked')) {
        $(".required-error").removeClass("active");
        var heightFeet = parent.find('.input-ft');
        var heightInch = parent.find('.input-in');
        error_count += theme_custom.heightValValidation(heightFeet, heightInch);
        if (error_count > 0) {
          parent.find(".page-content-wrapper").append(theme_custom.globalErrorMessage);
          return false;
        } else {
          stepTitle = parent.attr("data-step-handle");
          selectedVal = parent.find("input[type='radio']:checked").val();
          selectedQuestion = parent.find(".block-heading").text();
          fitFinder[stepTitle + '_qus'] = selectedQuestion.trim();
          fitFinder[stepTitle] = selectedVal;
          theme_custom.nextElmShow(parent);
        }
      } else if (parent.find(".user-height").val() != '') {
        $(".required-error").removeClass("active");
        if (parent.find('.height-feet').val() != '' || parent.find('.height-inche').val() != '') {
          var heightFeet = parseInt(parent.find('.height-feet').val());
          var heightInche = parseInt(parent.find('.height-inche').val());
          if ((heightFeet < 1 || heightFeet > 9) || (heightInche > 12)) {
            $(".required-error").remove();
            parent.find(".page-content-wrapper").append(theme_custom.globalErrorMessage);
            return false;
          } else {
            $(".required-error").remove();
            stepTitle = parent.attr("data-step-handle");
            selectedVal = parent.find(".user-height").val();
            selectedQuestion = parent.find(".block-heading").text();
            fitFinder[stepTitle + '_qus'] = selectedQuestion.trim();
            fitFinder[stepTitle] = selectedVal;
            theme_custom.nextElmShow(parent);
          }
        }
      } else {
        $(".required-error").remove();
        parent.find(".page-content-wrapper").append(theme_custom.globalErrorMessage);
        return false;
      }
    } else if (parent.find(".radio-wrap").length > 0) {
      stepTitle = parent.attr("data-step-handle");
      if (parent.find("input[type='radio']").is(':checked')) {
        $(".required-error").removeClass("active");
        selectedVal = parent.find("input[type='radio']:checked").val();
        console.log("selected value",selectedVal);
        selectedQuestion = parent.find(".block-heading").text();
        fitFinder[stepTitle + '_qus'] = selectedQuestion.trim();
        fitFinder[stepTitle] = selectedVal;
        if (error_count == 0) {
          theme_custom.nextElmShow(parent);
        }
      } else {
        fitFinder[stepTitle] = "00";
        selectedQuestion = parent.find(".block-heading").text();
        theme_custom.nextElmShow(parent);
      }
    } else if (parent.find(".text-wrap").length > 0) {
      if (parent.find("input[type='text']").val() != '' || parent.find("input[type='text']#age").length > 0) {
        $(".required-error").removeClass("active");
        if (parent.attr("data-step-title") == 'Weight') {
          $(".required-error").removeClass("active");
          if (parent.find('.weight-value').val() != '') {
            var weightValue = parent.find('.weight-value');
            error_count += theme_custom.weightValidation(weightValue);
            if (error_count > 0) {
              return false;
            } else {
              stepTitle = parent.attr("data-step-handle");
              selectedVal = parent.find("input[type='text']").val();
              selectedQuestion = parent.find(".block-heading").text();
              fitFinder[stepTitle + '_qus'] = selectedQuestion.trim();
              fitFinder[stepTitle] = selectedVal;
              theme_custom.nextElmShow(parent);
            }
          }
        } else if (parent.attr("data-step-title") == 'Age') {
          $(".required-error").removeClass("active");
          // if (parent.find('.age-wrap .text-field').val() != '') {
            // var weightValue = parent.find('.age-wrap .text-field');
            // error_count += theme_custom.ageValidation(weightValue);
            // if (error_count > 0) {
            //   return false;
            // } else {
            //   stepTitle = parent.attr("data-step-handle");
            //   selectedVal = parent.find("input[type='text']").val();
            //   selectedQuestion = parent.find(".block-heading").text();
            //   fitFinder[stepTitle + '_qus'] = selectedQuestion.trim();
            //   fitFinder[stepTitle] = selectedVal;
            //   theme_custom.nextElmShow(parent);
            // }
           
          // }
          theme_custom.nextElmShow(parent);
        } else {
          stepTitle = parent.attr("data-step-handle");
          selectedVal = parent.find("input[type='text']").val();
          selectedQuestion = parent.find(".block-heading").text();
          fitFinder[stepTitle + '_qus'] = selectedQuestion.trim();
          fitFinder[stepTitle] = selectedVal;
          theme_custom.nextElmShow(parent);
        }
      } else {
        $(".required-error").remove();
        if (parent.attr("data-step-title") == 'Weight') {
          parent.find(".page-content-wrapper").append(theme_custom.requiredErrorMsg);
          return false;
        } if (parent.attr("data-step-title") == 'Age') {
          // parent.find(".page-content-wrapper").append(theme_custom.requiredErrorMsg);
          // return false;
        }
      }
    } else {
      theme_custom.nextElmShow(parent);
    }
    // Check Height and Weight 
    var fitFinderJson = Object.assign({}, fitFinder);
    if (parent.attr("data-step-title") == "Suit Jacket Length") {
      var userHeight = fitFinderJson.height,
        userNewHeight = userHeight.replace('"', ''),
        userWeight = parseInt(fitFinderJson.weight),
        userNewHeight = userNewHeight.replace('`', '.');
        console.log("fitFinderJson",fitFinderJson);
      if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 1 && userWeight <= 124)) {
        theme_custom.jacketSizefunction("32:S", "32S", "26x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 125 && userWeight <= 140)) {
        theme_custom.jacketSizefunction("34:S", "34S", "28x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 141 && userWeight <= 160)) {
        theme_custom.jacketSizefunction("36:S", "36S", "30x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 161 && userWeight <= 180)) {
        theme_custom.jacketSizefunction("38:S", "38S", "32x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 181 && userWeight <= 195)) {
        theme_custom.jacketSizefunction("40:S", "40S", "34x32", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 196 && userWeight <= 210)) {
        theme_custom.jacketSizefunction("42:S", "42S", "36x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.09) && (userWeight >= 211 && userWeight <= 225)) {
        theme_custom.jacketSizefunction("44:S", "44S", "38x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.08) && (userWeight >= 226 && userWeight <= 240)) {
        theme_custom.jacketSizefunction("46:S", "46S", "40x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.08) && (userWeight >= 241 && userWeight <= 250)) {
        theme_custom.jacketSizefunction("48:S", "48S", "42x30", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 5.08) && (userWeight >= 251 && userWeight <= 260)) {
        theme_custom.jacketSizefunction("50:S", "50S", "44x30", fitFinder);
      } else if ((userNewHeight >= 5.10 && userNewHeight <= 9.0) && (userWeight >= 1 && userWeight <= 140)) {
        theme_custom.jacketSizefunction("34:R", "34R", "28x32", fitFinder);
      } else if ((userNewHeight >= 5.10 && userNewHeight <= 9.0) && (userWeight >= 141 && userWeight <= 160)) {
        theme_custom.jacketSizefunction("36:R", "36R", "30x32", fitFinder);
      } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 161 && userWeight <= 180)) {
        theme_custom.jacketSizefunction("38:R", "38R", "32x32", fitFinder);
      } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 181 && userWeight <= 195)) {
        theme_custom.jacketSizefunction("40:R", "40R", "34x32", fitFinder);
      } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 196 && userWeight <= 210)) {
        theme_custom.jacketSizefunction("42:R", "42R", "36x32", fitFinder);
      } else if ((userNewHeight >= 5.10 && userNewHeight <= 6.01) && (userWeight >= 211 && userWeight <= 225)) {
        theme_custom.jacketSizefunction("44:R", "44R", "38x32", fitFinder);
      } else if ((userNewHeight >= 5.09 && userNewHeight <= 6.01) && (userWeight >= 226 && userWeight <= 240)) {
        theme_custom.jacketSizefunction("46:R", "46R", "40x32", fitFinder);
      } else if ((userNewHeight >= 5.09 && userNewHeight <= 6.01) && (userWeight >= 241 && userWeight <= 250)) {
        theme_custom.jacketSizefunction("48:R", "48R", "42x32", fitFinder);
      } else if ((userNewHeight >= 5.09 && userNewHeight <= 6.01) && (userWeight >= 251 && userWeight <= 260)) {
        theme_custom.jacketSizefunction("50:R", "50R", "44x32", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 261 && userWeight <= 270)) {
        theme_custom.jacketSizefunction("52:R", "52R", "46x32", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 271 && userWeight <= 280)) {
        theme_custom.jacketSizefunction("54:R", "54R", "48x32", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 281 && userWeight <= 290)) {
        theme_custom.jacketSizefunction("56:R", "56R", "50x32", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 291 && userWeight <= 300)) {
        theme_custom.jacketSizefunction("58:R", "58R", "52x32", fitFinder);
      } else if ((userNewHeight >= 1.0 && userNewHeight <= 6.01) && (userWeight >= 301 && userWeight <= 999)) {
        theme_custom.jacketSizefunction("60:R", "60R", "54x32", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 165 && userWeight <= 185)) {
        theme_custom.jacketSizefunction("38:L", "38L", "32x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 186 && userWeight <= 199)) {
        theme_custom.jacketSizefunction("40:L", "40L", "34x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 200 && userWeight <= 212)) {
        theme_custom.jacketSizefunction("42:L", "42L", "36x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 213 && userWeight <= 228)) {
        theme_custom.jacketSizefunction("44:L", "44L", "38x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 229 && userWeight <= 240)) {
        theme_custom.jacketSizefunction("46:L", "46L", "40x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 241 && userWeight <= 250)) {
        theme_custom.jacketSizefunction("48:L", "48L", "42x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 251 && userWeight <= 260)) {
        theme_custom.jacketSizefunction("50:L", "50L", "44x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 261 && userWeight <= 270)) {
        theme_custom.jacketSizefunction("52:L", "52L", "46x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 271 && userWeight <= 280)) {
        theme_custom.jacketSizefunction("54:L", "54L", "48x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 281 && userWeight <= 290)) {
        theme_custom.jacketSizefunction("56:L", "56L", "50x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 291 && userWeight <= 300)) {
        theme_custom.jacketSizefunction("58:L", "58L", "52x34", fitFinder);
      } else if ((userNewHeight >= 6.02 && userNewHeight <= 9.0) && (userWeight >= 301 && userWeight <= 999)) {
        theme_custom.jacketSizefunction("60:L", "60L", "54x34", fitFinder);
      } else {
        theme_custom.jacketSizefunction("0:0", "0", fitFinder);
      }
    }
    if (parent.attr("data-step-title") == "Fit") {
      var jacketTypeArr = $(".fit-finder-result").attr("data-fit-finder-result");
      var jacketType = jacketTypeArr.split(":");
      var jacketTypeVal = '';
      var jacketTypeFirst = jacketType[0];
      var jacketTypeArrError, FormDisable;
      setCookie("fit-finder-data", '');
      var pantSizeArr = fitFinderJson.pantSize.split('x'),
        pants_waist = pantSizeArr[0],
        pants_hight = pantSizeArr[1];
        console.log("pantSizeArr",pantSizeArr);
      fitFinderJson.pants_waist = pants_waist;
      fitFinderJson.pants_hight = pants_hight;
      setCookie("fit-finder-data", JSON.stringify(fitFinderJson), 365);
      if (jacketTypeArr == "0:0") {
        jacketTypeArrError = 'email-form-disable'
        FormDisable = 'form-block-disable';
        var errorMsg = theme_custom.globalErrorMessage;
      } else {
        jacketTypeArrError = '';
        FormDisable = '';
        var errorMsg = '';
      }
      var fitFinderAPIHtml = '';
      if ($("#customer_email").val() != '') {
        // ${theme_custom.globalErrorMessage}
        fitFinderAPIHtml += `<div class='${FormDisable}'>
                              <div class="form-wrapper ${jacketTypeArrError}">
                                <div class="form-wrap">
                                  <button type="button" class="button button--primary save-fit-finder" data-text="Saving...">Save My Sizes</button>
                                </div>
                              </div>
                              ${errorMsg}
                            </div>`
      } else {
        fitFinderAPIHtml += `<div class='user-has-not-logged ${FormDisable}'>
                              <div class="form-wrapper ${jacketTypeArrError}">
                                <div class="form-wrap">
                                  <h4 class="title">Time to save your fit!</h4>  
                                  <div class="button-outer-wrapper" style="align-items: end;">
                                    <div class="button-wrapper"><button type="button" class="button button--primary previous-page-link" onclick="window.moveToLastPage()">Continue Shopping</button></div>
                                    <div class="button-wrapper"><button type="button" class="button button--primary save-fit-finder-flag" data-target-link="/account/login">Log In/Sign Up</button></div>
                                  </div>
                                  <span class="form-error"></span>
                                </div>
                              </div>
                              ${errorMsg}
                            </div>`
      }
      if (localStorage.getItem("previous-page-link")) {
        $(".previous-page-link").attr("data-previous-page-link", localStorage.getItem("page-link"));
      } else {
        $(`[data-step-title="Result"]`).find(".previous-page-link").addClass("hidden")
        $(`[data-step-title="Result"]`).find(".continue-shopping-btn").removeClass("hidden")
      }
      if (jacketTypeFirst == '0') {
        var jacketTypeFirst = 'NA';
      } else {
        var jacketTypeFirst = `${jacketType[0]}`
      }
      if (jacketType[1] == "S") {
        jacketTypeVal = 'Short'
      } else if (jacketType[1] == "R") {
        jacketTypeVal = 'Regular'
      } else if (jacketType[1] == "L") {
        jacketTypeVal = 'Long'
      } else if (jacketType[1] == "0") {
        jacketTypeVal = 'NA';
      }
      var pantSize = fitFinderJson.pantSize.split('x'), pantWaist, pantHeight;
      if (pantSize == '00') {
        pantWaist = 'NA'
      } else {
        pantWaist = `${pantSize[0]}W`;
      }
      if (pantSize == '00') {
        pantHeight = 'NA'
      } else {
        pantHeight = `${pantSize[1]}H`;
      }
      var shirtNeck = fitFinderJson.shirt_neck;
      if (shirtNeck == '00') {
        shirtNeck = 'NA'
      } else {
        shirtNeck = `${shirtNeck}`;
      }
      var shirtSleeve = fitFinderJson.shirt_sleeve;
      if (shirtSleeve == '00') {
        shirtSleeve = 'NA'
      } else {
        shirtSleeve = `${shirtSleeve}`;
      }
      var shoesShize = fitFinderJson.shoe_size;
      if (shoesShize == '00') {
        shoesShize = 'NA'
      } else {
        shoesShize = `${shoesShize}`
      }
      var resultTextWrapper = `<div class="my-size-wrapper">
                                <p class="text_center sub-title">Based on our fit finder calculations, we recommend the following sizes.</p> 
                                <div class="my-size-block-main" style=""><input class="size_customer_id" type="hidden" value="15">
                                  <div class="block1 my-size-block jacket-type">
                                    <div class="block-wrap">
                                      <div class="img-section">
                                        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/jacket-vest.png" alt="Jacket Size">
                                      </div>
                                      <div class="block-info">
                                        <div class="block-title">Jacket</div>
                                        <div class="size-wrap">
                                          <span class="size-number">Size ${jacketTypeFirst}</span>
                                          <span class="break">|</span>
                                          <span class="size-type">${jacketTypeVal}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="block1 my-size-block">
                                    <div class="block-wrap">
                                      <div class="img-section">
                                        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/account-2.png" alt="Pants Size" />
                                      </div>
                                      <div class="block-info">
                                        <div class="block-title">Pants</div>
                                        <div class="size-wrap">
                                          <span class="size-number">Size ${pantWaist}</span>
                                          <span class="break">|</span>
                                          <span class="size-type">${pantHeight}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="block1 my-size-block">
                                    <div class="block-wrap">
                                      <div class="img-section">
                                        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/shirt-display-img.png?v=1641880242" alt="Shirt Image" />
                                      </div>
                                      <div class="block-info">
                                        <div class="block-title">Shirt</div>
                                        <div class="size-wrap">
                                          <span class="size-number">Neck ${shirtNeck}</span>
                                          <span class="break">|</span>
                                          <span class="size-type">Sleeve ${shirtSleeve}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="block1 my-size-block">
                                    <div class="block-wrap">
                                      <div class="img-section">
                                        <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/shoes-display-img.png?v=1641880242" alt="Shoes Size" / >
                                      </div>
                                      <div class="block-info">
                                        <div class="block-title">Shoes</div>
                                        <div class="size-wrap">
                                          <span class="size-number">Size ${shoesShize}</span>                              
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="api_error hidden" style="margin-bottom:10px"></div>
                                ${fitFinderAPIHtml}
                              </div>`;

      parent.next(".step-wrapper").find(".fit-finder-result-wrapper").html(resultTextWrapper);
      $(".page-header-title h1").text("Your results are in!");
    }
    theme_custom.windowScrolTop();
  });

  // Save Fit Finder when User Logged out
  $(document).on("click", ".save-fit-finder-with-email", function (e) {
    var error_count = 0;
    var button = $(this);
    button.text($(this).attr("data-text")).addClass("disabled");
    error_count = error_count + theme_custom.emailValidation($(this).closest(".form-wrap").find('[name="event_email"]'));
    if (error_count > 0) {
      e.preventDefault();
      return false;
    } else {
      var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
      theme_custom.saveFitFinder(getFitFinder, button);
    }
  });

  // Save Fit Finder when User Logged In
  $(document).on("click", ".save-fit-finder", function (e) {
    var button = $(this);
    button.text($(this).attr("data-text")).addClass("disabled");
    var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
    theme_custom.saveFitFinder(getFitFinder, button);
  });

  // Email validation
  $(document).on("keypress keyup keydown", ".customer-email-id", function (e) {
    if (e.which == 32) {
      return false;
    }
    if ($(this).closest(".form-wrap").find(".form-error.active").length > 0) {
      $(this).closest(".form-wrap").find(".form-error.active").removeClass("active");
    }
    theme_custom.emailValidation($(this));
  });

  $(document).on("click", ".watch-tutorial", function () {
    var target = $(this).closest(".page-content-wrapper").find(".step-video-wrapper");
    $.fancybox.open(target);
  });

  $(document).on("click", ".save-fit-finder-flag", function () {
    localStorage.setItem("save-fit-finder-flag", "true");
    var windowURL = $(this).attr("data-target-link");
    window.location.href = windowURL;
  })
}

// Edit Fit Finder Function
theme_custom.editFitFinder = function () {
  var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
  // availabel answer
  var jacketType = getFitFinder.jacketSize.split(":");
  var jacketTypeVal = '';
  if (jacketType[1] == "S") {
    jacketTypeVal = 'Short'
  } else if (jacketType[1] == "R") {
    jacketTypeVal = 'Regular'
  } else if (jacketType[1] == "L") {
    jacketTypeVal = 'Long'
  }
  var pants_waist, pants_hight;
  if (getFitFinder.pantSize != undefined) {
    var pantSizeArr = getFitFinder.pantSize.split('x');
    pants_waist = pantSizeArr[0],
    pants_hight = pantSizeArr[1];
  } else {
    pants_waist = getFitFinder.pants_waist,
      pants_hight = getFitFinder.pants_hight;
  }
  var height = getFitFinder.height,
    heightArr = height.split('.');
    weight = getFitFinder.weight,
    age = getFitFinder.age,
    build = getFitFinder.build,
    stomach = getFitFinder.stomach,
    shoe_size = getFitFinder.shoe_size,
    pantSize = getFitFinder.pantSize,
    pants_waist = pants_waist,
    pants_hight = pants_hight,
    shirt_neck = getFitFinder.shirt_neck,
    shirt_sleeve = getFitFinder.shirt_sleeve,
    jacket_size = jacketType[0],
    jacket_type = jacketTypeVal,
    fit = getFitFinder.fit;
    console.log("pantSize",pantSize);
  $(".step-wrapper[data-step-title='Height']").find(".height-feet").val(heightArr[0]);
  $(".step-wrapper[data-step-title='Height']").find(".height-inche").val(heightArr[1]);
  $(".step-wrapper[data-step-title='Height']").find(".user-height").val($("#user-height").val());
  $(`.height--wrap [name="height"][value='${height}']`).attr("checked", true).change();
  $("#weight").val(weight);
  $("#age").val(age);
  $(`[name="build"][value='${build}']`).attr("checked", true).change();
  $(`[name="stomach"][value='${stomach}']`).attr("checked", true).change();
  $(`[name="shoes"][value='${shoe_size}']`).attr("checked", true).change();
  $(`[name="waist"][value='${pants_waist}']`).attr("checked", true).change();
  $(`[name="inseam"][value='${pants_hight}']`).attr("checked", true).change();
  $(`[name="neck"][value='${shirt_neck}']`).attr("checked", true).change();
  $(`[name="shirt-sleeve-length"][value='${shirt_sleeve}']`).attr("checked", true).change();
  $(`[name="jacket_size"][value='${jacket_size}']`).attr("checked", true).change();
  $(`[name="suit-jacket-length"][value='${jacket_type}']`).attr("checked", true).change();
  $(`[name="fit"][value='${fit}']`).attr("checked", true).change();
  setTimeout(() => {
    $('.page-width[data-step-handle="height"]').find(".next-button").removeClass("disabled");
  }, 500);
}

// Fit Finder Initialize
theme_custom.fitFinderInit = function () {
  theme_custom.fitFinderClickEvent();
  theme_custom.fitFinderChangeEvent();
  if (localStorage.getItem("edit-fit-finder") == "true") {
    theme_custom.editFitFinder();
  }
}

// Fit Finder DOM Ready Event
$(document).ready(function () {
  theme_custom.fitFinderInit();
  theme_custom.globalErrorMessage = `<div class="required-error text_center"><p>You've entered a value outside of our expected range. We're happy to assist if you contact us at <a href="mailto:info@groomsclub.com">info@groomsclub.com.</a> Thank you!</p></div>`;
  theme_custom.requiredErrorMsg = `<div class="required-error text_center"><p>Please supply an answer</p></div>`;
  theme_custom.NumberErrorMsg = `<div class="required-error text_center"><p>Please enter number only</p></div>`;
  theme_custom.heightScroll = $("#shopify-section-header").height() + $(".breadcrumb").height() + 30;
})
window.moveToLastPage = function(){
  if(getCookie('lastpage')){
    window.location.href = getCookie('lastpage'); 
  }else{
    window.history.back();
  }
}