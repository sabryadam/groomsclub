// constant define
const API_URL = theme_custom.api_base_url;
// const APP_Token = "Bearer XtkRwrz3zIljk6FsH74pnGAIwPkgQouqz9kM4XOEm3MsP6F0FwtaVc3oKxQbGdxbAF9uD1lYj3HnDvst22Z1SnAycTBYT0RHRA";
const APP_Token = 'Bearer ' + localStorage.getItem("customerToken")
const loader_content = `<div class="loading-overlay__spinner">
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                            </svg>
                        </div>`;

theme_custom.checkProductLinkAvailable = function () {
    if (localStorage.getItem("previous-page-link") == "true") {
        var productLink = localStorage.getItem("page-link");
        localStorage.removeItem("page-link");
        localStorage.removeItem("previous-page-link");
        setTimeout(() => {
            window.location.href = productLink;
        }, 500);
    }
}

// Size APi

function getsizedata() {
    var size_api_url = API_URL + '/api/customer/myFit';
    var jacket_image = "https://cdn.shopify.com/s/files/1/0585/3223/3402/files/jacket-vest.png";
    var pants_image = "https://cdn.shopify.com/s/files/1/0585/3223/3402/files/account-2.png";
    var shirt_image = "https://cdn.shopify.com/s/files/1/0585/3223/3402/files/shirt-display-img.png?v=1641880242";
    var shoe_image = "https://cdn.shopify.com/s/files/1/0585/3223/3402/files/shoes-display-img.png?v=1641880242";
    $.ajax({
        url: size_api_url,
        method: "GET",
        data: '',
        dataType: "json",
        headers: {
            "Authorization": APP_Token
        },
        beforeSend: function () {
            var loader = loader_content;
            $('.my-size-block-main').html(loader);
            $('.my-size-block-main').addClass('displayBlock');
        },
        success: function (result) {
            if (result.success) {
                if (result.data.length > 0) {
                    var append_size_html = "";
                    for (var i = 0; i < result.data.length; i++) {

                        var setFitFinderCookie = {
                            "customer_id": result.data[i].customer_id,
                            "user_email": result.data[i].email,
                            "age_qus": result.data[i].age_qus,
                            "age": result.data[i].age,
                            "build_qus": result.data[i].build_qus,
                            "build": result.data[i].build,
                            "fit_qus": result.data[i].fit_qus,
                            "fit": result.data[i].fit,
                            "height_qus": result.data[i].height_qus,
                            "height": result.data[i].height,
                            "stomach_qus": result.data[i].stomach_qus,
                            "stomach": result.data[i].stomach,
                            "weight_qus": result.data[i].weight_qus,
                            "weight": result.data[i].weight,
                            "jacket_type_question": result.data[i].jacket_type_question,
                            "jacket_type": result.data[i].jacket_type,
                            "jacket_size_question": result.data[i].jacket_size_question,
                            "jacket_size": result.data[i].jacket_size,
                            "pants_waist_question": result.data[i].pants_waist_question,
                            "pants_waist_output": result.data[i].pants_waist,
                            "pants_waist": result.data[i].pants_waist,
                            "pants_hight_question": result.data[i].pants_hight_question,
                            "pants_hight_output": result.data[i].pants_hight,
                            "pants_hight": result.data[i].pants_hight,
                            "shirt_neck_question": result.data[i].shirt_neck_question,
                            "shirt_neck_output": result.data[i].shirt_neck,
                            "shirt_neck": result.data[i].shirt_neck,
                            "shirt_sleeve_question": result.data[i].shirt_sleeve_question,
                            "shirt_sleeve_output": result.data[i].shirt_sleeve,
                            "shirt_sleeve": result.data[i].shirt_sleeve,
                            "shoe_size_question": result.data[i].shoe_size_question,
                            "shoe_size_output": result.data[i].shoe_size,
                            "shoe_size": result.data[i].shoe_size,
                            "jacketSize_output": result.data[i].jacketSize,
                            "jacketSize_result": result.data[i].jacketSize_result,
                            "jacketSize": result.data[i].jacketSize
                        }

                        var jacketType = result.data[i].jacketSize.split(":");
                        var jacketTypeVal = '';
                        if (jacketType[1] == "S") {
                            jacketTypeVal = 'Short'
                        } else if (jacketType[1] == "R") {
                            jacketTypeVal = 'Regular'
                        } else if (jacketType[1] == "L") {
                            jacketTypeVal = 'Long'
                        }
                        setCookie("fit-finder-data", JSON.stringify(setFitFinderCookie));
                        append_size_html += `<input class="size_customer_id" type="hidden" value="${result.data[i].customer_id}">`;
                        if (result.data[i].jacketSize) {
                            append_size_html += `<div class="block1 my-size-block jacketSize_block">
                                <div class="block-wrap">
                                <div class="img-section"><img src="${jacket_image}" alt="jacket-vest"></div>
                                <div class="block-info">
                                    <div class="block-title">Jacket</div>
                                    <div class="size-wrap">
                                    <span class="size-number">Chest: ${jacketType[0]}</span> 
                                    <span class="size-type">Length: ${jacketTypeVal}</span>
                                    </div>
                                    <div class="acc-edit-size-main">
                                    <a href="javascript:void(0)" data-popup="edit-jacket" class="acc-edit-mysize">Edit Size</a>
                                    </div>
                                </div>
                                </div>
                            </div>`;
                        }
                        if (result.data[i].pants_waist && result.data[i].pants_hight) {
                            append_size_html += `<div class="block1 my-size-block pant_block">
                                <div class="block-wrap">
                                <div class="img-section"><img src="${pants_image}" alt="pants_image"></div>
                                <div class="block-info">
                                    <div class="block-title">Pants</div>
                                    <div class="size-wrap">
                                    <span class="size-number">Waist: ${result.data[i].pants_waist}W</span> 
                                    <span class="size-type">Length: ${result.data[i].pants_hight}H</span>
                                    </div>
                                    <div class="acc-edit-size-main">
                                    <a href="javascript:void(0)" data-popup="edit-pants" class="acc-edit-mysize">Edit Size</a>
                                    </div>
                                </div>
                                </div>
                            </div>`;
                        }
                        if (result.data[i].shirt_neck && result.data[i].shirt_sleeve) {
                            append_size_html += `<div class="block1 my-size-block shirt_block">
                                <div class="block-wrap">
                                <div class="img-section"><img src="${shirt_image}" alt="shirt-display-img"></div>
                                <div class="block-info">
                                    <div class="block-title">Shirt</div>
                                    <div class="size-wrap">
                                        <span class="size-number">Neck: ${result.data[i].shirt_neck}</span> 
                                        <span class="size-type">Sleeve: ${result.data[i].shirt_sleeve}</span>
                                    </div>
                                    <div class="acc-edit-size-main">
                                    <a href="javascript:void(0)" data-popup="edit-shirt" class="acc-edit-mysize">Edit Size</a>
                                    </div>
                                </div>
                                </div>
                            </div>`;
                        }
                        if (result.data[i].shoe_size) {
                            append_size_html += `<div class="block1 my-size-block shoe_block">
                                <div class="block-wrap">
                                <div class="img-section"><img src="${shoe_image}" alt="shoe_image"></div>
                                <div class="block-info">
                                    <div class="block-title">Shoes</div>
                                    <div class="size-wrap">
                                        <span class="size-number">Size: ${result.data[i].shoe_size}</span> 
                                    </div>
                                    <div class="acc-edit-size-main">
                                    <a href="javascript:void(0)"data-popup="edit-shoes" class="acc-edit-mysize">Edit Size</a>
                                    </div>
                                </div>
                                </div>
                            </div>`;
                        }
                    }
                    $(".sucess-message").remove();
                    $('.my-size-block-main').hide().html(append_size_html).slideDown('slow');
                    $('.my-size-block-main').removeClass('displayBlock');
                    $(".fit-finder-label").text("Retry the Fit Finder");
                    theme_custom.checkProductLinkAvailable();
                } else {
                    $(".my-size-block-main").css({
                        "display": "block",
                        "min-height": "auto"
                    });
                    // var html = `<div class="empty_message sizeempty_msg text_center"> We didn't find the size data....</div>`;
                    var html = `<div class="empty_message sizeempty_msg text_center">${theme_custom.fitFinderEmptyMsg}</div>`;
                    $('.my-size-block-main').html(html);
                    $('.my-size-block-main').removeClass('displayBlock');
                    $(".fit-finder-label").text("Add Sizes")
                }

            } else {
                // alert(result.data.success);
            }

        },
        error: function (xhr, status, error) {

            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $('.my-size-block-main').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                    'text-align': 'center',
                    'color': 'red'
                });
                setTimeout(() => {
                    window.location.href = '/account/logout';
                }, 5000);
            } else {
                $('.my-size-block-main').html(xhr.responseJSON.message);
            }

        }
    });

}

