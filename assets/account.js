// const { ready } = require("jquery");

// constant define
const API_URL = theme_custom.api_base_url;
// const APP_Token = "Bearer XtkRwrz3zIljk6FsH74pnGAIwPkgQouqz9kM4XOEm3MsP6F0FwtaVc3oKxQbGdxbAF9uD1lYj3HnDvst22Z1SnAycTBYT0RHRA";
const APP_Token = 'Bearer ' + localStorage.getItem("customerToken")
const loader_content = `<div class="loading-overlay__spinner">
                            <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                            </svg>
                        </div>`;
theme_custom.favLooksData = [];
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
    var limit = 100;

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
            // debugger;
            var eventBlockCount = result.data.totalEvents;
            var allEvents = result.data.events;
            var myEvents = allEvents.filter((event)=> event.hostedBy.toLowerCase() == 'me');
            var otherEvents = allEvents.filter((event)=> event.hostedBy.toLowerCase() != 'me');
            var eventsObj = [myEvents,otherEvents]
            console.log("eventsObj",eventsObj);

            var pageCount = eventBlockCount / limit;
            if (result.success) {       
                if (result.data.events.length > 0) {
                    for(let i = 0;i<eventsObj.length;i++){
                        let activeClass = "";
                        if(i == 0){
                            activeClass = 'active' 
                        }
                        var append_event_html = `<input type="hidden" class="eventtype-hidden" value="${eventType}">`;
                        let eventData = eventsObj[i];
                        let count = 1;
                        for(j=0;j<eventData.length;j++){
                            let index = (j+1);
                            index = index % 3
                            let event = eventData[j];
                            var event_picture = event.picture;
                            if (!event_picture) {
                                event_picture = default_event_image;
                            }
                            var month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            var date = new Date(event.event_date);
                            let month = month_name[date.getMonth()];
                            let day = date.getDate();
                            let ownCreated = event.hostedBy.toLowerCase() == 'me' ? true : false;
                            if (ownCreated) {
                                var pageLink = `/pages/my-event?event_id=${event.event_id}`;
                            } else {
                                var pageLink = `/pages/invited?event_id=${event.event_id}+member_id=${event.member_id}`;
                            }
                            let eventActiveClass = "";
                            if(count == 1){
                                eventActiveClass = "active";
                            }

                            let btns = "";
                            if(!ownCreated){
                                btns = `<div class="event-hostedby"><span>Hosted by ${event.hostedBy}</span></div>`
                            }else{
                                btns = `<div class="event-action-btns">
                                <a href="${pageLink}" class="events-main-link event-edit-btn" data-hosted-by="${event.hostedBy}">Edit</a>
                                <a href="${pageLink}" class="events-main-link event-delete-btn" data-hosted-by="${event.hostedBy}">Delete</a>
                            </div>`
                            }
                            append_event_html += `<div data-value="${count}" class="events-container ${eventActiveClass}"> <div class="event-container-date"><span>${day}</span> ${month}</div>
                                <div class="event-container-image"><img src="${event_picture}" alt="default-event-image"></div>
                                <div class="event-container-event-content">
                                    <div class="event-title"><span>${event.name}</span></div>
                                    ${btns}
                                </div>
                                <div class="event-container-arrow"><a href="${pageLink}" style="display:inline-block" class="custom-event-button" data-hosted-by="${event.hostedBy}">
                                   <img src="https://cdn.shopify.com/s/files/1/0585/3223/3402/files/next_1.png?v=1677956518" />
                                </a>
                                </div>
                            </div>`;
                            if(index == 0){
                                count = count + 1;
                            }
                        }
                        let paginationWrapper = $(`<div class="pagination-wrapper"></div>`);
                        let paginateNumber = Math.ceil(eventData.length / 3);
                        for(j=0;j<paginateNumber;j++){
                            let pageActiveClass = j == 0 ? 'current':''
                            paginationWrapper.append(`<span class="count-number ${pageActiveClass}" data-page="${j+1}"> ${(j + 1)}</span>`)
                        }
                        let containerDiv = $(`<div class="event-container-wrapper event-container-${i} ${activeClass}"></div>`)
                        containerDiv.append(append_event_html);
                        containerDiv.append(paginationWrapper);
                        if(i == 0){
                            containerDiv.append(`<div class="add-new-event-btn btn-wrapper">
                            <a class="button button--primary continue-btn" href="/pages/create-event">CREATE NEW EVENT <i class="fas fa-arrow-right"></i></a>
                        </div>`)
                        }else{
                            containerDiv.append(`<div class="add-new-event-btn btn-wrapper">
                            <a class="button button--primary continue-btn" href="/pages/create-event">SHOP COLLECTION <i class="fas fa-arrow-right"></i></a>
                          </div>`)
                        }
                        
                                            
                        // append_event_html += `<div class="event-pagination"><span class="event-pre ${pre_class}" data-page="${pre_page-1}">Pre</span> <span class="event-next ${next_class}" data-page="${next_page}">Next</span></div>`;
                       if( i == 0){
                        $('.events-main-container').html("");
                       }
                        $('.events-main-container').hide().append(containerDiv).slideDown('slow');
                    }
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
    let page = $(this).attr('data-page');
    let parent = $(this).closest('.event-container-wrapper');
    $('.events-container',parent).removeClass('active');
    $(`.events-container[data-value="${page}"]`,parent).addClass('active');
    // var nextpage = $(this).data('page');
    // var eventtype = $('.eventtype-hidden').val();
    // if (nextpage) {
    //     theme_custom.geteventslist(eventtype = eventtype, pageno = nextpage, hostby = 0);
    // }
})