//Get My Events list API

theme_custom.geteventslist = function (eventtype = 1, pageno = 1, hostby = 0) {
    var event_api_url = API_URL + '/api/customer/events';
    var default_event_image = "https://cdn.shopify.com/s/files/1/0585/3223/3402/files/default-event-img.jpg?v=1654156190";
    var eventType = eventtype;
    var page = pageno;
    var host = hostby;
    var limit = 3;

    var data = {
        "eventType": eventType,
        "page": page,
        "host": host,
        "limit": limit
    };
    $.ajax({
        url: event_api_url,
        method: "POST",
        data: data,
        dataType: "json",
        headers: {
            "Authorization": APP_Token
        },
        beforeSend: function () {
            var loader = loader_content;
            $('.events-main-container').html(loader);

        },
        success: function (result) {
            var eventBlockCount = result.data.totalEvents;
            var pageCount = eventBlockCount / limit;
            if (eventBlockCount > 3) {
                var paginationBlock = setInterval(function () {
                    if ($(".pagination-wrapper").length > 0) {
                        for (var i = 0; i < pageCount; i++) {
                            $(".pagination-wrapper").append('<span class="count-number" data-page="' + (i + 1) + '">' + (i + 1) + '</li> ');
                            // if(i>limit){
                            //     $(".pagination-wrapper span.count-number").eq(i).hide();
                            // }
                        }
                        $(".pagination-wrapper .count-number").first().addClass("current");
                        // console.log("result.data",result.data);
                        if(result.data.nextPage == null){
                            $(".pagination-wrapper .count-number").removeClass("current");
                            $('.pagination-wrapper .count-number:last-child').addClass("current");
                        }else{
                            var currentPage = result.data.nextPage - 1;
                            $(".pagination-wrapper .count-number").removeClass("current");
                            $('.pagination-wrapper .count-number[data-page="' + currentPage + '"]').addClass("current");
                        }
                    }
                    clearInterval(paginationBlock);
                }, 500);
            }

            var next_class = pre_class = "disable_class";
            var pre_page = next_page = 0;
            if (result.success) {
                
                var next_class = pre_class = "";
                next_page = result.data.nextPage;
                pre_page = page;
                if (result.data.nextPage == null) {
                    next_class = "disable_class";
                }
                if (page == 1) {
                    pre_class = "disable_class";
                }
                if (result.data.events.length > 0) {
                    var append_event_html = `<input type="hidden" class="eventtype-hidden" value="${eventType}">`;

                    for (var i = 0; i < result.data.events.length; i++) {
                        var event_picture = result.data.events[i].picture;
                        if (!event_picture) {
                            event_picture = default_event_image;
                        }
                        var month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        var date = new Date(result.data.events[i].event_date);
                        let month = month_name[date.getMonth()];
                        let day = date.getDate();
                        if (result.data.events[i].hostedBy == 'Me' || result.data.events[i].hostedBy == 'me') {
                            var pageLink = `/pages/my-event?event_id=${result.data.events[i].event_id}`;
                        } else {
                            var pageLink = `/pages/invited?event_id=${result.data.events[i].event_id}+member_id=${result.data.events[i].member_id}`;
                        }
                        append_event_html += `<div class="events-container"> <div class="event-container-date"><span>${day}</span> ${month}</div>
                            <div class="event-container-image"><img src="${event_picture}" alt="default-event-image"></div>
                            <div class="event-container-event-content">
                                <div class="event-title"><span>${result.data.events[i].name}</span></div>
                                <div class="event-hostedby"><i class="fas fa-user-tie"></i><span>Hosted by ${result.data.events[i].hostedBy}</span></div>
                                <div class="event-action-btns">
                                    <a href="${pageLink}" class="events-main-link event-edit-btn" data-hosted-by="${result.data.events[i].hostedBy}">Edit</a>
                                    <a href="${pageLink}" class="events-main-link event-delete-btn" data-hosted-by="${result.data.events[i].hostedBy}">Delete</a>
                                </div>
                            </div>
                            <div class="event-container-arrow"><a href="${pageLink}" style="display:inline-block" class="custom-event-button" data-hosted-by="${result.data.events[i].hostedBy}">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="25" height="25" fill="url(#pattern0)"/>
                                    <defs>
                                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlink:href="#image0_4_172" transform="scale(0.0078125)"/>
                                    </pattern>
                                    <image id="image0_4_172" width="128" height="128" xlink:href="data:image/png;base64,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"/>
                                    </defs>
                                </svg>
                                </a>
                            </div>
                        </div>`;
                    }
                    append_event_html += `<div class="pagination-wrapper"></div>`;
                    // append_event_html += `<div class="event-pagination"><span class="event-pre ${pre_class}" data-page="${pre_page-1}">Pre</span> <span class="event-next ${next_class}" data-page="${next_page}">Next</span></div>`;
                    $('.events-main-container').hide().html(append_event_html).slideDown('slow');
                    $(".event-list-top").removeClass("hidden");
                   
                } else {
                    $(".events-main-container").css({
                        "display": "block",
                        "min-height": "auto"
                    });
                    var html = `<div class="empty_message sizeempty_msg"> We didn't find the event....</div>`;
                    $('.events-main-container').html(html);
                }
            } else {
                // alert(result.data.success);
            }


        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $('.events-main-container').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                    'text-align': 'center',
                    'color': 'red'
                });
                setTimeout(() => {
                    window.location.href = '/account/logout';
                }, 5000);
            } else {
                $('.events-main-container').html(xhr.responseJSON.message);
                // $('.events-main-container').append(xhr);
            }

        }
    });

}

$(document).on("click", ".events-main-container .custom-event-button, .events-main-link ", function () {
    var hostedBy = $(this).data("hosted-by");
    localStorage.setItem("hosted-by", hostedBy);
})

//event List pagination 
$(document).on('click', '.count-number', function () {
    $(".count-number").removeClass("current");
    $(this).addClass("current")
    var nextpage = $(this).data('page');
    var eventtype = $('.eventtype-hidden').val();
    if (nextpage) {
        theme_custom.geteventslist(eventtype = eventtype, pageno = nextpage, hostby = 0);
    }
})
$(document).on('click', '.event-next', function () {
    var nextpage = $(this).data('page');
    var eventtype = $('.eventtype-hidden').val();
    if (nextpage) {
        theme_custom.geteventslist(eventtype = eventtype, pageno = nextpage, hostby = 0);
    }
})
$(document).on('click', '.event-pre', function () {
    var prepage = $(this).data('page');
    var eventtype = $('.eventtype-hidden').val();
    if (prepage) {
        theme_custom.geteventslist(eventtype = eventtype, pageno = prepage, hostby = 0);
    }
})
// event List pagination

// Event List tab click
$(document).on('click', '.upcoming-event-tab', function () {
    $(".past-event-tab").removeClass("active");
    $(this).addClass("active");
    theme_custom.geteventslist(eventtype = 1, pageno = 1, hostby = 0);
})

$(document).on('click', '.past-event-tab', function () {
    $(".upcoming-event-tab").removeClass("active");
    $(this).addClass("active");
    theme_custom.geteventslist(eventtype = 0, pageno = 1, hostby = 0);
})