//event List pagination 
$(document).on('click', '.event-types-btn-wrap .event-types-btn', function () {
    let parent = $(this).closest('.event-types-btn-wrap');
    $(".event-types-btn",parent).removeClass("active");
    $(this).addClass("active")
    let page = $(this).attr('data-id');
    $('.events-main-container .event-container-wrapper').removeClass('active');
    $(`.events-main-container .event-container-wrapper.event-container-${page}`).addClass('active');
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
                    theme_custom.favLooksData = result.data;
                    console.log("result.data",result.data);
                    var append_fav_html = "";
                    $('.feature-looks-slider').html(append_fav_html);
                    var edit_link = '';
                    // result.data[1] = result.data[0];
                    // result.data[2] = result.data[0];
                    // result.data[3] = result.data[0];
                    // result.data[4] = result.data[0];
                    result.data = result.data.reverse();
                    for (var i = 0; i < result.data.length; i++) {                        
                        if (result.data[i].look_image) {
                            favorite_look_image = result.data[i].look_image;
                        }

                        if (result.data[i].url) {
                            edit_link = `<span data-href="${result.data[i].url}" class="btn-customiser button button--primary edit-favorite-look-button">CUSTOMIZE</span>`;
                        } else {
                            edit_link = ``;
                        }
                        append_fav_html += `<div class="look-container slider-lr-spacing-inner">
                        <div class="img-container product-slider-img">
                          <img src="${favorite_look_image}" alt="favourite-look-img">
                          ${edit_link}
                        </div>
                        <div class="look-img-title product-slider-title h3">
                            <span>${result.data[i].name}</span>
                        </div>
                        <div class="delete-fav-wrap">
                        <span><a href="javascript:void(0)" class="link delete_favorites" data-favid="${result.data[i].id} " >Remove</a></span>
                        </div>
                        <div class="look-changes btn-wrapper product-slider-detail-edit">
                          <a  class="button button--primary fav-look-add-to-cart" data-index="${i}">Add to Cart</a>
                          <a href="javascript:void(0)" data-favid="${result.data[i].id}" class="link addevent_fav button button--primary btn-1 link">ADD TO EVENT</a>
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
    localStorage.setItem("editLookId",$(this).attr("edit-look-id"));
    localStorage.setItem("editLookName",$(this).attr("edit-look-name"));
});

$(document).on('click', '.delete_favorites', function () {
    var favid = $(this).data('favid');
    var confirms = confirm("Are you sure you want to remove this?");
    if (favid && confirms) {
        deletefavoritelooks(favid);
    }

});

$(document).on('click','.feature-looks-slider .fav-look-add-to-cart',function(){
    let index = parseInt($(this).attr('data-index'));
    let data = theme_custom.favLooksData[index];
    let lookItems = data.items;
    let items = [];
    lookItems.forEach((item)=>{
        items.push({
            'id':item.variant_id,
             'quantity': 1
        })
    })

    let formData = {items};
    fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        return response.json();
    })
    .then((data)=>{
        window.location.href = '/cart';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
})
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

$(document).on('click', '.addevent_fav', function (e) {
    e.preventDefault();
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
    if(id == '#tab-3'){
        $('.feature-looks-slider').slick('refresh');
    }
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

if(localStorage.getItem("event-or-fav-when-user-has-not-logged")=='true'){
    localStorage.removeItem("event-or-fav-when-user-has-not-logged");
    theme_custom.checkProductLinkAvailable();
}