//Favorite Looks API
function favoritelooks() {
    var favorite_api_url = API_URL + '/api/look/favouriteLooks';
    var favorite_look_image = 'https://cdn.shopify.com/s/files/1/0585/3223/3402/files/product-img-3.png?v=1634963523';
    $.ajax({
        url: favorite_api_url,
        method: "GET",
        data: '',
        dataType: "json",
        headers: {
            "Authorization": APP_Token
        },
        beforeSend: function () {
            var loader = loader_content;
            $('.feature-looks-slider-loader').html(loader);

        },
        success: function (result) {
            $('.feature-looks-slider-loader').remove();
            if (result.success) {
                if (result.data.length > 0) {
                    var append_fav_html = "";
                    $('.feature-looks-slider').html(append_fav_html);
                    var edit_link = '';
                    result.data = result.data.reverse();
                    for (var i = 0; i < result.data.length; i++) {                        
                        if (result.data[i].look_image) {
                            favorite_look_image = result.data[i].look_image;
                        }

                        if (result.data[i].url) {
                            edit_link = `<span data-href="${result.data[i].url}" class=" button button--primary btn-1 link edit-favorite-look-button">Edit look</span>`;
                        } else {
                            edit_link = ``;
                        }
                        append_fav_html += `<div class="look-container slider-lr-spacing-inner">
                        <div class="img-container product-slider-img">
                          <img src="${favorite_look_image}" alt="favourite-look-img">
                          <a class="btn-customiser button button--primary">CUSTOMIZE</a>
                        </div>
                        <div class="look-img-title product-slider-title h3">
                            <span>${result.data[i].name}</span>
                        </div>
                        <div class="delete-fav-wrap">
                        <span><a href="javascript:void(0)" class="link delete_favorites" data-favid="${result.data[i].id} " >Remove</a></span>
                        </div>
                        <div class="look-changes btn-wrapper product-slider-detail-edit">
                          <a href="javascript:void(0)" data-favid="${result.data[i].id}" class="link addevent_fav button button--primary">Add to Event</a>
                          ${edit_link}
                        </div>
                        <share-button class="product-share-button product-small-share-icon">
                          <span class="share-button_label">
                            Share
                          </span>
                          <ul class="product__list-social list-unstyled list-social" role="list">
                            <li class="list-social__item">
                              <a target="_blank" href="mailto:?subject=I think you'll love this&amp;body=I saw something at ${theme_custom.shop_name} I think you'll love! ${result.data[i].url}" class="link list-social__link" aria-describedby="a11y-external-message">
                                <i class="fas fa-envelope"></i>
                                <span class="visually-hidden">Email</span>
                              </a>
                              </li><li class="list-social__item">
                                <a target="_blank" href="//www.facebook.com/sharer.php?u=${result.data[i].url}" class="link list-social__link" aria-describedby="a11y-external-message">
                                  <i class="fab fa-facebook-square"></i>
                                  <span class="visually-hidden">Facebook</span>
                                </a>
                              </li><li class="list-social__item">
                                <a target="_blank" href="//twitter.com/share?text=${result.data[i].name}&amp;url=${result.data[i].url}" class="link list-social__link" aria-describedby="a11y-external-message">
                                  <i class="fab fa-twitter-square"></i>
                                  <span class="visually-hidden">Twitter</span>
                                </a>
                              </li><li class="list-social__item">
                                <a target="_blank" href="//pinterest.com/pin/create/button/?url=${result.data[i].url}&amp;url=${result.data[i].url}" class="link list-social__link" aria-describedby="a11y-external-message">
                                  <i class="fab fa-pinterest-square"></i>
                                  <span class="visually-hidden">YouTube</span>
                                </a>
                              </li>
                          </ul>
                          </share-button>
                      </div>`;


                    }
                    $('.feature-looks-slider').html(append_fav_html);
                    $('.feature-looks-slider').slick('refresh');
                } else {
                    var html = `<div class="empty_message sizeempty_msg text_center"> You haven't saved any Favorite Looks yet.</div>`;
                    $('.feature-looks-slider').html(html);
                }

            } else {
                // alert(result.data.success);
            }


        },
        error: function (xhr, status, error) {
            $('.feature-looks-slider-loader').hide();
            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $('.feature-looks-slider').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                    'text-align': 'center',
                    'color': 'red'
                });
                setTimeout(() => {
                    window.location.href = '/account/logout';
                }, 5000);
            } else {
                $('.feature-looks-slider').html(xhr.responseJSON.message);
            }

        }
    });
}


// Delete the favorite looks

function deletefavoritelooks(looksoid) {
    var favorite_api_url = API_URL + '/api/look/removeFromFavourite/';
    if (looksoid) {
        favorite_api_url = API_URL + '/api/look/removeFromFavourite/' + looksoid;

        $.ajax({
            url: favorite_api_url,
            method: "DELETE",
            data: '',
            dataType: "json",
            headers: {
                "Authorization": APP_Token
            },
            beforeSend: function () {
                $('.favorite-looks-wrapper').css('cursor', 'not-allowed');

            },
            success: function (result) {
                $('.favorite-looks-wrapper').css('cursor', 'allowed');
                favoritelooks();

            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                    $('.feature-looks-slider').html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                        'text-align': 'center',
                        'color': 'red'
                    });
                    setTimeout(() => {
                        window.location.href = '/account/logout';
                    }, 5000);
                } else {
                    $('.feature-looks-slider').html(xhr.responseJSON.message);
                }
            }
        });

    }

}

// edit-favorite-look-button page redirect 
$(document).on("click", ".edit-favorite-look-button", function () {
    var getRediectUrl = $(this).attr("data-href");
    window.location.href = getRediectUrl;
    localStorage.setItem("customizerlookFrom", "exiting-looks");
    localStorage.setItem("customizerlookUrl", getRediectUrl.split("?")[1]);
});

$(document).on('click', '.delete_favorites', function () {
    var favid = $(this).data('favid');
    var confirms = confirm("Are you sure you want to remove this?");
    if (favid && confirms) {
        deletefavoritelooks(favid);
    }

});

// End Delete the favorite looks

//Add to Event for favorite Looks

function addtoeventlist(favid) {
    var event_api_url = API_URL + '/api/customer/events';
    var data = {
        "eventType": 1,
        "page": 1,
        "host": 0,
        "limit": 100
    };
    $.ajax({
        url: event_api_url,
        method: "POST",
        data: data,
        dataType: "json",
        headers: {
            "Authorization": APP_Token
        },
        beforeSend: function () {
            $('.favorite-looks-wrapper, .addevent-popup').css('cursor', 'wait');
        },
        success: function (result) {
            var event_list_html = '';
            $('.favorite-looks-wrapper, .addevent-popup').css('cursor', '');
            if (result.success) {
                if (result.data.events.length > 0) {
                    event_list_html += `<label class="form-label field__label hidden">Select Upcoming Event:</label> <select class="add_eventlist_select">
                    <option value="" selected> Select Event </option>`;
                    for (var i = 0; i < result.data.events.length; i++) {
                        if (result.data.events[i].hostedBy == 'Me' || result.data.events[i].hostedBy == 'me') {
                            event_list_html += `<option value="${result.data.events[i].event_id}"> ${result.data.events[i].name} </option>`;
                        }
                    }
                    event_list_html += `</select>`;
                    $('.event-option .form-wrap').html(event_list_html);
                    $('body').addClass("body_fixed");
                    $(".addevent-popup.custom-model-main").addClass('model-open');
                } else {
                    var errorPopup = `<section class="create-event-look" style="display: none;">
                                        <div class="empty-error-msg text_center">
                                            <p> We didn't find the Event Please <a href="/pages/create-event" title="Create Event">Create the Event </a> </p>
                                        </div>
                                    </section>`;
                    $('.favorite-looks-wrapper').append(errorPopup);
                    $.fancybox.open($('.create-event-look'));

                }

            }
            $('.favorite-looks-wrapper').css('cursor', '');
        },
        error: function () {
            $('.favorite-looks-wrapper').css('cursor', '');
        }
    });
}

$(document).on("click", ".close-btn", function () {
    $(this).closest(".addevent-popup ").removeClass("model-open");
    $("body").removeClass("body_fixed");
})

$(document).on('click', '.addevent_fav', function () {

    var favid = $(this).data('favid');


    $('#fav-lookupid').val(favid);
    if (favid) {
        addtoeventlist(favid);
    }

});
$(document).on('click', '.tabs-nav li a', function (e) {
    e.preventDefault();
    let mainParent = ('.main-account-page');
    let parent = $(this).closest('.tabs-nav');
    $('li',parent).removeClass('active');
    $(this).closest('li').addClass('active');
    $('#tabs-content .tab-content',mainParent).removeClass('active');
    let id = $(this).attr('href');
    $(mainParent).find(id).addClass('active');
    // var siteHeaderHeight = $('.header-wrapper').height() + 10;
    // $('html, body').animate({ scrollTop: $($(this).attr('href')).position().top - siteHeaderHeight }, '1000');
});
$(document).on('change', '.add_eventlist_select', function () {
    $('p.event-option-error').remove();
});

theme_custom.toDataURL = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

// theme_custom.LookImageCustomizer
theme_custom.LookImageCustomizer = function (look_image, lookID, button) {
    var button = button,
        form_data = new FormData(),
        fileVal = theme_custom.ImageURL,
        imageType = /image.*/;

    if (!fileVal.type.match(imageType)) {
        return;
    } else {
        form_data.append('lookImage', fileVal);
    }
    $.ajax({
        url: `${theme_custom.base_url}/api/look/picture/${lookID}`,
        method: "POST",
        timeout: "0",
        data: form_data,
        dataType: "json",
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        headers: {
            // "Authorization": 'Bearer BzuPQTFq84j4ZDX7EBpveJ0rzGo6Ljj1PQ4AXNMWtsnd5UsNn9kG1Pidd7EnFDVTadlI5eNpKOrfW5JoegG7FU3cXRQNjd0b3FMNA'
            "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        beforeSend: function () {

        },
        success: function (result) {
            button.removeClass("disabled").text("Added Look");
            $('.pop-up-content-wrap').append('<p class="text-center add-event-success-msg">' + result.message + '</p>');
            setTimeout(function () {
                button.removeClass("disabled");
                $('.add-event-success-msg').remove();
                $('.addevent-popup .close-btn').click();
            }, 3000);
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $(".look-api-message").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                    'text-align': 'center',
                    'color': 'red'
                });
                setTimeout(() => {
                    window.location.href = '/account/logout';
                }, 5000);
            } else {
                button.addClass("disabled").css("margin-top", "15px");
                button.removeClass("disabled").text("Add Look");
                $(".look-api-message").html(xhr.responseJSON.message).removeClass("look-api-message");
                setTimeout(() => {
                    $('.update-profile-image-popup-wrapper .api_error').hide();
                    $(".look-api-message").removeClass("look-api-message");
                }, 3000);
            }
        }
    });
}

$(document).on('click', '#addeventfav_btn', function () {
    var add_event_api_url = API_URL + '/api/look/addToEvent';
    var popup_parent = $(this).parents('.addevent-popup');
    var eventid = $(popup_parent).find('.add_eventlist_select').val();
    var favid = $(popup_parent).find('#fav-lookupid').val(),
        look_image_url = $(".product-slider-img img").attr("src");
    button = $(this);
    if (eventid == '') {
        $('.event-option .form-wrap').append('<p class="text-center event-option-error">Please select the event.</p>');
        return false;
    }
    var data = {
        "event_id": eventid,
        "look_id": favid
    };
    $.ajax({
        url: add_event_api_url,
        method: "POST",
        data: data,
        dataType: "json",
        headers: {
            "Authorization": APP_Token
        },
        beforeSend: function () {
            button.addClass("disabled");
        },
        success: function (result) {
            button.addClass("disabled");
            $('.pop-up-content-wrap').append('<p class="text-center add-event-success-msg">' + result.message + '</p>');
            setTimeout(function () {
                button.removeClass("disabled");
                $('.add-event-success-msg').remove();
                $('.addevent-popup .close-btn').click();
                window.location.href = '/pages/my-event?event_id=' + eventid;
            }, 3000);
            // theme_custom.toDataURL(look_image_url, function(dataUrl) {
            //     debugger;
            //     theme_custom.image_url = dataUrl;
            //     theme_custom.ImageURL = theme_custom.dataURLtoFile(theme_custom.image_url,'look-image.png');
            // });
            // theme_custom.LookImageCustomizer(favid,button);
        },
        error: function (xhr, status, error) {
            button.removeClass("disabled");
            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $(".addevent-popup .pop_error").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                    'text-align': 'center',
                    'color': 'red'
                });
                setTimeout(() => {
                    window.location.href = '/account/logout';
                }, 5000);
            } else {
                if (xhr.responseJSON.data.event_id.length > 0) {
                    for (let i = 0; i < xhr.responseJSON.data.event_id.length; i++) {
                        const element = xhr.responseJSON.data.event_id[i];
                        $(".addevent-popup .pop_error").html(element).css({
                            'text-align': 'center',
                            'color': 'red',
                            'margin-bottom': '15px'
                        });
                        setTimeout(() => {
                            $(".addevent-popup .pop_error").addClass("hidden");
                        }, 5000);
                    }
                } else {
                    $(".addevent-popup .pop_error").html(xhr.responseJSON.message);
                }
            }
        }
    });
});

// Onload function Call
if (getCookie("fit-finder-data") != '' && localStorage.getItem("save-fit-finder-flag-replace") == 'true') {
    var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
    var fitFinderJsonData = getFitFinder,
        age_qus = fitFinderJsonData.age_qus,
        age = fitFinderJsonData.age,
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
        pantSize = getFitFinder.pantSize,
        pantSizeArr = pantSize.split('x'),
        pants_waist_qus = fitFinderJsonData.pants_waist_qus,
        pants_waist = pantSizeArr[0],
        pants_hight_qus = fitFinderJsonData.pants_hight_qus,
        pants_hight = pantSizeArr[1],
        shirt_neck_qus = fitFinderJsonData.shirt_neck_qus,
        shirt_neck = fitFinderJsonData.shirt_neck,
        shirt_sleeve_qus = fitFinderJsonData.shirt_sleeve_qus,
        shirt_sleeve = fitFinderJsonData.shirt_sleeve,
        shoe_size_qus = fitFinderJsonData.shoe_size_qus,
        shoe_size = fitFinderJsonData.shoe_size,
        jacketSize = fitFinderJsonData.jacketSize,
        jacketSize_result = fitFinderJsonData.jacketSize_result;
    var userID = $("#custom_id_num").val(),
        userEmail = $("#custom_email").val();
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

    $.ajax({
        url: `${theme_custom.base_url}/api/customer/myFit`,
        method: "POST",
        data: fitFinder,
        dataType: "json",
        header: {
            // "Authorization": 'Bearer OsAKcJ5BUDxjOxIlt2Iv4SJlTZwkVaueTThLIpPHIE8GI4LwV8OV9LiaDbt3yjlrbWgMVzhqQmhitmYXxCc05iUXpxSTVtVlJaQg'
            "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        beforeSend: function () {
        },
        success: function (result) {
            localStorage.setItem("save-fit-finder-flag-replace", "false");
            $("#tab-1").find(".my-size-title").after(`<p class="sucess-message">Save My Sizes!</p>`);
            getsizedata();

            var bring_back_url = localStorage.getItem("bring_back_fit_finder_url");
            if(bring_back_url){
                window.location.href = bring_back_url;
                localStorage.removeItem("bring_back_fit_finder_url");
            }

            if (localStorage.getItem("previous-page-link", "true")) {
                window.location.href = localStorage.getItem("page-link")
            }
            if (localStorage.getItem("previous-page-link", "true")) {
                window.location.href = localStorage.getItem("page-link")
            }
            if (localStorage.getItem("customizerlookPageFitFinder")) {
                localStorage.setItem("gotoFitFinder", "true");
                window.location.href = '/pages/customize-your-look';
            }
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.message == 'Token is invalid or expired.') {
                $('.api_error').removeClass("hidden").html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
                    'text-align': 'center',
                    'color': 'red'
                });
                setTimeout(() => {
                    window.location.href = '/account/logout';
                }, 3000);
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
} else {
    getsizedata();
}
favoritelooks();
theme_custom.geteventslist(eventtype = 1, pageno = 1, hostby = 0);

theme_custom.editMySize= function(getFitFinder){
    var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
    var jacketType = getFitFinder.jacketSize.split(":");
    if (jacketType[1] == "S") {
      jacketTypeVal = 'Short'
    } else if (jacketType[1] == "R") {
      jacketTypeVal = 'Regular'
    } else if (jacketType[1] == "L") {
      jacketTypeVal = 'Long'
    }
    var pants_waist, pants_height;
    if (getFitFinder.pantSize != undefined) {
      var pantSizeArr = getFitFinder.pantSize.split('x');
      pants_waist = pantSizeArr[0],
      pants_height = pantSizeArr[1];
    } else {
      pants_waist = getFitFinder.pants_waist,
      pants_height = getFitFinder.pants_hight;
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
    pants_height = pants_height,
    shirt_neck = getFitFinder.shirt_neck,
    shirt_sleeve = getFitFinder.shirt_sleeve,
    jacket_size = jacketType[0],
    jacket_type = jacketTypeVal,
    fit = getFitFinder.fit;
    $(".step-wrapper[data-step-title='edit-jacket']").find(".height-feet").val(heightArr[0]);
    $(".step-wrapper[data-step-title='Height']").find(".height-inche").val(heightArr[1]);
    $(".step-wrapper[data-step-title='Height']").find(".user-height").val($("#user-height").val());
    $(`.height--wrap [name="height"][value='${height}']`).attr("checked", true).change();
    $("#weight").val(weight);
    $("#age").val(age);
    $(`[name="build"][value='${build}']`).attr("checked", true).change();
    $(`[name="stomach"][value='${stomach}']`).attr("checked", true).change();
    $(`[name="shoes"][value='${shoe_size}']`).attr("checked", true).change();
    $(`[name="waist"][value='${pants_waist}']`).attr("checked", true).change();
    $(`[name="inseam"][value='${pants_height}']`).attr("checked", true).change();
    $(`[name="neck"][value='${shirt_neck}']`).attr("checked", true).change();
    $(`[name="shirt-sleeve-length"][value='${shirt_sleeve}']`).attr("checked", true).change();
    $(`[name="jacket_size"][value='${jacket_size}']`).attr("checked", true).change();
    $(`[name="suit-jacket-length"][value='${jacket_type}']`).attr("checked", true).change();
    $(`[name="fit"][value='${fit}']`).attr("checked", true).change();
}

theme_custom.updateMySize = function (fitFinderJson, button) {
    var fitFinderJsonData = fitFinderJson;
      age_qus = fitFinderJsonData.age_qus,
      age = fitFinderJsonData.age,
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
      jacket_size_qus = fitFinderJsonData.jacket_size_question,
      jacket_size = fitFinderJsonData.jacket_size,
      jacket_type_qus = fitFinderJsonData.jacket_type_question,
      jacket_type = fitFinderJsonData.jacket_type,
      pants_waist_qus = fitFinderJsonData.pants_waist_question,
      pants_waist = fitFinderJsonData.pants_waist,
      pants_hight_qus = fitFinderJsonData.pants_hight_question,
      pants_hight = fitFinderJsonData.pants_hight,
      shirt_neck_qus = fitFinderJsonData.shirt_neck_question,
      shirt_neck = fitFinderJsonData.shirt_neck,
      shirt_sleeve_qus = fitFinderJsonData.shirt_sleeve_question,
      shirt_sleeve = fitFinderJsonData.shirt_sleeve,
      shoe_size_qus = fitFinderJsonData.shoe_size_question,
      shoe_size = fitFinderJsonData.shoe_size,
      jacketSize = fitFinderJsonData.jacketSize;
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
    //   "pantSize": pantSize,
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
      "jacketSize": jacketSize
    }
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
        // console.log("Result",result.data);
        var setFitFinderCookie = {
            "customer_id": result.data.customer_id,
            "user_email": result.data.email,
            "age_qus": result.data.age_qus,
            "age": result.data.age,
            "build_qus": result.data.build_qus,
            "build": result.data.build,
            "fit_qus": result.data.fit_qus,
            "fit": result.data.fit,
            "height_qus": result.data.height_qus,
            "height": result.data.height,
            "stomach_qus": result.data.stomach_qus,
            "stomach": result.data.stomach,
            "weight_qus": result.data.weight_qus,
            "weight": result.data.weight,
            "jacket_type_question": result.data.jacket_type_question,
            "jacket_type": result.data.jacket_type,
            "jacket_size_question": result.data.jacket_size_question,
            "jacket_size": result.data.jacket_size,
            "pants_waist_question": result.data.pants_waist_question,
            "pants_waist_output": result.data.pants_waist,
            "pants_waist": result.data.pants_waist,
            "pants_hight_question": result.data.pants_hight_question,
            "pants_hight_output": result.data.pants_hight,
            "pants_hight": result.data.pants_hight,
            "shirt_neck_question": result.data.shirt_neck_question,
            "shirt_neck_output": result.data.shirt_neck,
            "shirt_neck": result.data.shirt_neck,
            "shirt_sleeve_question": result.data.shirt_sleeve_question,
            "shirt_sleeve_output": result.data.shirt_sleeve,
            "shirt_sleeve": result.data.shirt_sleeve,
            "shoe_size_question": result.data.shoe_size_question,
            "shoe_size_output": result.data.shoe_size,
            "shoe_size": result.data.shoe_size,
            "jacketSize_output": result.data.jacketSize,
            "jacketSize_result": result.data.jacketSize_result,
            "jacketSize": result.data.jacketSize
        }
        button.text("Updated").removeClass("disabled");
        localStorage.removeItem("edit-fit-finder");
        setCookie("fit-finder-data", JSON.stringify(setFitFinderCookie));
        $('.edit-size-popup .api_error.success-event').remove();
        var successMsg = `<p class="api_error success-event" style="width: 100%;text-align: center;display: block;">${result.message}</p>`;
        if(button.closest('.edit-size-popup').find('.api_error.success-event').length == 0){
            button.closest('.edit-size-popup').find('.update-btn-main').after(successMsg).show();
        }else{
            button.closest('.edit-size-popup').find('.api_error.success-event').show();
        }
        var jacketType = result.data.jacketSize.split(":");
        // console.log("JacketType",jacketType);
        var jacketTypeVal = '';
        if (jacketType[1] == "S") {
            jacketTypeVal = 'Short'
        } else if (jacketType[1] == "R") {
            jacketTypeVal = 'Regular'
        } else if (jacketType[1] == "L") {
            jacketTypeVal = 'Long'
        }
        $('.jacketSize_block .size-number').text(`Size ${jacketType[0]}`);
        $('.jacketSize_block .size-type').text(`${jacketTypeVal}`);
        $('.pant_block .size-number').text(`Size ${result.data.pants_waist}W`);
        $('.pant_block .size-type').text(`${result.data.pants_hight}H`);
        $('.shirt_block .size-number').text(`Neck ${result.data.shirt_neck}`);
        $('.shirt_block .size-type').text(`Sleeve ${result.data.shirt_sleeve}`);
        $('.shoe_block .size-number').text(`Size ${result.data.shoe_size}`);
        setTimeout(() => {
            $(".fancybox-button").click();
            button.text("Update").removeClass("disabled");
            $('.edit-size-popup .api_error.success-event').hide();
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

$(document).on("click", ".update-btn-main .update-my-size", function (e) {
    var button = $(this),
    parent = $(this).closest('.edit-size-popup'),
    swatchData = parent.find(".page-width.step-wrapper"),
    error_count = 0,
    swatchRadioVal = '';
    swatchData.each(function(index,element){
        swatchRadioVal = $(element).find(`input[type="radio"]:checked`).val();
        if($(element).find('input[type="radio"]:checked').length == 0){
            error_count++;
            if($(element).find('.error-message').length == 0 ){
                $(element).append(`<p class="error-message" style="display: block">Please select ${$(element).find('h3').text().replace(':','')} option</p>`);
            }
        }
    });
    if(error_count > 0){
        button.addClass("disabled");
        e.preventDefault();
        return false;
    }else{
        var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
        if($(this).closest('.edit-size-popup').attr('data-popup') == 'edit-jacket'){
            var edit_jacket_size = $(this).closest('.edit-size-popup').find('[name="jacket_size"]:checked').val(),
                edit_jacket_length = $(this).closest('.edit-size-popup').find('[name="suit-jacket-length"]:checked').val(),
                edit_jacket_length_short = '';
            if (edit_jacket_length == "Short") {
                edit_jacket_length_short = 'S'
            } else if (edit_jacket_length == "Regular") {
                edit_jacket_length_short = 'R'
            } else if (edit_jacket_length == "Long") {
                edit_jacket_length_short = 'L'
            }
            getFitFinder['jacket_size'] = edit_jacket_size;
            getFitFinder['jacketSize'] = edit_jacket_size+':'+edit_jacket_length_short;
            getFitFinder['jacketSize_output'] = edit_jacket_size+':'+edit_jacket_length_short;
            getFitFinder['jacket_type'] = edit_jacket_length;
        }else if($(this).closest('.edit-size-popup').attr('data-popup') == 'edit-pants'){
            var edit_pant_waist_size = $(this).closest('.edit-size-popup').find('[name="waist"]:checked').val(),
                edit_pant_height = $(this).closest('.edit-size-popup').find('[name="inseam"]:checked').val();
                // console.log('edit_pant_height',edit_pant_height);
            getFitFinder['pants_waist'] = edit_pant_waist_size;
            getFitFinder['pants_waist_output'] = edit_pant_waist_size;
            getFitFinder['pants_hight'] = edit_pant_height;
            getFitFinder['pants_hight_output'] = edit_pant_height;
        }
        else if($(this).closest('.edit-size-popup').attr('data-popup') == 'edit-shirt'){
            var edit_shirt_neck_size = $(this).closest('.edit-size-popup').find('[name="neck"]:checked').val(),
                edit_sleeve_size = $(this).closest('.edit-size-popup').find('[name="shirt-sleeve-length"]:checked').val();
            getFitFinder['shirt_neck'] = edit_shirt_neck_size;
            getFitFinder['shirt_neck_output'] = edit_shirt_neck_size;
            getFitFinder['shirt_sleeve'] = edit_sleeve_size;
            getFitFinder['shirt_sleeve_output'] = edit_sleeve_size;
        }
        else if($(this).closest('.edit-size-popup').attr('data-popup') == 'edit-shoes'){
            var edit_shoe_size = $(this).closest('.edit-size-popup').find('[name="shoes"]:checked').val();
            getFitFinder['shoe_size'] = edit_shoe_size;
            getFitFinder['shoe_size_output'] = edit_shoe_size;
        }
        theme_custom.updateMySize(getFitFinder, button);
    }
});

$(document).on("click", ".my-size-wrapper .my-size-block .block-wrap .acc-edit-size-main a.acc-edit-mysize", function () {
    var parent = $(this).closest(".content-for-layout"),
    getsizeAttr = $(this).attr("data-popup");
    $.fancybox.open(parent.find(`.edit-size-popup[data-popup="${getsizeAttr}"]`));
    var getFitFinder = JSON.parse(getCookie("fit-finder-data"));
    theme_custom.editMySize(getFitFinder);
});

// swatch change event radio button
$('.edit-size-popup .step-wrapper input[type=radio]').on('change', function () {
    $(this).closest('.step-wrapper').find(".error-message").remove();
    $(this).closest('.edit-size-popup').find(".update-my-size").removeClass("disabled");
});