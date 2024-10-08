/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.5.9
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!function (a) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof exports ? module.exports = a(require("jquery")) : a(jQuery) }(function (a) {
  "use strict"; var b = window.Slick || {}; b = function () { function c(c, d) { var f, e = this; e.defaults = { accessibility: !0, adaptiveHeight: !1, appendArrows: a(c), appendDots: a(c), arrows: !0, asNavFor: null, prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>', nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>', autoplay: !1, autoplaySpeed: 3e3, centerMode: !1, centerPadding: "50px", cssEase: "ease", customPaging: function (a, b) { return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (b + 1) + "</button>" }, dots: !1, dotsClass: "slick-dots", draggable: !0, easing: "linear", edgeFriction: .35, fade: !1, focusOnSelect: !1, infinite: !0, initialSlide: 0, lazyLoad: "ondemand", mobileFirst: !1, pauseOnHover: !0, pauseOnDotsHover: !1, respondTo: "window", responsive: null, rows: 1, rtl: !1, slide: "", slidesPerRow: 1, slidesToShow: 1, slidesToScroll: 1, speed: 500, swipe: !0, swipeToSlide: !1, touchMove: !0, touchThreshold: 5, useCSS: !0, useTransform: !1, variableWidth: !1, vertical: !1, verticalSwiping: !1, waitForAnimate: !0, zIndex: 1e3 }, e.initials = { animating: !1, dragging: !1, autoPlayTimer: null, currentDirection: 0, currentLeft: null, currentSlide: 0, direction: 1, $dots: null, listWidth: null, listHeight: null, loadIndex: 0, $nextArrow: null, $prevArrow: null, slideCount: null, slideWidth: null, $slideTrack: null, $slides: null, sliding: !1, slideOffset: 0, swipeLeft: null, $list: null, touchObject: {}, transformsEnabled: !1, unslicked: !1 }, a.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp = null, e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.hidden = "hidden", e.paused = !1, e.positionProp = null, e.respondTo = null, e.rowCount = 1, e.shouldClick = !0, e.$slider = a(c), e.$slidesCache = null, e.transformType = null, e.transitionType = null, e.visibilityChange = "visibilitychange", e.windowWidth = 0, e.windowTimer = null, f = a(c).data("slick") || {}, e.options = a.extend({}, e.defaults, f, d), e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, "undefined" != typeof document.mozHidden ? (e.hidden = "mozHidden", e.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (e.hidden = "webkitHidden", e.visibilityChange = "webkitvisibilitychange"), e.autoPlay = a.proxy(e.autoPlay, e), e.autoPlayClear = a.proxy(e.autoPlayClear, e), e.changeSlide = a.proxy(e.changeSlide, e), e.clickHandler = a.proxy(e.clickHandler, e), e.selectHandler = a.proxy(e.selectHandler, e), e.setPosition = a.proxy(e.setPosition, e), e.swipeHandler = a.proxy(e.swipeHandler, e), e.dragHandler = a.proxy(e.dragHandler, e), e.keyHandler = a.proxy(e.keyHandler, e), e.autoPlayIterator = a.proxy(e.autoPlayIterator, e), e.instanceUid = b++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, e.registerBreakpoints(), e.init(!0), e.checkResponsive(!0) } var b = 0; return c }(), b.prototype.addSlide = b.prototype.slickAdd = function (b, c, d) { var e = this; if ("boolean" == typeof c) d = c, c = null; else if (0 > c || c >= e.slideCount) return !1; e.unload(), "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : d === !0 ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack), e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), e.$slideTrack.append(e.$slides), e.$slides.each(function (b, c) { a(c).attr("data-slick-index", b) }), e.$slidesCache = e.$slides, e.reinit() }, b.prototype.animateHeight = function () { var a = this; if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) { var b = a.$slides.eq(a.currentSlide).outerHeight(!0); a.$list.animate({ height: b }, a.options.speed) } }, b.prototype.animateSlide = function (b, c) { var d = {}, e = this; e.animateHeight(), e.options.rtl === !0 && e.options.vertical === !1 && (b = -b), e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({ left: b }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({ top: b }, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? (e.options.rtl === !0 && (e.currentLeft = -e.currentLeft), a({ animStart: e.currentLeft }).animate({ animStart: b }, { duration: e.options.speed, easing: e.options.easing, step: function (a) { a = Math.ceil(a), e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)", e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d)) }, complete: function () { c && c.call() } })) : (e.applyTransition(), b = Math.ceil(b), e.options.vertical === !1 ? d[e.animType] = "translate3d(" + b + "px, 0px, 0px)" : d[e.animType] = "translate3d(0px," + b + "px, 0px)", e.$slideTrack.css(d), c && setTimeout(function () { e.disableTransition(), c.call() }, e.options.speed)) }, b.prototype.asNavFor = function (b) { var c = this, d = c.options.asNavFor; d && null !== d && (d = a(d).not(c.$slider)), null !== d && "object" == typeof d && d.each(function () { var c = a(this).slick("getSlick"); c.unslicked || c.slideHandler(b, !0) }) }, b.prototype.applyTransition = function (a) { var b = this, c = {}; b.options.fade === !1 ? c[b.transitionType] = b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : c[b.transitionType] = "opacity " + b.options.speed + "ms " + b.options.cssEase, b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c) }, b.prototype.autoPlay = function () { var a = this; a.autoPlayTimer && clearInterval(a.autoPlayTimer), a.slideCount > a.options.slidesToShow && a.paused !== !0 && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed)) }, b.prototype.autoPlayClear = function () { var a = this; a.autoPlayTimer && clearInterval(a.autoPlayTimer) }, b.prototype.autoPlayIterator = function () { var a = this; a.options.infinite === !1 ? 1 === a.direction ? (a.currentSlide + 1 === a.slideCount - 1 && (a.direction = 0), a.slideHandler(a.currentSlide + a.options.slidesToScroll)) : (a.currentSlide - 1 === 0 && (a.direction = 1), a.slideHandler(a.currentSlide - a.options.slidesToScroll)) : a.slideHandler(a.currentSlide + a.options.slidesToScroll) }, b.prototype.buildArrows = function () { var b = this; b.options.arrows === !0 && (b.$prevArrow = a(b.options.prevArrow).addClass("slick-arrow"), b.$nextArrow = a(b.options.nextArrow).addClass("slick-arrow"), b.slideCount > b.options.slidesToShow ? (b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows), b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({ "aria-disabled": "true", tabindex: "-1" })) }, b.prototype.buildDots = function () { var c, d, b = this; if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) { for (d = '<ul class="' + b.options.dotsClass + '">', c = 0; c <= b.getDotCount(); c += 1)d += "<li>" + b.options.customPaging.call(this, b, c) + "</li>"; d += "</ul>", b.$dots = a(d).appendTo(b.options.appendDots), b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false") } }, b.prototype.buildOut = function () { var b = this; b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), b.slideCount = b.$slides.length, b.$slides.each(function (b, c) { a(c).attr("data-slick-index", b).data("originalStyling", a(c).attr("style") || "") }), b.$slider.addClass("slick-slider"), b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(), b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), b.$slideTrack.css("opacity", 0), (b.options.centerMode === !0 || b.options.swipeToSlide === !0) && (b.options.slidesToScroll = 1), a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"), b.setupInfinite(), b.buildArrows(), b.buildDots(), b.updateDots(), b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), b.options.draggable === !0 && b.$list.addClass("draggable") }, b.prototype.buildRows = function () { var b, c, d, e, f, g, h, a = this; if (e = document.createDocumentFragment(), g = a.$slider.children(), a.options.rows > 1) { for (h = a.options.slidesPerRow * a.options.rows, f = Math.ceil(g.length / h), b = 0; f > b; b++) { var i = document.createElement("div"); for (c = 0; c < a.options.rows; c++) { var j = document.createElement("div"); for (d = 0; d < a.options.slidesPerRow; d++) { var k = b * h + (c * a.options.slidesPerRow + d); g.get(k) && j.appendChild(g.get(k)) } i.appendChild(j) } e.appendChild(i) } a.$slider.html(e), a.$slider.children().children().children().css({ width: 100 / a.options.slidesPerRow + "%", display: "inline-block" }) } }, b.prototype.checkResponsive = function (b, c) { var e, f, g, d = this, h = !1, i = d.$slider.width(), j = window.innerWidth || a(window).width(); if ("window" === d.respondTo ? g = j : "slider" === d.respondTo ? g = i : "min" === d.respondTo && (g = Math.min(j, i)), d.options.responsive && d.options.responsive.length && null !== d.options.responsive) { f = null; for (e in d.breakpoints) d.breakpoints.hasOwnProperty(e) && (d.originalSettings.mobileFirst === !1 ? g < d.breakpoints[e] && (f = d.breakpoints[e]) : g > d.breakpoints[e] && (f = d.breakpoints[e])); null !== f ? null !== d.activeBreakpoint ? (f !== d.activeBreakpoint || c) && (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : null !== d.activeBreakpoint && (d.activeBreakpoint = null, d.options = d.originalSettings, b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b), h = f), b || h === !1 || d.$slider.trigger("breakpoint", [d, h]) } }, b.prototype.changeSlide = function (b, c) { var f, g, h, d = this, e = a(b.target); switch (e.is("a") && b.preventDefault(), e.is("li") || (e = e.closest("li")), h = d.slideCount % d.options.slidesToScroll !== 0, f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll, b.data.message) { case "previous": g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c); break; case "next": g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c); break; case "index": var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll; d.slideHandler(d.checkNavigable(i), !1, c), e.children().trigger("focus"); break; default: return } }, b.prototype.checkNavigable = function (a) { var c, d, b = this; if (c = b.getNavigableIndexes(), d = 0, a > c[c.length - 1]) a = c[c.length - 1]; else for (var e in c) { if (a < c[e]) { a = d; break } d = c[e] } return a }, b.prototype.cleanUpEvents = function () { var b = this; b.options.dots && null !== b.$dots && (a("li", b.$dots).off("click.slick", b.changeSlide), b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).off("mouseenter.slick", a.proxy(b.setPaused, b, !0)).off("mouseleave.slick", a.proxy(b.setPaused, b, !1))), b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow && b.$prevArrow.off("click.slick", b.changeSlide), b.$nextArrow && b.$nextArrow.off("click.slick", b.changeSlide)), b.$list.off("touchstart.slick mousedown.slick", b.swipeHandler), b.$list.off("touchmove.slick mousemove.slick", b.swipeHandler), b.$list.off("touchend.slick mouseup.slick", b.swipeHandler), b.$list.off("touchcancel.slick mouseleave.slick", b.swipeHandler), b.$list.off("click.slick", b.clickHandler), a(document).off(b.visibilityChange, b.visibility), b.$list.off("mouseenter.slick", a.proxy(b.setPaused, b, !0)), b.$list.off("mouseleave.slick", a.proxy(b.setPaused, b, !1)), b.options.accessibility === !0 && b.$list.off("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().off("click.slick", b.selectHandler), a(window).off("orientationchange.slick.slick-" + b.instanceUid, b.orientationChange), a(window).off("resize.slick.slick-" + b.instanceUid, b.resize), a("[draggable!=true]", b.$slideTrack).off("dragstart", b.preventDefault), a(window).off("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).off("ready.slick.slick-" + b.instanceUid, b.setPosition) }, b.prototype.cleanUpRows = function () { var b, a = this; a.options.rows > 1 && (b = a.$slides.children().children(), b.removeAttr("style"), a.$slider.html(b)) }, b.prototype.clickHandler = function (a) { var b = this; b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault()) }, b.prototype.destroy = function (b) { var c = this; c.autoPlayClear(), c.touchObject = {}, c.cleanUpEvents(), a(".slick-cloned", c.$slider).detach(), c.$dots && c.$dots.remove(), c.$prevArrow && c.$prevArrow.length && (c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()), c.$nextArrow && c.$nextArrow.length && (c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()), c.$slides && (c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () { a(this).attr("style", a(this).data("originalStyling")) }), c.$slideTrack.children(this.options.slide).detach(), c.$slideTrack.detach(), c.$list.detach(), c.$slider.append(c.$slides)), c.cleanUpRows(), c.$slider.removeClass("slick-slider"), c.$slider.removeClass("slick-initialized"), c.unslicked = !0, b || c.$slider.trigger("destroy", [c]) }, b.prototype.disableTransition = function (a) { var b = this, c = {}; c[b.transitionType] = "", b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c) }, b.prototype.fadeSlide = function (a, b) { var c = this; c.cssTransitions === !1 ? (c.$slides.eq(a).css({ zIndex: c.options.zIndex }), c.$slides.eq(a).animate({ opacity: 1 }, c.options.speed, c.options.easing, b)) : (c.applyTransition(a), c.$slides.eq(a).css({ opacity: 1, zIndex: c.options.zIndex }), b && setTimeout(function () { c.disableTransition(a), b.call() }, c.options.speed)) }, b.prototype.fadeSlideOut = function (a) { var b = this; b.cssTransitions === !1 ? b.$slides.eq(a).animate({ opacity: 0, zIndex: b.options.zIndex - 2 }, b.options.speed, b.options.easing) : (b.applyTransition(a), b.$slides.eq(a).css({ opacity: 0, zIndex: b.options.zIndex - 2 })) }, b.prototype.filterSlides = b.prototype.slickFilter = function (a) { var b = this; null !== a && (b.$slidesCache = b.$slides, b.unload(), b.$slideTrack.children(this.options.slide).detach(), b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit()) }, b.prototype.getCurrent = b.prototype.slickCurrentSlide = function () { var a = this; return a.currentSlide }, b.prototype.getDotCount = function () { var a = this, b = 0, c = 0, d = 0; if (a.options.infinite === !0) for (; b < a.slideCount;)++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow; else if (a.options.centerMode === !0) d = a.slideCount; else for (; b < a.slideCount;)++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow; return d - 1 }, b.prototype.getLeft = function (a) { var c, d, f, b = this, e = 0; return b.slideOffset = 0, d = b.$slides.first().outerHeight(!0), b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = b.slideWidth * b.options.slidesToShow * -1, e = d * b.options.slidesToShow * -1), b.slideCount % b.options.slidesToScroll !== 0 && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1, e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1) : (b.slideOffset = b.slideCount % b.options.slidesToScroll * b.slideWidth * -1, e = b.slideCount % b.options.slidesToScroll * d * -1))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, e = 0), b.options.centerMode === !0 && b.options.infinite === !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0, b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = b.options.vertical === !1 ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e, b.options.variableWidth === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, b.options.centerMode === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, c += (b.$list.width() - f.outerWidth()) / 2)), c }, b.prototype.getOption = b.prototype.slickGetOption = function (a) { var b = this; return b.options[a] }, b.prototype.getNavigableIndexes = function () { var e, a = this, b = 0, c = 0, d = []; for (a.options.infinite === !1 ? e = a.slideCount : (b = -1 * a.options.slidesToScroll, c = -1 * a.options.slidesToScroll, e = 2 * a.slideCount); e > b;)d.push(b), b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow; return d }, b.prototype.getSlick = function () { return this }, b.prototype.getSlideCount = function () { var c, d, e, b = this; return e = b.options.centerMode === !0 ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0, b.options.swipeToSlide === !0 ? (b.$slideTrack.find(".slick-slide").each(function (c, f) { return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? (d = f, !1) : void 0 }), c = Math.abs(a(d).attr("data-slick-index") - b.currentSlide) || 1) : b.options.slidesToScroll }, b.prototype.goTo = b.prototype.slickGoTo = function (a, b) { var c = this; c.changeSlide({ data: { message: "index", index: parseInt(a) } }, b) }, b.prototype.init = function (b) { var c = this; a(c.$slider).hasClass("slick-initialized") || (a(c.$slider).addClass("slick-initialized"), c.buildRows(), c.buildOut(), c.setProps(), c.startLoad(), c.loadSlider(), c.initializeEvents(), c.updateArrows(), c.updateDots()), b && c.$slider.trigger("init", [c]), c.options.accessibility === !0 && c.initADA() }, b.prototype.initArrowEvents = function () { var a = this; a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.on("click.slick", { message: "previous" }, a.changeSlide), a.$nextArrow.on("click.slick", { message: "next" }, a.changeSlide)) }, b.prototype.initDotEvents = function () { var b = this; b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", { message: "index" }, b.changeSlide), b.options.dots === !0 && b.options.pauseOnDotsHover === !0 && b.options.autoplay === !0 && a("li", b.$dots).on("mouseenter.slick", a.proxy(b.setPaused, b, !0)).on("mouseleave.slick", a.proxy(b.setPaused, b, !1)) }, b.prototype.initializeEvents = function () { var b = this; b.initArrowEvents(), b.initDotEvents(), b.$list.on("touchstart.slick mousedown.slick", { action: "start" }, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", { action: "move" }, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", { action: "end" }, b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", { action: "end" }, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), a(document).on(b.visibilityChange, a.proxy(b.visibility, b)), b.$list.on("mouseenter.slick", a.proxy(b.setPaused, b, !0)), b.$list.on("mouseleave.slick", a.proxy(b.setPaused, b, !1)), b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), a(window).on("orientationchange.slick.slick-" + b.instanceUid, a.proxy(b.orientationChange, b)), a(window).on("resize.slick.slick-" + b.instanceUid, a.proxy(b.resize, b)), a("[draggable!=true]", b.$slideTrack).on("dragstart", b.preventDefault), a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition) }, b.prototype.initUI = function () { var a = this; a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show(), a.options.autoplay === !0 && a.autoPlay() }, b.prototype.keyHandler = function (a) { var b = this; a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({ data: { message: "previous" } }) : 39 === a.keyCode && b.options.accessibility === !0 && b.changeSlide({ data: { message: "next" } })) }, b.prototype.lazyLoad = function () { function g(b) { a("img[data-lazy]", b).each(function () { var b = a(this), c = a(this).attr("data-lazy"), d = document.createElement("img"); d.onload = function () { b.animate({ opacity: 0 }, 100, function () { b.attr("src", c).animate({ opacity: 1 }, 200, function () { b.removeAttr("data-lazy").removeClass("slick-loading") }) }) }, d.src = c }) } var c, d, e, f, b = this; b.options.centerMode === !0 ? b.options.infinite === !0 ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1), f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)), f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide, f = e + b.options.slidesToShow, b.options.fade === !0 && (e > 0 && e--, f <= b.slideCount && f++)), c = b.$slider.find(".slick-slide").slice(e, f), g(c), b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"), g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow), g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow), g(d)) }, b.prototype.loadSlider = function () { var a = this; a.setPosition(), a.$slideTrack.css({ opacity: 1 }), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad() }, b.prototype.next = b.prototype.slickNext = function () { var a = this; a.changeSlide({ data: { message: "next" } }) }, b.prototype.orientationChange = function () { var a = this; a.checkResponsive(), a.setPosition() }, b.prototype.pause = b.prototype.slickPause = function () { var a = this; a.autoPlayClear(), a.paused = !0 }, b.prototype.play = b.prototype.slickPlay = function () { var a = this; a.paused = !1, a.autoPlay() }, b.prototype.postSlide = function (a) { var b = this; b.$slider.trigger("afterChange", [b, a]), b.animating = !1, b.setPosition(), b.swipeLeft = null, b.options.autoplay === !0 && b.paused === !1 && b.autoPlay(), b.options.accessibility === !0 && b.initADA() }, b.prototype.prev = b.prototype.slickPrev = function () { var a = this; a.changeSlide({ data: { message: "previous" } }) }, b.prototype.preventDefault = function (a) { a.preventDefault() }, b.prototype.progressiveLazyLoad = function () { var c, d, b = this; c = a("img[data-lazy]", b.$slider).length, c > 0 && (d = a("img[data-lazy]", b.$slider).first(), d.attr("src", null), d.attr("src", d.attr("data-lazy")).removeClass("slick-loading").load(function () { d.removeAttr("data-lazy"), b.progressiveLazyLoad(), b.options.adaptiveHeight === !0 && b.setPosition() }).error(function () { d.removeAttr("data-lazy"), b.progressiveLazyLoad() })) }, b.prototype.refresh = function (b) { var d, e, c = this; e = c.slideCount - c.options.slidesToShow, c.options.infinite || (c.slideCount <= c.options.slidesToShow ? c.currentSlide = 0 : c.currentSlide > e && (c.currentSlide = e)), d = c.currentSlide, c.destroy(!0), a.extend(c, c.initials, { currentSlide: d }), c.init(), b || c.changeSlide({ data: { message: "index", index: d } }, !1) }, b.prototype.registerBreakpoints = function () { var c, d, e, b = this, f = b.options.responsive || null; if ("array" === a.type(f) && f.length) { b.respondTo = b.options.respondTo || "window"; for (c in f) if (e = b.breakpoints.length - 1, d = f[c].breakpoint, f.hasOwnProperty(c)) { for (; e >= 0;)b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1), e--; b.breakpoints.push(d), b.breakpointSettings[d] = f[c].settings } b.breakpoints.sort(function (a, c) { return b.options.mobileFirst ? a - c : c - a }) } }, b.prototype.reinit = function () { var b = this; b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.registerBreakpoints(), b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(), b.buildDots(), b.updateDots(), b.initDotEvents(), b.checkResponsive(!1, !0), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), b.setSlideClasses(0), b.setPosition(), b.$slider.trigger("reInit", [b]), b.options.autoplay === !0 && b.focusHandler() }, b.prototype.resize = function () { var b = this; a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function () { b.windowWidth = a(window).width(), b.checkResponsive(), b.unslicked || b.setPosition() }, 50)) }, b.prototype.removeSlide = b.prototype.slickRemove = function (a, b, c) { var d = this; return "boolean" == typeof a ? (b = a, a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a, d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(), c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(), d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, void d.reinit()) }, b.prototype.setCSS = function (a) { var d, e, b = this, c = {}; b.options.rtl === !0 && (a = -a), d = "left" == b.positionProp ? Math.ceil(a) + "px" : "0px", e = "top" == b.positionProp ? Math.ceil(a) + "px" : "0px", c[b.positionProp] = a, b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {}, b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")", b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", b.$slideTrack.css(c))) }, b.prototype.setDimensions = function () { var a = this; a.options.vertical === !1 ? a.options.centerMode === !0 && a.$list.css({ padding: "0px " + a.options.centerPadding }) : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow), a.options.centerMode === !0 && a.$list.css({ padding: a.options.centerPadding + " 0px" })), a.listWidth = a.$list.width(), a.listHeight = a.$list.height(), a.options.vertical === !1 && a.options.variableWidth === !1 ? (a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow), a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children(".slick-slide").length))) : a.options.variableWidth === !0 ? a.$slideTrack.width(5e3 * a.slideCount) : (a.slideWidth = Math.ceil(a.listWidth), a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children(".slick-slide").length))); var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width(); a.options.variableWidth === !1 && a.$slideTrack.children(".slick-slide").width(a.slideWidth - b) }, b.prototype.setFade = function () { var c, b = this; b.$slides.each(function (d, e) { c = b.slideWidth * d * -1, b.options.rtl === !0 ? a(e).css({ position: "relative", right: c, top: 0, zIndex: b.options.zIndex - 2, opacity: 0 }) : a(e).css({ position: "relative", left: c, top: 0, zIndex: b.options.zIndex - 2, opacity: 0 }) }), b.$slides.eq(b.currentSlide).css({ zIndex: b.options.zIndex - 1, opacity: 1 }) }, b.prototype.setHeight = function () { var a = this; if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) { var b = a.$slides.eq(a.currentSlide).outerHeight(!0); a.$list.css("height", b) } }, b.prototype.setOption = b.prototype.slickSetOption = function (b, c, d) { var f, g, e = this; if ("responsive" === b && "array" === a.type(c)) for (g in c) if ("array" !== a.type(e.options.responsive)) e.options.responsive = [c[g]]; else { for (f = e.options.responsive.length - 1; f >= 0;)e.options.responsive[f].breakpoint === c[g].breakpoint && e.options.responsive.splice(f, 1), f--; e.options.responsive.push(c[g]) } else e.options[b] = c; d === !0 && (e.unload(), e.reinit()) }, b.prototype.setPosition = function () { var a = this; a.setDimensions(), a.setHeight(), a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), a.$slider.trigger("setPosition", [a]) }, b.prototype.setProps = function () { var a = this, b = document.body.style; a.positionProp = a.options.vertical === !0 ? "top" : "left", "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0), a.options.fade && ("number" == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : a.options.zIndex = a.defaults.zIndex), void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform", a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), void 0 !== b.transform && a.animType !== !1 && (a.animType = "transform", a.transformType = "transform", a.transitionType = "transition"), a.transformsEnabled = a.options.useTransform && null !== a.animType && a.animType !== !1 }, b.prototype.setSlideClasses = function (a) { var c, d, e, f, b = this; d = b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), b.$slides.eq(a).addClass("slick-current"), b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2), b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active").attr("aria-hidden", "false") : (e = b.options.slidesToShow + a, d.slice(e - c + 1, e + c + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : d.length <= b.options.slidesToShow ? d.addClass("slick-active").attr("aria-hidden", "false") : (f = b.slideCount % b.options.slidesToShow, e = b.options.infinite === !0 ? b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active").attr("aria-hidden", "false") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === b.options.lazyLoad && b.lazyLoad() }, b.prototype.setupInfinite = function () { var c, d, e, b = this; if (b.options.fade === !0 && (b.options.centerMode = !1), b.options.infinite === !0 && b.options.fade === !1 && (d = null, b.slideCount > b.options.slidesToShow)) { for (e = b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow, c = b.slideCount; c > b.slideCount - e; c -= 1)d = c - 1, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned"); for (c = 0; e > c; c += 1)d = c, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned"); b.$slideTrack.find(".slick-cloned").find("[id]").each(function () { a(this).attr("id", "") }) } }, b.prototype.setPaused = function (a) { var b = this; b.options.autoplay === !0 && b.options.pauseOnHover === !0 && (b.paused = a, a ? b.autoPlayClear() : b.autoPlay()) }, b.prototype.selectHandler = function (b) { var c = this, d = a(b.target).is(".slick-slide") ? a(b.target) : a(b.target).parents(".slick-slide"), e = parseInt(d.attr("data-slick-index")); return e || (e = 0), c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e), void c.asNavFor(e)) : void c.slideHandler(e) }, b.prototype.slideHandler = function (a, b, c) {
    var d, e, f, g, h = null, i = this; return b = b || !1, i.animating === !0 && i.options.waitForAnimate === !0 || i.options.fade === !0 && i.currentSlide === a || i.slideCount <= i.options.slidesToShow ? void 0 : (b === !1 && i.asNavFor(a), d = a, h = i.getLeft(d), g = i.getLeft(i.currentSlide), i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft, i.options.infinite === !1 && i.options.centerMode === !1 && (0 > a || a > i.getDotCount() * i.options.slidesToScroll) ? void (i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
      i.postSlide(d);
    }) : i.postSlide(d))) : i.options.infinite === !1 && i.options.centerMode === !0 && (0 > a || a > i.slideCount - i.options.slidesToScroll) ? void (i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () { i.postSlide(d) }) : i.postSlide(d))) : (i.options.autoplay === !0 && clearInterval(i.autoPlayTimer), e = 0 > d ? i.slideCount % i.options.slidesToScroll !== 0 ? i.slideCount - i.slideCount % i.options.slidesToScroll : i.slideCount + d : d >= i.slideCount ? i.slideCount % i.options.slidesToScroll !== 0 ? 0 : d - i.slideCount : d, i.animating = !0, i.$slider.trigger("beforeChange", [i, i.currentSlide, e]), f = i.currentSlide, i.currentSlide = e, i.setSlideClasses(i.currentSlide), i.updateDots(), i.updateArrows(), i.options.fade === !0 ? (c !== !0 ? (i.fadeSlideOut(f), i.fadeSlide(e, function () { i.postSlide(e) })) : i.postSlide(e), void i.animateHeight()) : void (c !== !0 ? i.animateSlide(h, function () { i.postSlide(e) }) : i.postSlide(e))))
  }, b.prototype.startLoad = function () { var a = this; a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(), a.$slider.addClass("slick-loading") }, b.prototype.swipeDirection = function () { var a, b, c, d, e = this; return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : e.options.verticalSwiping === !0 ? d >= 35 && 135 >= d ? "left" : "right" : "vertical" }, b.prototype.swipeEnd = function (a) { var c, b = this; if (b.dragging = !1, b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0, void 0 === b.touchObject.curX) return !1; if (b.touchObject.edgeHit === !0 && b.$slider.trigger("edge", [b, b.swipeDirection()]), b.touchObject.swipeLength >= b.touchObject.minSwipe) switch (b.swipeDirection()) { case "left": c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount(), b.slideHandler(c), b.currentDirection = 0, b.touchObject = {}, b.$slider.trigger("swipe", [b, "left"]); break; case "right": c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount(), b.slideHandler(c), b.currentDirection = 1, b.touchObject = {}, b.$slider.trigger("swipe", [b, "right"]) } else b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), b.touchObject = {}) }, b.prototype.swipeHandler = function (a) { var b = this; if (!(b.options.swipe === !1 || "ontouchend" in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse"))) switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, b.options.verticalSwiping === !0 && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold), a.data.action) { case "start": b.swipeStart(a); break; case "move": b.swipeMove(a); break; case "end": b.swipeEnd(a) } }, b.prototype.swipeMove = function (a) { var d, e, f, g, h, b = this; return h = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !b.dragging || h && 1 !== h.length ? !1 : (d = b.getLeft(b.currentSlide), b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX, b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY, b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), b.options.verticalSwiping === !0 && (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))), e = b.swipeDirection(), "vertical" !== e ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), g = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1), b.options.verticalSwiping === !0 && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1), f = b.touchObject.swipeLength, b.touchObject.edgeHit = !1, b.options.infinite === !1 && (0 === b.currentSlide && "right" === e || b.currentSlide >= b.getDotCount() && "left" === e) && (f = b.touchObject.swipeLength * b.options.edgeFriction, b.touchObject.edgeHit = !0), b.options.vertical === !1 ? b.swipeLeft = d + f * g : b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g, b.options.verticalSwiping === !0 && (b.swipeLeft = d + f * g), b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null, !1) : void b.setCSS(b.swipeLeft)) : void 0) }, b.prototype.swipeStart = function (a) { var c, b = this; return 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]), b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, void (b.dragging = !0)) }, b.prototype.unfilterSlides = b.prototype.slickUnfilter = function () { var a = this; null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit()) }, b.prototype.unload = function () { var b = this; a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(), b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "") }, b.prototype.unslick = function (a) { var b = this; b.$slider.trigger("unslick", [b, a]), b.destroy() }, b.prototype.updateArrows = function () { var b, a = this; b = Math.floor(a.options.slidesToShow / 2), a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && !a.options.infinite && (a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - 1 && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"))) }, b.prototype.updateDots = function () { var a = this; null !== a.$dots && (a.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false")) }, b.prototype.visibility = function () { var a = this; document[a.hidden] ? (a.paused = !0, a.autoPlayClear()) : a.options.autoplay === !0 && (a.paused = !1, a.autoPlay()) }, b.prototype.initADA = function () { var b = this; b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({ "aria-hidden": "true", tabindex: "-1" }).find("a, input, button, select").attr({ tabindex: "-1" }), b.$slideTrack.attr("role", "listbox"),b.$slideTrack.attr("aria-label", "slick-slider"), b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function (c) { a(this).attr({ role: "option", "aria-describedby": "slick-slide" + b.instanceUid + c }) }), null !== b.$dots && b.$dots.attr("role", "tablist").find("li").each(function (c) { a(this).attr({ role: "presentation", "aria-selected": "false", "aria-controls": "navigation" + b.instanceUid + c, id: "slick-slide" + b.instanceUid + c }) }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), b.activateADA() }, b.prototype.activateADA = function () { var a = this; a.$slideTrack.find(".slick-active").attr({ "aria-hidden": "false" }).find("a, input, button, select").attr({ tabindex: "0" }) }, b.prototype.focusHandler = function () { var b = this; b.$slider.on("focus.slick blur.slick", "*", function (c) { c.stopImmediatePropagation(); var d = a(this); setTimeout(function () { b.isPlay && (d.is(":focus") ? (b.autoPlayClear(), b.paused = !0) : (b.paused = !1, b.autoPlay())) }, 0) }) }, a.fn.slick = function () { var f, g, a = this, c = arguments[0], d = Array.prototype.slice.call(arguments, 1), e = a.length; for (f = 0; e > f; f++)if ("object" == typeof c || "undefined" == typeof c ? a[f].slick = new b(a[f], c) : g = a[f].slick[c].apply(a[f].slick, d), "undefined" != typeof g) return g; return a }
});

// ==================================================
// fancyBox v3.5.7
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2019 fancyApps
//
// ==================================================
!function (t, e, n, o) {
  "use strict"; function i(t, e) { var o, i, a, s = [], r = 0; t && t.isDefaultPrevented() || (t.preventDefault(), e = e || {}, t && t.data && (e = h(t.data.options, e)), o = e.$target || n(t.currentTarget).trigger("blur"), (a = n.fancybox.getInstance()) && a.$trigger && a.$trigger.is(o) || (e.selector ? s = n(e.selector) : (i = o.attr("data-fancybox") || "", i ? (s = t.data ? t.data.items : [], s = s.length ? s.filter('[data-fancybox="' + i + '"]') : n('[data-fancybox="' + i + '"]')) : s = [o]), r = n(s).index(o), r < 0 && (r = 0), a = n.fancybox.open(s, e, r), a.$trigger = o)) } if (t.console = t.console || { info: function (t) { } }, n) {
    if (n.fn.fancybox) return void console.info("fancyBox already initialized"); var a = { closeExisting: !1, loop: !1, gutter: 50, keyboard: !0, preventCaptionOverlap: !0, arrows: !0, infobar: !0, smallBtn: "auto", toolbar: "auto", buttons: ["zoom", "slideShow", "thumbs", "close"], idleTime: 3, protect: !1, modal: !1, image: { preload: !1 }, ajax: { settings: { data: { fancybox: !0 } } }, iframe: { tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>', preload: !0, css: {}, attr: { scrolling: "auto" } }, video: { tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>', format: "", autoStart: !0 }, defaultType: "image", animationEffect: "zoom", animationDuration: 366, zoomOpacity: "auto", transitionEffect: "fade", transitionDuration: 366, slideClass: "", baseClass: "", baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"><div class="fancybox-caption__body"></div></div></div></div>', spinnerTpl: '<div class="fancybox-loading"></div>', errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>', btnTpl: { download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>', zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>', close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>', arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>', arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>', smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>' }, parentEl: "body", hideScrollbar: !0, autoFocus: !0, backFocus: !0, trapFocus: !0, fullScreen: { autoStart: !1 }, touch: { vertical: !0, momentum: !0 }, hash: null, media: {}, slideShow: { autoStart: !1, speed: 3e3 }, thumbs: { autoStart: !1, hideOnClose: !0, parentEl: ".fancybox-container", axis: "y" }, wheel: "auto", onInit: n.noop, beforeLoad: n.noop, afterLoad: n.noop, beforeShow: n.noop, afterShow: n.noop, beforeClose: n.noop, afterClose: n.noop, onActivate: n.noop, onDeactivate: n.noop, clickContent: function (t, e) { return "image" === t.type && "zoom" }, clickSlide: "close", clickOutside: "close", dblclickContent: !1, dblclickSlide: !1, dblclickOutside: !1, mobile: { preventCaptionOverlap: !1, idleTime: !1, clickContent: function (t, e) { return "image" === t.type && "toggleControls" }, clickSlide: function (t, e) { return "image" === t.type ? "toggleControls" : "close" }, dblclickContent: function (t, e) { return "image" === t.type && "zoom" }, dblclickSlide: function (t, e) { return "image" === t.type && "zoom" } }, lang: "en", i18n: { en: { CLOSE: "Close", NEXT: "Next", PREV: "Previous", ERROR: "The requested content cannot be loaded. <br/> Please try again later.", PLAY_START: "Start slideshow", PLAY_STOP: "Pause slideshow", FULL_SCREEN: "Full screen", THUMBS: "Thumbnails", DOWNLOAD: "Download", SHARE: "Share", ZOOM: "Zoom" }, de: { CLOSE: "Schlie&szlig;en", NEXT: "Weiter", PREV: "Zur&uuml;ck", ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.", PLAY_START: "Diaschau starten", PLAY_STOP: "Diaschau beenden", FULL_SCREEN: "Vollbild", THUMBS: "Vorschaubilder", DOWNLOAD: "Herunterladen", SHARE: "Teilen", ZOOM: "Vergr&ouml;&szlig;ern" } } }, s = n(t), r = n(e), c = 0, l = function (t) { return t && t.hasOwnProperty && t instanceof n }, d = function () { return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function (e) { return t.setTimeout(e, 1e3 / 60) } }(), u = function () { return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function (e) { t.clearTimeout(e) } }(), f = function () { var t, n = e.createElement("fakeelement"), o = { transition: "transitionend", OTransition: "oTransitionEnd", MozTransition: "transitionend", WebkitTransition: "webkitTransitionEnd" }; for (t in o) if (void 0 !== n.style[t]) return o[t]; return "transitionend" }(), p = function (t) { return t && t.length && t[0].offsetHeight }, h = function (t, e) { var o = n.extend(!0, {}, t, e); return n.each(e, function (t, e) { n.isArray(e) && (o[t] = e) }), o }, g = function (t) { var o, i; return !(!t || t.ownerDocument !== e) && (n(".fancybox-container").css("pointer-events", "none"), o = { x: t.getBoundingClientRect().left + t.offsetWidth / 2, y: t.getBoundingClientRect().top + t.offsetHeight / 2 }, i = e.elementFromPoint(o.x, o.y) === t, n(".fancybox-container").css("pointer-events", ""), i) }, b = function (t, e, o) { var i = this; i.opts = h({ index: o }, n.fancybox.defaults), n.isPlainObject(e) && (i.opts = h(i.opts, e)), n.fancybox.isMobile && (i.opts = h(i.opts, i.opts.mobile)), i.id = i.opts.id || ++c, i.currIndex = parseInt(i.opts.index, 10) || 0, i.prevIndex = null, i.prevPos = null, i.currPos = 0, i.firstRun = !0, i.group = [], i.slides = {}, i.addContent(t), i.group.length && i.init() }; n.extend(b.prototype, {
      init: function () { var o, i, a = this, s = a.group[a.currIndex], r = s.opts; r.closeExisting && n.fancybox.close(!0), n("body").addClass("fancybox-active"), !n.fancybox.getInstance() && !1 !== r.hideScrollbar && !n.fancybox.isMobile && e.body.scrollHeight > t.innerHeight && (n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (t.innerWidth - e.documentElement.clientWidth) + "px;}</style>"), n("body").addClass("compensate-for-scrollbar")), i = "", n.each(r.buttons, function (t, e) { i += r.btnTpl[e] || "" }), o = n(a.translate(a, r.baseTpl.replace("{{buttons}}", i).replace("{{arrows}}", r.btnTpl.arrowLeft + r.btnTpl.arrowRight))).attr("id", "fancybox-container-" + a.id).addClass(r.baseClass).data("FancyBox", a).appendTo(r.parentEl), a.$refs = { container: o }, ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function (t) { a.$refs[t] = o.find(".fancybox-" + t) }), a.trigger("onInit"), a.activate(), a.jumpTo(a.currIndex) }, translate: function (t, e) { var n = t.opts.i18n[t.opts.lang] || t.opts.i18n.en; return e.replace(/\{\{(\w+)\}\}/g, function (t, e) { return void 0 === n[e] ? t : n[e] }) }, addContent: function (t) { var e, o = this, i = n.makeArray(t); n.each(i, function (t, e) { var i, a, s, r, c, l = {}, d = {}; n.isPlainObject(e) ? (l = e, d = e.opts || e) : "object" === n.type(e) && n(e).length ? (i = n(e), d = i.data() || {}, d = n.extend(!0, {}, d, d.options), d.$orig = i, l.src = o.opts.src || d.src || i.attr("href"), l.type || l.src || (l.type = "inline", l.src = e)) : l = { type: "html", src: e + "" }, l.opts = n.extend(!0, {}, o.opts, d), n.isArray(d.buttons) && (l.opts.buttons = d.buttons), n.fancybox.isMobile && l.opts.mobile && (l.opts = h(l.opts, l.opts.mobile)), a = l.type || l.opts.type, r = l.src || "", !a && r && ((s = r.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (a = "video", l.opts.video.format || (l.opts.video.format = "video/" + ("ogv" === s[1] ? "ogg" : s[1]))) : r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? a = "image" : r.match(/\.(pdf)((\?|#).*)?$/i) ? (a = "iframe", l = n.extend(!0, l, { contentType: "pdf", opts: { iframe: { preload: !1 } } })) : "#" === r.charAt(0) && (a = "inline")), a ? l.type = a : o.trigger("objectNeedsType", l), l.contentType || (l.contentType = n.inArray(l.type, ["html", "inline", "ajax"]) > -1 ? "html" : l.type), l.index = o.group.length, "auto" == l.opts.smallBtn && (l.opts.smallBtn = n.inArray(l.type, ["html", "inline", "ajax"]) > -1), "auto" === l.opts.toolbar && (l.opts.toolbar = !l.opts.smallBtn), l.$thumb = l.opts.$thumb || null, l.opts.$trigger && l.index === o.opts.index && (l.$thumb = l.opts.$trigger.find("img:first"), l.$thumb.length && (l.opts.$orig = l.opts.$trigger)), l.$thumb && l.$thumb.length || !l.opts.$orig || (l.$thumb = l.opts.$orig.find("img:first")), l.$thumb && !l.$thumb.length && (l.$thumb = null), l.thumb = l.opts.thumb || (l.$thumb ? l.$thumb[0].src : null), "function" === n.type(l.opts.caption) && (l.opts.caption = l.opts.caption.apply(e, [o, l])), "function" === n.type(o.opts.caption) && (l.opts.caption = o.opts.caption.apply(e, [o, l])), l.opts.caption instanceof n || (l.opts.caption = void 0 === l.opts.caption ? "" : l.opts.caption + ""), "ajax" === l.type && (c = r.split(/\s+/, 2), c.length > 1 && (l.src = c.shift(), l.opts.filter = c.shift())), l.opts.modal && (l.opts = n.extend(!0, l.opts, { trapFocus: !0, infobar: 0, toolbar: 0, smallBtn: 0, keyboard: 0, slideShow: 0, fullScreen: 0, thumbs: 0, touch: 0, clickContent: !1, clickSlide: !1, clickOutside: !1, dblclickContent: !1, dblclickSlide: !1, dblclickOutside: !1 })), o.group.push(l) }), Object.keys(o.slides).length && (o.updateControls(), (e = o.Thumbs) && e.isActive && (e.create(), e.focus())) }, addEvents: function () { var e = this; e.removeEvents(), e.$refs.container.on("click.fb-close", "[data-fancybox-close]", function (t) { t.stopPropagation(), t.preventDefault(), e.close(t) }).on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function (t) { t.stopPropagation(), t.preventDefault(), e.previous() }).on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function (t) { t.stopPropagation(), t.preventDefault(), e.next() }).on("click.fb", "[data-fancybox-zoom]", function (t) { e[e.isScaledDown() ? "scaleToActual" : "scaleToFit"]() }), s.on("orientationchange.fb resize.fb", function (t) { t && t.originalEvent && "resize" === t.originalEvent.type ? (e.requestId && u(e.requestId), e.requestId = d(function () { e.update(t) })) : (e.current && "iframe" === e.current.type && e.$refs.stage.hide(), setTimeout(function () { e.$refs.stage.show(), e.update(t) }, n.fancybox.isMobile ? 600 : 250)) }), r.on("keydown.fb", function (t) { var o = n.fancybox ? n.fancybox.getInstance() : null, i = o.current, a = t.keyCode || t.which; if (9 == a) return void (i.opts.trapFocus && e.focus(t)); if (!(!i.opts.keyboard || t.ctrlKey || t.altKey || t.shiftKey || n(t.target).is("input,textarea,video,audio,select"))) return 8 === a || 27 === a ? (t.preventDefault(), void e.close(t)) : 37 === a || 38 === a ? (t.preventDefault(), void e.previous()) : 39 === a || 40 === a ? (t.preventDefault(), void e.next()) : void e.trigger("afterKeydown", t, a) }), e.group[e.currIndex].opts.idleTime && (e.idleSecondsCounter = 0, r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle", function (t) { e.idleSecondsCounter = 0, e.isIdle && e.showControls(), e.isIdle = !1 }), e.idleInterval = t.setInterval(function () { ++e.idleSecondsCounter >= e.group[e.currIndex].opts.idleTime && !e.isDragging && (e.isIdle = !0, e.idleSecondsCounter = 0, e.hideControls()) }, 1e3)) }, removeEvents: function () { var e = this; s.off("orientationchange.fb resize.fb"), r.off("keydown.fb .fb-idle"), this.$refs.container.off(".fb-close .fb-prev .fb-next"), e.idleInterval && (t.clearInterval(e.idleInterval), e.idleInterval = null) }, previous: function (t) { return this.jumpTo(this.currPos - 1, t) }, next: function (t) { return this.jumpTo(this.currPos + 1, t) }, jumpTo: function (t, e) { var o, i, a, s, r, c, l, d, u, f = this, h = f.group.length; if (!(f.isDragging || f.isClosing || f.isAnimating && f.firstRun)) { if (t = parseInt(t, 10), !(a = f.current ? f.current.opts.loop : f.opts.loop) && (t < 0 || t >= h)) return !1; if (o = f.firstRun = !Object.keys(f.slides).length, r = f.current, f.prevIndex = f.currIndex, f.prevPos = f.currPos, s = f.createSlide(t), h > 1 && ((a || s.index < h - 1) && f.createSlide(t + 1), (a || s.index > 0) && f.createSlide(t - 1)), f.current = s, f.currIndex = s.index, f.currPos = s.pos, f.trigger("beforeShow", o), f.updateControls(), s.forcedDuration = void 0, n.isNumeric(e) ? s.forcedDuration = e : e = s.opts[o ? "animationDuration" : "transitionDuration"], e = parseInt(e, 10), i = f.isMoved(s), s.$slide.addClass("fancybox-slide--current"), o) return s.opts.animationEffect && e && f.$refs.container.css("transition-duration", e + "ms"), f.$refs.container.addClass("fancybox-is-open").trigger("focus"), f.loadSlide(s), void f.preload("image"); c = n.fancybox.getTranslate(r.$slide), l = n.fancybox.getTranslate(f.$refs.stage), n.each(f.slides, function (t, e) { n.fancybox.stop(e.$slide, !0) }), r.pos !== s.pos && (r.isComplete = !1), r.$slide.removeClass("fancybox-slide--complete fancybox-slide--current"), i ? (u = c.left - (r.pos * c.width + r.pos * r.opts.gutter), n.each(f.slides, function (t, o) { o.$slide.removeClass("fancybox-animated").removeClass(function (t, e) { return (e.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ") }); var i = o.pos * c.width + o.pos * o.opts.gutter; n.fancybox.setTranslate(o.$slide, { top: 0, left: i - l.left + u }), o.pos !== s.pos && o.$slide.addClass("fancybox-slide--" + (o.pos > s.pos ? "next" : "previous")), p(o.$slide), n.fancybox.animate(o.$slide, { top: 0, left: (o.pos - s.pos) * c.width + (o.pos - s.pos) * o.opts.gutter }, e, function () { o.$slide.css({ transform: "", opacity: "" }).removeClass("fancybox-slide--next fancybox-slide--previous"), o.pos === f.currPos && f.complete() }) })) : e && s.opts.transitionEffect && (d = "fancybox-animated fancybox-fx-" + s.opts.transitionEffect, r.$slide.addClass("fancybox-slide--" + (r.pos > s.pos ? "next" : "previous")), n.fancybox.animate(r.$slide, d, e, function () { r.$slide.removeClass(d).removeClass("fancybox-slide--next fancybox-slide--previous") }, !1)), s.isLoaded ? f.revealContent(s) : f.loadSlide(s), f.preload("image") } }, createSlide: function (t) { var e, o, i = this; return o = t % i.group.length, o = o < 0 ? i.group.length + o : o, !i.slides[t] && i.group[o] && (e = n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage), i.slides[t] = n.extend(!0, {}, i.group[o], { pos: t, $slide: e, isLoaded: !1 }), i.updateSlide(i.slides[t])), i.slides[t] }, scaleToActual: function (t, e, o) { var i, a, s, r, c, l = this, d = l.current, u = d.$content, f = n.fancybox.getTranslate(d.$slide).width, p = n.fancybox.getTranslate(d.$slide).height, h = d.width, g = d.height; l.isAnimating || l.isMoved() || !u || "image" != d.type || !d.isLoaded || d.hasError || (l.isAnimating = !0, n.fancybox.stop(u), t = void 0 === t ? .5 * f : t, e = void 0 === e ? .5 * p : e, i = n.fancybox.getTranslate(u), i.top -= n.fancybox.getTranslate(d.$slide).top, i.left -= n.fancybox.getTranslate(d.$slide).left, r = h / i.width, c = g / i.height, a = .5 * f - .5 * h, s = .5 * p - .5 * g, h > f && (a = i.left * r - (t * r - t), a > 0 && (a = 0), a < f - h && (a = f - h)), g > p && (s = i.top * c - (e * c - e), s > 0 && (s = 0), s < p - g && (s = p - g)), l.updateCursor(h, g), n.fancybox.animate(u, { top: s, left: a, scaleX: r, scaleY: c }, o || 366, function () { l.isAnimating = !1 }), l.SlideShow && l.SlideShow.isActive && l.SlideShow.stop()) }, scaleToFit: function (t) { var e, o = this, i = o.current, a = i.$content; o.isAnimating || o.isMoved() || !a || "image" != i.type || !i.isLoaded || i.hasError || (o.isAnimating = !0, n.fancybox.stop(a), e = o.getFitPos(i), o.updateCursor(e.width, e.height), n.fancybox.animate(a, { top: e.top, left: e.left, scaleX: e.width / a.width(), scaleY: e.height / a.height() }, t || 366, function () { o.isAnimating = !1 })) }, getFitPos: function (t) { var e, o, i, a, s = this, r = t.$content, c = t.$slide, l = t.width || t.opts.width, d = t.height || t.opts.height, u = {}; return !!(t.isLoaded && r && r.length) && (e = n.fancybox.getTranslate(s.$refs.stage).width, o = n.fancybox.getTranslate(s.$refs.stage).height, e -= parseFloat(c.css("paddingLeft")) + parseFloat(c.css("paddingRight")) + parseFloat(r.css("marginLeft")) + parseFloat(r.css("marginRight")), o -= parseFloat(c.css("paddingTop")) + parseFloat(c.css("paddingBottom")) + parseFloat(r.css("marginTop")) + parseFloat(r.css("marginBottom")), l && d || (l = e, d = o), i = Math.min(1, e / l, o / d), l *= i, d *= i, l > e - .5 && (l = e), d > o - .5 && (d = o), "image" === t.type ? (u.top = Math.floor(.5 * (o - d)) + parseFloat(c.css("paddingTop")), u.left = Math.floor(.5 * (e - l)) + parseFloat(c.css("paddingLeft"))) : "video" === t.contentType && (a = t.opts.width && t.opts.height ? l / d : t.opts.ratio || 16 / 9, d > l / a ? d = l / a : l > d * a && (l = d * a)), u.width = l, u.height = d, u) }, update: function (t) { var e = this; n.each(e.slides, function (n, o) { e.updateSlide(o, t) }) }, updateSlide: function (t, e) { var o = this, i = t && t.$content, a = t.width || t.opts.width, s = t.height || t.opts.height, r = t.$slide; o.adjustCaption(t), i && (a || s || "video" === t.contentType) && !t.hasError && (n.fancybox.stop(i), n.fancybox.setTranslate(i, o.getFitPos(t)), t.pos === o.currPos && (o.isAnimating = !1, o.updateCursor())), o.adjustLayout(t), r.length && (r.trigger("refresh"), t.pos === o.currPos && o.$refs.toolbar.add(o.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar", r.get(0).scrollHeight > r.get(0).clientHeight)), o.trigger("onUpdate", t, e) }, centerSlide: function (t) { var e = this, o = e.current, i = o.$slide; !e.isClosing && o && (i.siblings().css({ transform: "", opacity: "" }), i.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next"), n.fancybox.animate(i, { top: 0, left: 0, opacity: 1 }, void 0 === t ? 0 : t, function () { i.css({ transform: "", opacity: "" }), o.isComplete || e.complete() }, !1)) }, isMoved: function (t) { var e, o, i = t || this.current; return !!i && (o = n.fancybox.getTranslate(this.$refs.stage), e = n.fancybox.getTranslate(i.$slide), !i.$slide.hasClass("fancybox-animated") && (Math.abs(e.top - o.top) > .5 || Math.abs(e.left - o.left) > .5)) }, updateCursor: function (t, e) { var o, i, a = this, s = a.current, r = a.$refs.container; s && !a.isClosing && a.Guestures && (r.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"), o = a.canPan(t, e), i = !!o || a.isZoomable(), r.toggleClass("fancybox-is-zoomable", i), n("[data-fancybox-zoom]").prop("disabled", !i), o ? r.addClass("fancybox-can-pan") : i && ("zoom" === s.opts.clickContent || n.isFunction(s.opts.clickContent) && "zoom" == s.opts.clickContent(s)) ? r.addClass("fancybox-can-zoomIn") : s.opts.touch && (s.opts.touch.vertical || a.group.length > 1) && "video" !== s.contentType && r.addClass("fancybox-can-swipe")) }, isZoomable: function () { var t, e = this, n = e.current; if (n && !e.isClosing && "image" === n.type && !n.hasError) { if (!n.isLoaded) return !0; if ((t = e.getFitPos(n)) && (n.width > t.width || n.height > t.height)) return !0 } return !1 }, isScaledDown: function (t, e) { var o = this, i = !1, a = o.current, s = a.$content; return void 0 !== t && void 0 !== e ? i = t < a.width && e < a.height : s && (i = n.fancybox.getTranslate(s), i = i.width < a.width && i.height < a.height), i }, canPan: function (t, e) { var o = this, i = o.current, a = null, s = !1; return "image" === i.type && (i.isComplete || t && e) && !i.hasError && (s = o.getFitPos(i), void 0 !== t && void 0 !== e ? a = { width: t, height: e } : i.isComplete && (a = n.fancybox.getTranslate(i.$content)), a && s && (s = Math.abs(a.width - s.width) > 1.5 || Math.abs(a.height - s.height) > 1.5)), s }, loadSlide: function (t) { var e, o, i, a = this; if (!t.isLoading && !t.isLoaded) { if (t.isLoading = !0, !1 === a.trigger("beforeLoad", t)) return t.isLoading = !1, !1; switch (e = t.type, o = t.$slide, o.off("refresh").trigger("onReset").addClass(t.opts.slideClass), e) { case "image": a.setImage(t); break; case "iframe": a.setIframe(t); break; case "html": a.setContent(t, t.src || t.content); break; case "video": a.setContent(t, t.opts.video.tpl.replace(/\{\{src\}\}/gi, t.src).replace("{{format}}", t.opts.videoFormat || t.opts.video.format || "").replace("{{poster}}", t.thumb || "")); break; case "inline": n(t.src).length ? a.setContent(t, n(t.src)) : a.setError(t); break; case "ajax": a.showLoading(t), i = n.ajax(n.extend({}, t.opts.ajax.settings, { url: t.src, success: function (e, n) { "success" === n && a.setContent(t, e) }, error: function (e, n) { e && "abort" !== n && a.setError(t) } })), o.one("onReset", function () { i.abort() }); break; default: a.setError(t) }return !0 } }, setImage: function (t) { var o, i = this; setTimeout(function () { var e = t.$image; i.isClosing || !t.isLoading || e && e.length && e[0].complete || t.hasError || i.showLoading(t) }, 50), i.checkSrcset(t), t.$content = n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(t.$slide.addClass("fancybox-slide--image")), !1 !== t.opts.preload && t.opts.width && t.opts.height && t.thumb && (t.width = t.opts.width, t.height = t.opts.height, o = e.createElement("img"), o.onerror = function () { n(this).remove(), t.$ghost = null }, o.onload = function () { i.afterLoad(t) }, t.$ghost = n(o).addClass("fancybox-image").appendTo(t.$content).attr("src", t.thumb)), i.setBigImage(t) }, checkSrcset: function (e) { var n, o, i, a, s = e.opts.srcset || e.opts.image.srcset; if (s) { i = t.devicePixelRatio || 1, a = t.innerWidth * i, o = s.split(",").map(function (t) { var e = {}; return t.trim().split(/\s+/).forEach(function (t, n) { var o = parseInt(t.substring(0, t.length - 1), 10); if (0 === n) return e.url = t; o && (e.value = o, e.postfix = t[t.length - 1]) }), e }), o.sort(function (t, e) { return t.value - e.value }); for (var r = 0; r < o.length; r++) { var c = o[r]; if ("w" === c.postfix && c.value >= a || "x" === c.postfix && c.value >= i) { n = c; break } } !n && o.length && (n = o[o.length - 1]), n && (e.src = n.url, e.width && e.height && "w" == n.postfix && (e.height = e.width / e.height * n.value, e.width = n.value), e.opts.srcset = s) } }, setBigImage: function (t) { var o = this, i = e.createElement("img"), a = n(i); t.$image = a.one("error", function () { o.setError(t) }).one("load", function () { var e; t.$ghost || (o.resolveImageSlideSize(t, this.naturalWidth, this.naturalHeight), o.afterLoad(t)), o.isClosing || (t.opts.srcset && (e = t.opts.sizes, e && "auto" !== e || (e = (t.width / t.height > 1 && s.width() / s.height() > 1 ? "100" : Math.round(t.width / t.height * 100)) + "vw"), a.attr("sizes", e).attr("srcset", t.opts.srcset)), t.$ghost && setTimeout(function () { t.$ghost && !o.isClosing && t.$ghost.hide() }, Math.min(300, Math.max(1e3, t.height / 1600))), o.hideLoading(t)) }).addClass("fancybox-image").attr("src", t.src).appendTo(t.$content), (i.complete || "complete" == i.readyState) && a.naturalWidth && a.naturalHeight ? a.trigger("load") : i.error && a.trigger("error") }, resolveImageSlideSize: function (t, e, n) { var o = parseInt(t.opts.width, 10), i = parseInt(t.opts.height, 10); t.width = e, t.height = n, o > 0 && (t.width = o, t.height = Math.floor(o * n / e)), i > 0 && (t.width = Math.floor(i * e / n), t.height = i) }, setIframe: function (t) { var e, o = this, i = t.opts.iframe, a = t.$slide; t.$content = n('<div class="fancybox-content' + (i.preload ? " fancybox-is-hidden" : "") + '"></div>').css(i.css).appendTo(a), a.addClass("fancybox-slide--" + t.contentType), t.$iframe = e = n(i.tpl.replace(/\{rnd\}/g, (new Date).getTime())).attr(i.attr).appendTo(t.$content), i.preload ? (o.showLoading(t), e.on("load.fb error.fb", function (e) { this.isReady = 1, t.$slide.trigger("refresh"), o.afterLoad(t) }), a.on("refresh.fb", function () { var n, o, s = t.$content, r = i.css.width, c = i.css.height; if (1 === e[0].isReady) { try { n = e.contents(), o = n.find("body") } catch (t) { } o && o.length && o.children().length && (a.css("overflow", "visible"), s.css({ width: "100%", "max-width": "100%", height: "9999px" }), void 0 === r && (r = Math.ceil(Math.max(o[0].clientWidth, o.outerWidth(!0)))), s.css("width", r || "").css("max-width", ""), void 0 === c && (c = Math.ceil(Math.max(o[0].clientHeight, o.outerHeight(!0)))), s.css("height", c || ""), a.css("overflow", "auto")), s.removeClass("fancybox-is-hidden") } })) : o.afterLoad(t), e.attr("src", t.src), a.one("onReset", function () { try { n(this).find("iframe").hide().unbind().attr("src", "//about:blank") } catch (t) { } n(this).off("refresh.fb").empty(), t.isLoaded = !1, t.isRevealed = !1 }) }, setContent: function (t, e) { var o = this; o.isClosing || (o.hideLoading(t), t.$content && n.fancybox.stop(t.$content), t.$slide.empty(), l(e) && e.parent().length ? ((e.hasClass("fancybox-content") || e.parent().hasClass("fancybox-content")) && e.parents(".fancybox-slide").trigger("onReset"), t.$placeholder = n("<div>").hide().insertAfter(e), e.css("display", "inline-block")) : t.hasError || ("string" === n.type(e) && (e = n("<div>").append(n.trim(e)).contents()), t.opts.filter && (e = n("<div>").html(e).find(t.opts.filter))), t.$slide.one("onReset", function () { n(this).find("video,audio").trigger("pause"), t.$placeholder && (t.$placeholder.after(e.removeClass("fancybox-content").hide()).remove(), t.$placeholder = null), t.$smallBtn && (t.$smallBtn.remove(), t.$smallBtn = null), t.hasError || (n(this).empty(), t.isLoaded = !1, t.isRevealed = !1) }), n(e).appendTo(t.$slide), n(e).is("video,audio") && (n(e).addClass("fancybox-video"), n(e).wrap("<div></div>"), t.contentType = "video", t.opts.width = t.opts.width || n(e).attr("width"), t.opts.height = t.opts.height || n(e).attr("height")), t.$content = t.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first(), t.$content.siblings().hide(), t.$content.length || (t.$content = t.$slide.wrapInner("<div></div>").children().first()), t.$content.addClass("fancybox-content"), t.$slide.addClass("fancybox-slide--" + t.contentType), o.afterLoad(t)) }, setError: function (t) { t.hasError = !0, t.$slide.trigger("onReset").removeClass("fancybox-slide--" + t.contentType).addClass("fancybox-slide--error"), t.contentType = "html", this.setContent(t, this.translate(t, t.opts.errorTpl)), t.pos === this.currPos && (this.isAnimating = !1) }, showLoading: function (t) { var e = this; (t = t || e.current) && !t.$spinner && (t.$spinner = n(e.translate(e, e.opts.spinnerTpl)).appendTo(t.$slide).hide().fadeIn("fast")) }, hideLoading: function (t) { var e = this; (t = t || e.current) && t.$spinner && (t.$spinner.stop().remove(), delete t.$spinner) }, afterLoad: function (t) { var e = this; e.isClosing || (t.isLoading = !1, t.isLoaded = !0, e.trigger("afterLoad", t), e.hideLoading(t), !t.opts.smallBtn || t.$smallBtn && t.$smallBtn.length || (t.$smallBtn = n(e.translate(t, t.opts.btnTpl.smallBtn)).appendTo(t.$content)), t.opts.protect && t.$content && !t.hasError && (t.$content.on("contextmenu.fb", function (t) { return 2 == t.button && t.preventDefault(), !0 }), "image" === t.type && n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)), e.adjustCaption(t), e.adjustLayout(t), t.pos === e.currPos && e.updateCursor(), e.revealContent(t)) }, adjustCaption: function (t) { var e, n = this, o = t || n.current, i = o.opts.caption, a = o.opts.preventCaptionOverlap, s = n.$refs.caption, r = !1; s.toggleClass("fancybox-caption--separate", a), a && i && i.length && (o.pos !== n.currPos ? (e = s.clone().appendTo(s.parent()), e.children().eq(0).empty().html(i), r = e.outerHeight(!0), e.empty().remove()) : n.$caption && (r = n.$caption.outerHeight(!0)), o.$slide.css("padding-bottom", r || "")) }, adjustLayout: function (t) { var e, n, o, i, a = this, s = t || a.current; s.isLoaded && !0 !== s.opts.disableLayoutFix && (s.$content.css("margin-bottom", ""), s.$content.outerHeight() > s.$slide.height() + .5 && (o = s.$slide[0].style["padding-bottom"], i = s.$slide.css("padding-bottom"), parseFloat(i) > 0 && (e = s.$slide[0].scrollHeight, s.$slide.css("padding-bottom", 0), Math.abs(e - s.$slide[0].scrollHeight) < 1 && (n = i), s.$slide.css("padding-bottom", o))), s.$content.css("margin-bottom", n)) }, revealContent: function (t) { var e, o, i, a, s = this, r = t.$slide, c = !1, l = !1, d = s.isMoved(t), u = t.isRevealed; return t.isRevealed = !0, e = t.opts[s.firstRun ? "animationEffect" : "transitionEffect"], i = t.opts[s.firstRun ? "animationDuration" : "transitionDuration"], i = parseInt(void 0 === t.forcedDuration ? i : t.forcedDuration, 10), !d && t.pos === s.currPos && i || (e = !1), "zoom" === e && (t.pos === s.currPos && i && "image" === t.type && !t.hasError && (l = s.getThumbPos(t)) ? c = s.getFitPos(t) : e = "fade"), "zoom" === e ? (s.isAnimating = !0, c.scaleX = c.width / l.width, c.scaleY = c.height / l.height, a = t.opts.zoomOpacity, "auto" == a && (a = Math.abs(t.width / t.height - l.width / l.height) > .1), a && (l.opacity = .1, c.opacity = 1), n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"), l), p(t.$content), void n.fancybox.animate(t.$content, c, i, function () { s.isAnimating = !1, s.complete() })) : (s.updateSlide(t), e ? (n.fancybox.stop(r), o = "fancybox-slide--" + (t.pos >= s.prevPos ? "next" : "previous") + " fancybox-animated fancybox-fx-" + e, r.addClass(o).removeClass("fancybox-slide--current"), t.$content.removeClass("fancybox-is-hidden"), p(r), "image" !== t.type && t.$content.hide().show(0), void n.fancybox.animate(r, "fancybox-slide--current", i, function () { r.removeClass(o).css({ transform: "", opacity: "" }), t.pos === s.currPos && s.complete() }, !0)) : (t.$content.removeClass("fancybox-is-hidden"), u || !d || "image" !== t.type || t.hasError || t.$content.hide().fadeIn("fast"), void (t.pos === s.currPos && s.complete()))) }, getThumbPos: function (t) { var e, o, i, a, s, r = !1, c = t.$thumb; return !(!c || !g(c[0])) && (e = n.fancybox.getTranslate(c), o = parseFloat(c.css("border-top-width") || 0), i = parseFloat(c.css("border-right-width") || 0), a = parseFloat(c.css("border-bottom-width") || 0), s = parseFloat(c.css("border-left-width") || 0), r = { top: e.top + o, left: e.left + s, width: e.width - i - s, height: e.height - o - a, scaleX: 1, scaleY: 1 }, e.width > 0 && e.height > 0 && r) }, complete: function () { var t, e = this, o = e.current, i = {}; !e.isMoved() && o.isLoaded && (o.isComplete || (o.isComplete = !0, o.$slide.siblings().trigger("onReset"), e.preload("inline"), p(o.$slide), o.$slide.addClass("fancybox-slide--complete"), n.each(e.slides, function (t, o) { o.pos >= e.currPos - 1 && o.pos <= e.currPos + 1 ? i[o.pos] = o : o && (n.fancybox.stop(o.$slide), o.$slide.off().remove()) }), e.slides = i), e.isAnimating = !1, e.updateCursor(), e.trigger("afterShow"), o.opts.video.autoStart && o.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended", function () { Document.exitFullscreen ? Document.exitFullscreen() : this.webkitExitFullscreen && this.webkitExitFullscreen(), e.next() }), o.opts.autoFocus && "html" === o.contentType && (t = o.$content.find("input[autofocus]:enabled:visible:first"), t.length ? t.trigger("focus") : e.focus(null, !0)), o.$slide.scrollTop(0).scrollLeft(0)) }, preload: function (t) { var e, n, o = this; o.group.length < 2 || (n = o.slides[o.currPos + 1], e = o.slides[o.currPos - 1], e && e.type === t && o.loadSlide(e), n && n.type === t && o.loadSlide(n)) }, focus: function (t, o) { var i, a, s = this, r = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'].join(","); s.isClosing || (i = !t && s.current && s.current.isComplete ? s.current.$slide.find("*:visible" + (o ? ":not(.fancybox-close-small)" : "")) : s.$refs.container.find("*:visible"), i = i.filter(r).filter(function () { return "hidden" !== n(this).css("visibility") && !n(this).hasClass("disabled") }), i.length ? (a = i.index(e.activeElement), t && t.shiftKey ? (a < 0 || 0 == a) && (t.preventDefault(), i.eq(i.length - 1).trigger("focus")) : (a < 0 || a == i.length - 1) && (t && t.preventDefault(), i.eq(0).trigger("focus"))) : s.$refs.container.trigger("focus")) }, activate: function () { var t = this; n(".fancybox-container").each(function () { var e = n(this).data("FancyBox"); e && e.id !== t.id && !e.isClosing && (e.trigger("onDeactivate"), e.removeEvents(), e.isVisible = !1) }), t.isVisible = !0, (t.current || t.isIdle) && (t.update(), t.updateControls()), t.trigger("onActivate"), t.addEvents() }, close: function (t, e) {
        var o, i, a, s, r, c, l, u = this, f = u.current, h = function () { u.cleanUp(t) }; return !u.isClosing && (u.isClosing = !0, !1 === u.trigger("beforeClose", t) ? (u.isClosing = !1, d(function () { u.update() }), !1) : (u.removeEvents(), a = f.$content, o = f.opts.animationEffect, i = n.isNumeric(e) ? e : o ? f.opts.animationDuration : 0, f.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"), !0 !== t ? n.fancybox.stop(f.$slide) : o = !1, f.$slide.siblings().trigger("onReset").remove(), i && u.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration", i + "ms"), u.hideLoading(f), u.hideControls(!0), u.updateCursor(), "zoom" !== o || a && i && "image" === f.type && !u.isMoved() && !f.hasError && (l = u.getThumbPos(f)) || (o = "fade"), "zoom" === o ? (n.fancybox.stop(a), s = n.fancybox.getTranslate(a), c = { top: s.top, left: s.left, scaleX: s.width / l.width, scaleY: s.height / l.height, width: l.width, height: l.height }, r = f.opts.zoomOpacity,
          "auto" == r && (r = Math.abs(f.width / f.height - l.width / l.height) > .1), r && (l.opacity = 0), n.fancybox.setTranslate(a, c), p(a), n.fancybox.animate(a, l, i, h), !0) : (o && i ? n.fancybox.animate(f.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"), "fancybox-animated fancybox-fx-" + o, i, h) : !0 === t ? setTimeout(h, i) : h(), !0)))
      }, cleanUp: function (e) { var o, i, a, s = this, r = s.current.opts.$orig; s.current.$slide.trigger("onReset"), s.$refs.container.empty().remove(), s.trigger("afterClose", e), s.current.opts.backFocus && (r && r.length && r.is(":visible") || (r = s.$trigger), r && r.length && (i = t.scrollX, a = t.scrollY, r.trigger("focus"), n("html, body").scrollTop(a).scrollLeft(i))), s.current = null, o = n.fancybox.getInstance(), o ? o.activate() : (n("body").removeClass("fancybox-active compensate-for-scrollbar"), n("#fancybox-style-noscroll").remove()) }, trigger: function (t, e) { var o, i = Array.prototype.slice.call(arguments, 1), a = this, s = e && e.opts ? e : a.current; if (s ? i.unshift(s) : s = a, i.unshift(a), n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)), !1 === o) return o; "afterClose" !== t && a.$refs ? a.$refs.container.trigger(t + ".fb", i) : r.trigger(t + ".fb", i) }, updateControls: function () { var t = this, o = t.current, i = o.index, a = t.$refs.container, s = t.$refs.caption, r = o.opts.caption; o.$slide.trigger("refresh"), r && r.length ? (t.$caption = s, s.children().eq(0).html(r)) : t.$caption = null, t.hasHiddenControls || t.isIdle || t.showControls(), a.find("[data-fancybox-count]").html(t.group.length), a.find("[data-fancybox-index]").html(i + 1), a.find("[data-fancybox-prev]").prop("disabled", !o.opts.loop && i <= 0), a.find("[data-fancybox-next]").prop("disabled", !o.opts.loop && i >= t.group.length - 1), "image" === o.type ? a.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href", o.opts.image.src || o.src).show() : o.opts.toolbar && a.find("[data-fancybox-download],[data-fancybox-zoom]").hide(), n(e.activeElement).is(":hidden,[disabled]") && t.$refs.container.trigger("focus") }, hideControls: function (t) { var e = this, n = ["infobar", "toolbar", "nav"]; !t && e.current.opts.preventCaptionOverlap || n.push("caption"), this.$refs.container.removeClass(n.map(function (t) { return "fancybox-show-" + t }).join(" ")), this.hasHiddenControls = !0 }, showControls: function () { var t = this, e = t.current ? t.current.opts : t.opts, n = t.$refs.container; t.hasHiddenControls = !1, t.idleSecondsCounter = 0, n.toggleClass("fancybox-show-toolbar", !(!e.toolbar || !e.buttons)).toggleClass("fancybox-show-infobar", !!(e.infobar && t.group.length > 1)).toggleClass("fancybox-show-caption", !!t.$caption).toggleClass("fancybox-show-nav", !!(e.arrows && t.group.length > 1)).toggleClass("fancybox-is-modal", !!e.modal) }, toggleControls: function () { this.hasHiddenControls ? this.showControls() : this.hideControls() }
    }), n.fancybox = { version: "3.5.7", defaults: a, getInstance: function (t) { var e = n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"), o = Array.prototype.slice.call(arguments, 1); return e instanceof b && ("string" === n.type(t) ? e[t].apply(e, o) : "function" === n.type(t) && t.apply(e, o), e) }, open: function (t, e, n) { return new b(t, e, n) }, close: function (t) { var e = this.getInstance(); e && (e.close(), !0 === t && this.close(t)) }, destroy: function () { this.close(!0), r.add("body").off("click.fb-start", "**") }, isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), use3d: function () { var n = e.createElement("div"); return t.getComputedStyle && t.getComputedStyle(n) && t.getComputedStyle(n).getPropertyValue("transform") && !(e.documentMode && e.documentMode < 11) }(), getTranslate: function (t) { var e; return !(!t || !t.length) && (e = t[0].getBoundingClientRect(), { top: e.top || 0, left: e.left || 0, width: e.width, height: e.height, opacity: parseFloat(t.css("opacity")) }) }, setTranslate: function (t, e) { var n = "", o = {}; if (t && e) return void 0 === e.left && void 0 === e.top || (n = (void 0 === e.left ? t.position().left : e.left) + "px, " + (void 0 === e.top ? t.position().top : e.top) + "px", n = this.use3d ? "translate3d(" + n + ", 0px)" : "translate(" + n + ")"), void 0 !== e.scaleX && void 0 !== e.scaleY ? n += " scale(" + e.scaleX + ", " + e.scaleY + ")" : void 0 !== e.scaleX && (n += " scaleX(" + e.scaleX + ")"), n.length && (o.transform = n), void 0 !== e.opacity && (o.opacity = e.opacity), void 0 !== e.width && (o.width = e.width), void 0 !== e.height && (o.height = e.height), t.css(o) }, animate: function (t, e, o, i, a) { var s, r = this; n.isFunction(o) && (i = o, o = null), r.stop(t), s = r.getTranslate(t), t.on(f, function (c) { (!c || !c.originalEvent || t.is(c.originalEvent.target) && "z-index" != c.originalEvent.propertyName) && (r.stop(t), n.isNumeric(o) && t.css("transition-duration", ""), n.isPlainObject(e) ? void 0 !== e.scaleX && void 0 !== e.scaleY && r.setTranslate(t, { top: e.top, left: e.left, width: s.width * e.scaleX, height: s.height * e.scaleY, scaleX: 1, scaleY: 1 }) : !0 !== a && t.removeClass(e), n.isFunction(i) && i(c)) }), n.isNumeric(o) && t.css("transition-duration", o + "ms"), n.isPlainObject(e) ? (void 0 !== e.scaleX && void 0 !== e.scaleY && (delete e.width, delete e.height, t.parent().hasClass("fancybox-slide--image") && t.parent().addClass("fancybox-is-scaling")), n.fancybox.setTranslate(t, e)) : t.addClass(e), t.data("timer", setTimeout(function () { t.trigger(f) }, o + 33)) }, stop: function (t, e) { t && t.length && (clearTimeout(t.data("timer")), e && t.trigger(f), t.off(f).css("transition-duration", ""), t.parent().removeClass("fancybox-is-scaling")) } }, n.fn.fancybox = function (t) { var e; return t = t || {}, e = t.selector || !1, e ? n("body").off("click.fb-start", e).on("click.fb-start", e, { options: t }, i) : this.off("click.fb-start").on("click.fb-start", { items: this, options: t }, i), this }, r.on("click.fb-start", "[data-fancybox]", i), r.on("click.fb-start", "[data-fancybox-trigger]", function (t) { n('[data-fancybox="' + n(this).attr("data-fancybox-trigger") + '"]').eq(n(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", { $trigger: n(this) }) }), function () { var t = null; r.on("mousedown mouseup focus blur", ".fancybox-button", function (e) { switch (e.type) { case "mousedown": t = n(this); break; case "mouseup": t = null; break; case "focusin": n(".fancybox-button").removeClass("fancybox-focus"), n(this).is(t) || n(this).is("[disabled]") || n(this).addClass("fancybox-focus"); break; case "focusout": n(".fancybox-button").removeClass("fancybox-focus") } }) }()
  }
}(window, document, jQuery), function (t) { "use strict"; var e = { youtube: { matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i, params: { autoplay: 1, autohide: 1, fs: 1, rel: 0, hd: 1, wmode: "transparent", enablejsapi: 1, html5: 1 }, paramPlace: 8, type: "iframe", url: "https://www.youtube-nocookie.com/embed/$4", thumb: "https://img.youtube.com/vi/$4/hqdefault.jpg" }, vimeo: { matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/, params: { autoplay: 1, hd: 1, show_title: 1, show_byline: 1, show_portrait: 0, fullscreen: 1 }, paramPlace: 3, type: "iframe", url: "//player.vimeo.com/video/$2" }, instagram: { matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i, type: "image", url: "//$1/p/$2/media/?size=l" }, gmap_place: { matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i, type: "iframe", url: function (t) { return "//maps.google." + t[2] + "/?ll=" + (t[9] ? t[9] + "&z=" + Math.floor(t[10]) + (t[12] ? t[12].replace(/^\//, "&") : "") : t[12] + "").replace(/\?/, "&") + "&output=" + (t[12] && t[12].indexOf("layer=c") > 0 ? "svembed" : "embed") } }, gmap_search: { matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i, type: "iframe", url: function (t) { return "//maps.google." + t[2] + "/maps?q=" + t[5].replace("query=", "q=").replace("api=1", "") + "&output=embed" } } }, n = function (e, n, o) { if (e) return o = o || "", "object" === t.type(o) && (o = t.param(o, !0)), t.each(n, function (t, n) { e = e.replace("$" + t, n || "") }), o.length && (e += (e.indexOf("?") > 0 ? "&" : "?") + o), e }; t(document).on("objectNeedsType.fb", function (o, i, a) { var s, r, c, l, d, u, f, p = a.src || "", h = !1; s = t.extend(!0, {}, e, a.opts.media), t.each(s, function (e, o) { if (c = p.match(o.matcher)) { if (h = o.type, f = e, u = {}, o.paramPlace && c[o.paramPlace]) { d = c[o.paramPlace], "?" == d[0] && (d = d.substring(1)), d = d.split("&"); for (var i = 0; i < d.length; ++i) { var s = d[i].split("=", 2); 2 == s.length && (u[s[0]] = decodeURIComponent(s[1].replace(/\+/g, " "))) } } return l = t.extend(!0, {}, o.params, a.opts[e], u), p = "function" === t.type(o.url) ? o.url.call(this, c, l, a) : n(o.url, c, l), r = "function" === t.type(o.thumb) ? o.thumb.call(this, c, l, a) : n(o.thumb, c), "youtube" === e ? p = p.replace(/&t=((\d+)m)?(\d+)s/, function (t, e, n, o) { return "&start=" + ((n ? 60 * parseInt(n, 10) : 0) + parseInt(o, 10)) }) : "vimeo" === e && (p = p.replace("&%23", "#")), !1 } }), h ? (a.opts.thumb || a.opts.$thumb && a.opts.$thumb.length || (a.opts.thumb = r), "iframe" === h && (a.opts = t.extend(!0, a.opts, { iframe: { preload: !1, attr: { scrolling: "no" } } })), t.extend(a, { type: h, src: p, origSrc: a.src, contentSource: f, contentType: "image" === h ? "image" : "gmap_place" == f || "gmap_search" == f ? "map" : "video" })) : p && (a.type = a.opts.defaultType) }); var o = { youtube: { src: "https://www.youtube.com/iframe_api", class: "YT", loading: !1, loaded: !1 }, vimeo: { src: "https://player.vimeo.com/api/player.js", class: "Vimeo", loading: !1, loaded: !1 }, load: function (t) { var e, n = this; if (this[t].loaded) return void setTimeout(function () { n.done(t) }); this[t].loading || (this[t].loading = !0, e = document.createElement("script"), e.type = "text/javascript", e.src = this[t].src, "youtube" === t ? window.onYouTubeIframeAPIReady = function () { n[t].loaded = !0, n.done(t) } : e.onload = function () { n[t].loaded = !0, n.done(t) }, document.body.appendChild(e)) }, done: function (e) { var n, o, i; "youtube" === e && delete window.onYouTubeIframeAPIReady, (n = t.fancybox.getInstance()) && (o = n.current.$content.find("iframe"), "youtube" === e && void 0 !== YT && YT ? i = new YT.Player(o.attr("id"), { events: { onStateChange: function (t) { 0 == t.data && n.next() } } }) : "vimeo" === e && void 0 !== Vimeo && Vimeo && (i = new Vimeo.Player(o), i.on("ended", function () { n.next() }))) } }; t(document).on({ "afterShow.fb": function (t, e, n) { e.group.length > 1 && ("youtube" === n.contentSource || "vimeo" === n.contentSource) && o.load(n.contentSource) } }) }(jQuery), function (t, e, n) { "use strict"; var o = function () { return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || function (e) { return t.setTimeout(e, 1e3 / 60) } }(), i = function () { return t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.mozCancelAnimationFrame || t.oCancelAnimationFrame || function (e) { t.clearTimeout(e) } }(), a = function (e) { var n = []; e = e.originalEvent || e || t.e, e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e]; for (var o in e) e[o].pageX ? n.push({ x: e[o].pageX, y: e[o].pageY }) : e[o].clientX && n.push({ x: e[o].clientX, y: e[o].clientY }); return n }, s = function (t, e, n) { return e && t ? "x" === n ? t.x - e.x : "y" === n ? t.y - e.y : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) : 0 }, r = function (t) { if (t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe') || n.isFunction(t.get(0).onclick) || t.data("selectable")) return !0; for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++)if ("data-fancybox-" === o[e].nodeName.substr(0, 14)) return !0; return !1 }, c = function (e) { var n = t.getComputedStyle(e)["overflow-y"], o = t.getComputedStyle(e)["overflow-x"], i = ("scroll" === n || "auto" === n) && e.scrollHeight > e.clientHeight, a = ("scroll" === o || "auto" === o) && e.scrollWidth > e.clientWidth; return i || a }, l = function (t) { for (var e = !1; ;) { if (e = c(t.get(0))) break; if (t = t.parent(), !t.length || t.hasClass("fancybox-stage") || t.is("body")) break } return e }, d = function (t) { var e = this; e.instance = t, e.$bg = t.$refs.bg, e.$stage = t.$refs.stage, e.$container = t.$refs.container, e.destroy(), e.$container.on("touchstart.fb.touch mousedown.fb.touch", n.proxy(e, "ontouchstart")) }; d.prototype.destroy = function () { var t = this; t.$container.off(".fb.touch"), n(e).off(".fb.touch"), t.requestId && (i(t.requestId), t.requestId = null), t.tapped && (clearTimeout(t.tapped), t.tapped = null) }, d.prototype.ontouchstart = function (o) { var i = this, c = n(o.target), d = i.instance, u = d.current, f = u.$slide, p = u.$content, h = "touchstart" == o.type; if (h && i.$container.off("mousedown.fb.touch"), (!o.originalEvent || 2 != o.originalEvent.button) && f.length && c.length && !r(c) && !r(c.parent()) && (c.is("img") || !(o.originalEvent.clientX > c[0].clientWidth + c.offset().left))) { if (!u || d.isAnimating || u.$slide.hasClass("fancybox-animated")) return o.stopPropagation(), void o.preventDefault(); i.realPoints = i.startPoints = a(o), i.startPoints.length && (u.touch && o.stopPropagation(), i.startEvent = o, i.canTap = !0, i.$target = c, i.$content = p, i.opts = u.opts.touch, i.isPanning = !1, i.isSwiping = !1, i.isZooming = !1, i.isScrolling = !1, i.canPan = d.canPan(), i.startTime = (new Date).getTime(), i.distanceX = i.distanceY = i.distance = 0, i.canvasWidth = Math.round(f[0].clientWidth), i.canvasHeight = Math.round(f[0].clientHeight), i.contentLastPos = null, i.contentStartPos = n.fancybox.getTranslate(i.$content) || { top: 0, left: 0 }, i.sliderStartPos = n.fancybox.getTranslate(f), i.stagePos = n.fancybox.getTranslate(d.$refs.stage), i.sliderStartPos.top -= i.stagePos.top, i.sliderStartPos.left -= i.stagePos.left, i.contentStartPos.top -= i.stagePos.top, i.contentStartPos.left -= i.stagePos.left, n(e).off(".fb.touch").on(h ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", n.proxy(i, "ontouchend")).on(h ? "touchmove.fb.touch" : "mousemove.fb.touch", n.proxy(i, "ontouchmove")), n.fancybox.isMobile && e.addEventListener("scroll", i.onscroll, !0), ((i.opts || i.canPan) && (c.is(i.$stage) || i.$stage.find(c).length) || (c.is(".fancybox-image") && o.preventDefault(), n.fancybox.isMobile && c.parents(".fancybox-caption").length)) && (i.isScrollable = l(c) || l(c.parent()), n.fancybox.isMobile && i.isScrollable || o.preventDefault(), (1 === i.startPoints.length || u.hasError) && (i.canPan ? (n.fancybox.stop(i.$content), i.isPanning = !0) : i.isSwiping = !0, i.$container.addClass("fancybox-is-grabbing")), 2 === i.startPoints.length && "image" === u.type && (u.isLoaded || u.$ghost) && (i.canTap = !1, i.isSwiping = !1, i.isPanning = !1, i.isZooming = !0, n.fancybox.stop(i.$content), i.centerPointStartX = .5 * (i.startPoints[0].x + i.startPoints[1].x) - n(t).scrollLeft(), i.centerPointStartY = .5 * (i.startPoints[0].y + i.startPoints[1].y) - n(t).scrollTop(), i.percentageOfImageAtPinchPointX = (i.centerPointStartX - i.contentStartPos.left) / i.contentStartPos.width, i.percentageOfImageAtPinchPointY = (i.centerPointStartY - i.contentStartPos.top) / i.contentStartPos.height, i.startDistanceBetweenFingers = s(i.startPoints[0], i.startPoints[1])))) } }, d.prototype.onscroll = function (t) { var n = this; n.isScrolling = !0, e.removeEventListener("scroll", n.onscroll, !0) }, d.prototype.ontouchmove = function (t) { var e = this; return void 0 !== t.originalEvent.buttons && 0 === t.originalEvent.buttons ? void e.ontouchend(t) : e.isScrolling ? void (e.canTap = !1) : (e.newPoints = a(t), void ((e.opts || e.canPan) && e.newPoints.length && e.newPoints.length && (e.isSwiping && !0 === e.isSwiping || t.preventDefault(), e.distanceX = s(e.newPoints[0], e.startPoints[0], "x"), e.distanceY = s(e.newPoints[0], e.startPoints[0], "y"), e.distance = s(e.newPoints[0], e.startPoints[0]), e.distance > 0 && (e.isSwiping ? e.onSwipe(t) : e.isPanning ? e.onPan() : e.isZooming && e.onZoom())))) }, d.prototype.onSwipe = function (e) { var a, s = this, r = s.instance, c = s.isSwiping, l = s.sliderStartPos.left || 0; if (!0 !== c) "x" == c && (s.distanceX > 0 && (s.instance.group.length < 2 || 0 === s.instance.current.index && !s.instance.current.opts.loop) ? l += Math.pow(s.distanceX, .8) : s.distanceX < 0 && (s.instance.group.length < 2 || s.instance.current.index === s.instance.group.length - 1 && !s.instance.current.opts.loop) ? l -= Math.pow(-s.distanceX, .8) : l += s.distanceX), s.sliderLastPos = { top: "x" == c ? 0 : s.sliderStartPos.top + s.distanceY, left: l }, s.requestId && (i(s.requestId), s.requestId = null), s.requestId = o(function () { s.sliderLastPos && (n.each(s.instance.slides, function (t, e) { var o = e.pos - s.instance.currPos; n.fancybox.setTranslate(e.$slide, { top: s.sliderLastPos.top, left: s.sliderLastPos.left + o * s.canvasWidth + o * e.opts.gutter }) }), s.$container.addClass("fancybox-is-sliding")) }); else if (Math.abs(s.distance) > 10) { if (s.canTap = !1, r.group.length < 2 && s.opts.vertical ? s.isSwiping = "y" : r.isDragging || !1 === s.opts.vertical || "auto" === s.opts.vertical && n(t).width() > 800 ? s.isSwiping = "x" : (a = Math.abs(180 * Math.atan2(s.distanceY, s.distanceX) / Math.PI), s.isSwiping = a > 45 && a < 135 ? "y" : "x"), "y" === s.isSwiping && n.fancybox.isMobile && s.isScrollable) return void (s.isScrolling = !0); r.isDragging = s.isSwiping, s.startPoints = s.newPoints, n.each(r.slides, function (t, e) { var o, i; n.fancybox.stop(e.$slide), o = n.fancybox.getTranslate(e.$slide), i = n.fancybox.getTranslate(r.$refs.stage), e.$slide.css({ transform: "", opacity: "", "transition-duration": "" }).removeClass("fancybox-animated").removeClass(function (t, e) { return (e.match(/(^|\s)fancybox-fx-\S+/g) || []).join(" ") }), e.pos === r.current.pos && (s.sliderStartPos.top = o.top - i.top, s.sliderStartPos.left = o.left - i.left), n.fancybox.setTranslate(e.$slide, { top: o.top - i.top, left: o.left - i.left }) }), r.SlideShow && r.SlideShow.isActive && r.SlideShow.stop() } }, d.prototype.onPan = function () { var t = this; if (s(t.newPoints[0], t.realPoints[0]) < (n.fancybox.isMobile ? 10 : 5)) return void (t.startPoints = t.newPoints); t.canTap = !1, t.contentLastPos = t.limitMovement(), t.requestId && i(t.requestId), t.requestId = o(function () { n.fancybox.setTranslate(t.$content, t.contentLastPos) }) }, d.prototype.limitMovement = function () { var t, e, n, o, i, a, s = this, r = s.canvasWidth, c = s.canvasHeight, l = s.distanceX, d = s.distanceY, u = s.contentStartPos, f = u.left, p = u.top, h = u.width, g = u.height; return i = h > r ? f + l : f, a = p + d, t = Math.max(0, .5 * r - .5 * h), e = Math.max(0, .5 * c - .5 * g), n = Math.min(r - h, .5 * r - .5 * h), o = Math.min(c - g, .5 * c - .5 * g), l > 0 && i > t && (i = t - 1 + Math.pow(-t + f + l, .8) || 0), l < 0 && i < n && (i = n + 1 - Math.pow(n - f - l, .8) || 0), d > 0 && a > e && (a = e - 1 + Math.pow(-e + p + d, .8) || 0), d < 0 && a < o && (a = o + 1 - Math.pow(o - p - d, .8) || 0), { top: a, left: i } }, d.prototype.limitPosition = function (t, e, n, o) { var i = this, a = i.canvasWidth, s = i.canvasHeight; return n > a ? (t = t > 0 ? 0 : t, t = t < a - n ? a - n : t) : t = Math.max(0, a / 2 - n / 2), o > s ? (e = e > 0 ? 0 : e, e = e < s - o ? s - o : e) : e = Math.max(0, s / 2 - o / 2), { top: e, left: t } }, d.prototype.onZoom = function () { var e = this, a = e.contentStartPos, r = a.width, c = a.height, l = a.left, d = a.top, u = s(e.newPoints[0], e.newPoints[1]), f = u / e.startDistanceBetweenFingers, p = Math.floor(r * f), h = Math.floor(c * f), g = (r - p) * e.percentageOfImageAtPinchPointX, b = (c - h) * e.percentageOfImageAtPinchPointY, m = (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft(), v = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop(), y = m - e.centerPointStartX, x = v - e.centerPointStartY, w = l + (g + y), $ = d + (b + x), S = { top: $, left: w, scaleX: f, scaleY: f }; e.canTap = !1, e.newWidth = p, e.newHeight = h, e.contentLastPos = S, e.requestId && i(e.requestId), e.requestId = o(function () { n.fancybox.setTranslate(e.$content, e.contentLastPos) }) }, d.prototype.ontouchend = function (t) { var o = this, s = o.isSwiping, r = o.isPanning, c = o.isZooming, l = o.isScrolling; if (o.endPoints = a(t), o.dMs = Math.max((new Date).getTime() - o.startTime, 1), o.$container.removeClass("fancybox-is-grabbing"), n(e).off(".fb.touch"), e.removeEventListener("scroll", o.onscroll, !0), o.requestId && (i(o.requestId), o.requestId = null), o.isSwiping = !1, o.isPanning = !1, o.isZooming = !1, o.isScrolling = !1, o.instance.isDragging = !1, o.canTap) return o.onTap(t); o.speed = 100, o.velocityX = o.distanceX / o.dMs * .5, o.velocityY = o.distanceY / o.dMs * .5, r ? o.endPanning() : c ? o.endZooming() : o.endSwiping(s, l) }, d.prototype.endSwiping = function (t, e) { var o = this, i = !1, a = o.instance.group.length, s = Math.abs(o.distanceX), r = "x" == t && a > 1 && (o.dMs > 130 && s > 10 || s > 50); o.sliderLastPos = null, "y" == t && !e && Math.abs(o.distanceY) > 50 ? (n.fancybox.animate(o.instance.current.$slide, { top: o.sliderStartPos.top + o.distanceY + 150 * o.velocityY, opacity: 0 }, 200), i = o.instance.close(!0, 250)) : r && o.distanceX > 0 ? i = o.instance.previous(300) : r && o.distanceX < 0 && (i = o.instance.next(300)), !1 !== i || "x" != t && "y" != t || o.instance.centerSlide(200), o.$container.removeClass("fancybox-is-sliding") }, d.prototype.endPanning = function () { var t, e, o, i = this; i.contentLastPos && (!1 === i.opts.momentum || i.dMs > 350 ? (t = i.contentLastPos.left, e = i.contentLastPos.top) : (t = i.contentLastPos.left + 500 * i.velocityX, e = i.contentLastPos.top + 500 * i.velocityY), o = i.limitPosition(t, e, i.contentStartPos.width, i.contentStartPos.height), o.width = i.contentStartPos.width, o.height = i.contentStartPos.height, n.fancybox.animate(i.$content, o, 366)) }, d.prototype.endZooming = function () { var t, e, o, i, a = this, s = a.instance.current, r = a.newWidth, c = a.newHeight; a.contentLastPos && (t = a.contentLastPos.left, e = a.contentLastPos.top, i = { top: e, left: t, width: r, height: c, scaleX: 1, scaleY: 1 }, n.fancybox.setTranslate(a.$content, i), r < a.canvasWidth && c < a.canvasHeight ? a.instance.scaleToFit(150) : r > s.width || c > s.height ? a.instance.scaleToActual(a.centerPointStartX, a.centerPointStartY, 150) : (o = a.limitPosition(t, e, r, c), n.fancybox.animate(a.$content, o, 150))) }, d.prototype.onTap = function (e) { var o, i = this, s = n(e.target), r = i.instance, c = r.current, l = e && a(e) || i.startPoints, d = l[0] ? l[0].x - n(t).scrollLeft() - i.stagePos.left : 0, u = l[0] ? l[0].y - n(t).scrollTop() - i.stagePos.top : 0, f = function (t) { var o = c.opts[t]; if (n.isFunction(o) && (o = o.apply(r, [c, e])), o) switch (o) { case "close": r.close(i.startEvent); break; case "toggleControls": r.toggleControls(); break; case "next": r.next(); break; case "nextOrClose": r.group.length > 1 ? r.next() : r.close(i.startEvent); break; case "zoom": "image" == c.type && (c.isLoaded || c.$ghost) && (r.canPan() ? r.scaleToFit() : r.isScaledDown() ? r.scaleToActual(d, u) : r.group.length < 2 && r.close(i.startEvent)) } }; if ((!e.originalEvent || 2 != e.originalEvent.button) && (s.is("img") || !(d > s[0].clientWidth + s.offset().left))) { if (s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) o = "Outside"; else if (s.is(".fancybox-slide")) o = "Slide"; else { if (!r.current.$content || !r.current.$content.find(s).addBack().filter(s).length) return; o = "Content" } if (i.tapped) { if (clearTimeout(i.tapped), i.tapped = null, Math.abs(d - i.tapX) > 50 || Math.abs(u - i.tapY) > 50) return this; f("dblclick" + o) } else i.tapX = d, i.tapY = u, c.opts["dblclick" + o] && c.opts["dblclick" + o] !== c.opts["click" + o] ? i.tapped = setTimeout(function () { i.tapped = null, r.isAnimating || f("click" + o) }, 500) : f("click" + o); return this } }, n(e).on("onActivate.fb", function (t, e) { e && !e.Guestures && (e.Guestures = new d(e)) }).on("beforeClose.fb", function (t, e) { e && e.Guestures && e.Guestures.destroy() }) }(window, document, jQuery), function (t, e) { "use strict"; e.extend(!0, e.fancybox.defaults, { btnTpl: { slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>' }, slideShow: { autoStart: !1, speed: 3e3, progress: !0 } }); var n = function (t) { this.instance = t, this.init() }; e.extend(n.prototype, { timer: null, isActive: !1, $button: null, init: function () { var t = this, n = t.instance, o = n.group[n.currIndex].opts.slideShow; t.$button = n.$refs.toolbar.find("[data-fancybox-play]").on("click", function () { t.toggle() }), n.group.length < 2 || !o ? t.$button.hide() : o.progress && (t.$progress = e('<div class="fancybox-progress"></div>').appendTo(n.$refs.inner)) }, set: function (t) { var n = this, o = n.instance, i = o.current; i && (!0 === t || i.opts.loop || o.currIndex < o.group.length - 1) ? n.isActive && "video" !== i.contentType && (n.$progress && e.fancybox.animate(n.$progress.show(), { scaleX: 1 }, i.opts.slideShow.speed), n.timer = setTimeout(function () { o.current.opts.loop || o.current.index != o.group.length - 1 ? o.next() : o.jumpTo(0) }, i.opts.slideShow.speed)) : (n.stop(), o.idleSecondsCounter = 0, o.showControls()) }, clear: function () { var t = this; clearTimeout(t.timer), t.timer = null, t.$progress && t.$progress.removeAttr("style").hide() }, start: function () { var t = this, e = t.instance.current; e && (t.$button.attr("title", (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"), t.isActive = !0, e.isComplete && t.set(!0), t.instance.trigger("onSlideShowChange", !0)) }, stop: function () { var t = this, e = t.instance.current; t.clear(), t.$button.attr("title", (e.opts.i18n[e.opts.lang] || e.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"), t.isActive = !1, t.instance.trigger("onSlideShowChange", !1), t.$progress && t.$progress.removeAttr("style").hide() }, toggle: function () { var t = this; t.isActive ? t.stop() : t.start() } }), e(t).on({ "onInit.fb": function (t, e) { e && !e.SlideShow && (e.SlideShow = new n(e)) }, "beforeShow.fb": function (t, e, n, o) { var i = e && e.SlideShow; o ? i && n.opts.slideShow.autoStart && i.start() : i && i.isActive && i.clear() }, "afterShow.fb": function (t, e, n) { var o = e && e.SlideShow; o && o.isActive && o.set() }, "afterKeydown.fb": function (n, o, i, a, s) { var r = o && o.SlideShow; !r || !i.opts.slideShow || 80 !== s && 32 !== s || e(t.activeElement).is("button,a,input") || (a.preventDefault(), r.toggle()) }, "beforeClose.fb onDeactivate.fb": function (t, e) { var n = e && e.SlideShow; n && n.stop() } }), e(t).on("visibilitychange", function () { var n = e.fancybox.getInstance(), o = n && n.SlideShow; o && o.isActive && (t.hidden ? o.clear() : o.set()) }) }(document, jQuery), function (t, e) { "use strict"; var n = function () { for (var e = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], n = {}, o = 0; o < e.length; o++) { var i = e[o]; if (i && i[1] in t) { for (var a = 0; a < i.length; a++)n[e[0][a]] = i[a]; return n } } return !1 }(); if (n) { var o = { request: function (e) { e = e || t.documentElement, e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT) }, exit: function () { t[n.exitFullscreen]() }, toggle: function (e) { e = e || t.documentElement, this.isFullscreen() ? this.exit() : this.request(e) }, isFullscreen: function () { return Boolean(t[n.fullscreenElement]) }, enabled: function () { return Boolean(t[n.fullscreenEnabled]) } }; e.extend(!0, e.fancybox.defaults, { btnTpl: { fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>' }, fullScreen: { autoStart: !1 } }), e(t).on(n.fullscreenchange, function () { var t = o.isFullscreen(), n = e.fancybox.getInstance(); n && (n.current && "image" === n.current.type && n.isAnimating && (n.isAnimating = !1, n.update(!0, !0, 0), n.isComplete || n.complete()), n.trigger("onFullscreenChange", t), n.$refs.container.toggleClass("fancybox-is-fullscreen", t), n.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter", !t).toggleClass("fancybox-button--fsexit", t)) }) } e(t).on({ "onInit.fb": function (t, e) { var i; if (!n) return void e.$refs.toolbar.find("[data-fancybox-fullscreen]").remove(); e && e.group[e.currIndex].opts.fullScreen ? (i = e.$refs.container, i.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function (t) { t.stopPropagation(), t.preventDefault(), o.toggle() }), e.opts.fullScreen && !0 === e.opts.fullScreen.autoStart && o.request(), e.FullScreen = o) : e && e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide() }, "afterKeydown.fb": function (t, e, n, o, i) { e && e.FullScreen && 70 === i && (o.preventDefault(), e.FullScreen.toggle()) }, "beforeClose.fb": function (t, e) { e && e.FullScreen && e.$refs.container.hasClass("fancybox-is-fullscreen") && o.exit() } }) }(document, jQuery), function (t, e) { "use strict"; var n = "fancybox-thumbs"; e.fancybox.defaults = e.extend(!0, { btnTpl: { thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>' }, thumbs: { autoStart: !1, hideOnClose: !0, parentEl: ".fancybox-container", axis: "y" } }, e.fancybox.defaults); var o = function (t) { this.init(t) }; e.extend(o.prototype, { $button: null, $grid: null, $list: null, isVisible: !1, isActive: !1, init: function (t) { var e = this, n = t.group, o = 0; e.instance = t, e.opts = n[t.currIndex].opts.thumbs, t.Thumbs = e, e.$button = t.$refs.toolbar.find("[data-fancybox-thumbs]"); for (var i = 0, a = n.length; i < a && (n[i].thumb && o++, !(o > 1)); i++); o > 1 && e.opts ? (e.$button.removeAttr("style").on("click", function () { e.toggle() }), e.isActive = !0) : e.$button.hide() }, create: function () { var t, o = this, i = o.instance, a = o.opts.parentEl, s = []; o.$grid || (o.$grid = e('<div class="' + n + " " + n + "-" + o.opts.axis + '"></div>').appendTo(i.$refs.container.find(a).addBack().filter(a)), o.$grid.on("click", "a", function () { i.jumpTo(e(this).attr("data-index")) })), o.$list || (o.$list = e('<div class="' + n + '__list">').appendTo(o.$grid)), e.each(i.group, function (e, n) { t = n.thumb, t || "image" !== n.type || (t = n.src), s.push('<a href="javascript:;" tabindex="0" data-index="' + e + '"' + (t && t.length ? ' style="background-image:url(' + t + ')"' : 'class="fancybox-thumbs-missing"') + "></a>") }), o.$list[0].innerHTML = s.join(""), "x" === o.opts.axis && o.$list.width(parseInt(o.$grid.css("padding-right"), 10) + i.group.length * o.$list.children().eq(0).outerWidth(!0)) }, focus: function (t) { var e, n, o = this, i = o.$list, a = o.$grid; o.instance.current && (e = i.children().removeClass("fancybox-thumbs-active").filter('[data-index="' + o.instance.current.index + '"]').addClass("fancybox-thumbs-active"), n = e.position(), "y" === o.opts.axis && (n.top < 0 || n.top > i.height() - e.outerHeight()) ? i.stop().animate({ scrollTop: i.scrollTop() + n.top }, t) : "x" === o.opts.axis && (n.left < a.scrollLeft() || n.left > a.scrollLeft() + (a.width() - e.outerWidth())) && i.parent().stop().animate({ scrollLeft: n.left }, t)) }, update: function () { var t = this; t.instance.$refs.container.toggleClass("fancybox-show-thumbs", this.isVisible), t.isVisible ? (t.$grid || t.create(), t.instance.trigger("onThumbsShow"), t.focus(0)) : t.$grid && t.instance.trigger("onThumbsHide"), t.instance.update() }, hide: function () { this.isVisible = !1, this.update() }, show: function () { this.isVisible = !0, this.update() }, toggle: function () { this.isVisible = !this.isVisible, this.update() } }), e(t).on({ "onInit.fb": function (t, e) { var n; e && !e.Thumbs && (n = new o(e), n.isActive && !0 === n.opts.autoStart && n.show()) }, "beforeShow.fb": function (t, e, n, o) { var i = e && e.Thumbs; i && i.isVisible && i.focus(o ? 0 : 250) }, "afterKeydown.fb": function (t, e, n, o, i) { var a = e && e.Thumbs; a && a.isActive && 71 === i && (o.preventDefault(), a.toggle()) }, "beforeClose.fb": function (t, e) { var n = e && e.Thumbs; n && n.isVisible && !1 !== n.opts.hideOnClose && n.$grid.hide() } }) }(document, jQuery), function (t, e) {
  "use strict"; function n(t) { var e = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;", "`": "&#x60;", "=": "&#x3D;" }; return String(t).replace(/[&<>"'`=\/]/g, function (t) { return e[t] }) } e.extend(!0, e.fancybox.defaults, {
    btnTpl: { share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>' }, share: {
      url: function (t, e) { return !t.currentHash && "inline" !== e.type && "html" !== e.type && (e.origSrc || e.src) || window.location },
      tpl: '<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'
    }
  }), e(t).on("click", "[data-fancybox-share]", function () { var t, o, i = e.fancybox.getInstance(), a = i.current || null; a && ("function" === e.type(a.opts.share.url) && (t = a.opts.share.url.apply(a, [i, a])), o = a.opts.share.tpl.replace(/\{\{media\}\}/g, "image" === a.type ? encodeURIComponent(a.src) : "").replace(/\{\{url\}\}/g, encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g, n(t)).replace(/\{\{descr\}\}/g, i.$caption ? encodeURIComponent(i.$caption.text()) : ""), e.fancybox.open({ src: i.translate(i, o), type: "html", opts: { touch: !1, animationEffect: !1, afterLoad: function (t, e) { i.$refs.container.one("beforeClose.fb", function () { t.close(null, 0) }), e.$content.find(".fancybox-share__button").click(function () { return window.open(this.href, "Share", "width=550, height=450"), !1 }) }, mobile: { autoFocus: !1 } } })) })
}(document, jQuery), function (t, e, n) { "use strict"; function o() { var e = t.location.hash.substr(1), n = e.split("-"), o = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ? parseInt(n.pop(-1), 10) || 1 : 1, i = n.join("-"); return { hash: e, index: o < 1 ? 1 : o, gallery: i } } function i(t) { "" !== t.gallery && n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']").eq(t.index - 1).focus().trigger("click.fb-start") } function a(t) { var e, n; return !!t && (e = t.current ? t.current.opts : t.opts, "" !== (n = e.hash || (e.$orig ? e.$orig.data("fancybox") || e.$orig.data("fancybox-trigger") : "")) && n) } n.escapeSelector || (n.escapeSelector = function (t) { return (t + "").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, function (t, e) { return e ? "\0" === t ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t }) }), n(function () { !1 !== n.fancybox.defaults.hash && (n(e).on({ "onInit.fb": function (t, e) { var n, i; !1 !== e.group[e.currIndex].opts.hash && (n = o(), (i = a(e)) && n.gallery && i == n.gallery && (e.currIndex = n.index - 1)) }, "beforeShow.fb": function (n, o, i, s) { var r; i && !1 !== i.opts.hash && (r = a(o)) && (o.currentHash = r + (o.group.length > 1 ? "-" + (i.index + 1) : ""), t.location.hash !== "#" + o.currentHash && (s && !o.origHash && (o.origHash = t.location.hash), o.hashTimer && clearTimeout(o.hashTimer), o.hashTimer = setTimeout(function () { "replaceState" in t.history ? (t.history[s ? "pushState" : "replaceState"]({}, e.title, t.location.pathname + t.location.search + "#" + o.currentHash), s && (o.hasCreatedHistory = !0)) : t.location.hash = o.currentHash, o.hashTimer = null }, 300))) }, "beforeClose.fb": function (n, o, i) { i && !1 !== i.opts.hash && (clearTimeout(o.hashTimer), o.currentHash && o.hasCreatedHistory ? t.history.back() : o.currentHash && ("replaceState" in t.history ? t.history.replaceState({}, e.title, t.location.pathname + t.location.search + (o.origHash || "")) : t.location.hash = o.origHash), o.currentHash = null) } }), n(t).on("hashchange.fb", function () { var t = o(), e = null; n.each(n(".fancybox-container").get().reverse(), function (t, o) { var i = n(o).data("FancyBox"); if (i && i.currentHash) return e = i, !1 }), e ? e.currentHash === t.gallery + "-" + t.index || 1 === t.index && e.currentHash == t.gallery || (e.currentHash = null, e.close()) : "" !== t.gallery && i(t) }), setTimeout(function () { n.fancybox.getInstance() || i(o()) }, 50)) }) }(window, document, jQuery), function (t, e) { "use strict"; var n = (new Date).getTime(); e(t).on({ "onInit.fb": function (t, e, o) { e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function (t) { var o = e.current, i = (new Date).getTime(); e.group.length < 2 || !1 === o.opts.wheel || "auto" === o.opts.wheel && "image" !== o.type || (t.preventDefault(), t.stopPropagation(), o.$slide.hasClass("fancybox-animated") || (t = t.originalEvent || t, i - n < 250 || (n = i, e[(-t.deltaY || -t.deltaX || t.wheelDelta || -t.detail) < 0 ? "next" : "previous"]()))) }) } }) }(document, jQuery);

theme_custom.removeLocalStorage = function(){
  localStorage.clear();
  setCookie("fit-finder-data", '');
}
theme_custom.base_url = theme_custom.api_base_url;

// DatePicker
theme_custom.datePicker = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  var val = $this.val();
  if (val == "" || val == null) {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else {
    parent.find(".form-error").removeClass("active");
    var selectDate = val.split('-');
    var selectedDate = selectDate[0] + '-' + selectDate[1] + '-' + selectDate[2];
    var currentDate = String(new Date().getDate()).padStart(2, '0'),
      currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'),
      currentYear = new Date().getFullYear(),
      currentFullDate = currentYear + '-' + currentMonth + '-' + currentDate;
    if (selectedDate < currentFullDate) {
      $this.parent(".form-wrap").find(".form-error").text("This date is in the past. Please select a date in the future.").show();
    } else {
      $this.parent(".form-wrap").find(".form-error").hide();
    }
  }
  return count;
}

theme_custom.expiryDateValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  var val = $this.val();
  if (val == "" || val == null) {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else {
    parent.find(".form-error").removeClass("active");
    var selectDate = val.split('/');
    var selectedDate = selectDate[0] + '/' + selectDate[1],
    currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'),
    currentYear = new Date().getFullYear(),
    currentFullDate = currentMonth + '/' + currentYear;
    if (selectedDate < currentFullDate) {
      $this.parent(".form-wrap").find(".form-error").text("This month and year is in the past. Please add a month and year in the future.").show();
    } else {
      $this.parent(".form-wrap").find(".form-error").hide();
    }
    if(selectDate[0] > 12 ){
      $this.parent(".form-wrap").find(".form-error").text("Please enter valid month").show();      
    }
    else{
      $this.parent(".form-wrap").find(".form-error").hide();
    }
  }
  return count;
}

theme_custom.cvvValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == '') {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else if ($this.length > 0) {
    if ($this.val().length > 3) {
        parent.find(".form-error").text('This is too long (maximum is 3 numbers)').addClass("active");
        count = 1;
    } else {
      parent.find(".form-error").text('This is too long (maximum is 3 numbers)').removeClass("active");
    }
  } else {
    parent.find(".form-error").removeClass("active");
  }
  return count;
}


// Get Variant Data
theme_custom.getProductVariantData = function (parentElement) {
  var variantDataGetArray = [], 
      productParent = parentElement, 
      checkSizeIsNotSelect = false, 
      productId = productParent.find(".product-variant-id").val(), 
      productType = productParent.attr('data-product-type');
  var variantTitle = '', variantId, variantImage, variantPrice;
  if (productParent.find('.option-1').length > 0) {
    variantTitle = productParent.find('.option-1').text();
  }
  if (productParent.find('.option-2').length > 0) {
    variantTitle = variantTitle + ' / ' + productParent.find('.option-2').text();
  }
  if (productParent.find('.option-3').length > 0) {
    variantTitle = variantTitle + ' / ' + productParent.find('.option-3').text();
  }
  setTimeout(function(){
    productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop('selected',true);
  },100);
  if(variantTitle.includes("00")){
    checkSizeIsNotSelect = true;
  } else {
    checkSizeIsNotSelect = false;
  }
  var selectedOption = productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`),
  variantPrice = selectedOption.attr('data-variant-price'),
  variantId = selectedOption.attr('value'),
  variantImage = selectedOption.attr('data-variant-image'),
  variantImageOne = selectedOption.attr('data-variant-image-one'),
  variantInventoryPolicy = selectedOption.attr('data-variant-inventory-policy'),
  variantInventoryQuantity = selectedOption.attr('data-variant-inventory-quantity'),
  variantEstimateDate = selectedOption.attr('data-variant-estimate-date');
  variantDataGetArray['productId'] = productId;
  variantDataGetArray['variantId'] = variantId;
  variantDataGetArray['variantImage'] = variantImage;
  variantDataGetArray['variantPrice'] = variantPrice;
  variantDataGetArray['variantTitle'] = variantTitle;
  variantDataGetArray['variantImageOne'] = variantImageOne;
  variantDataGetArray['variantQty'] = variantInventoryQuantity;
  variantDataGetArray['variantInventoryPolicy'] = variantInventoryPolicy;
  variantDataGetArray['variantInventoryQuantity'] = variantInventoryQuantity;
  variantDataGetArray['variantEstimateDate'] = variantEstimateDate;
  productParent.find('.product-variant-id').val(variantId);
  productParent.find(".error-message").removeClass('error-show').text(``);
  if(checkSizeIsNotSelect){
    productParent.find(".error-message").text('Please select the size!').show();
    productParent.find('.product-block-wrap .error-message').addClass("error-show");
  }
  if(!variantId){
    if(productType=='jacket'){
      $(`.product-variant-wrap[data-product-type="jacket"]`).find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
      productParent.find('.pdp-updates-button').addClass('disabled').text("Unavailable");
    } else if (productType=='pants') {
      $(`.product-variant-wrap[data-product-type="pants"]`).find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
      productParent.find('.pdp-updates-button').addClass('disabled').text("Unavailable");
    } else {
      productParent.find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
      productParent.find('.product-block-wrap .error-message').addClass("error-show");
      productParent.find('.pdp-updates-button').addClass('disabled').text("Unavailable");
    }
  } else {
    if(variantInventoryPolicy == 'continue'){
      productParent.find('.pdp-updates-button').text("Update").removeClass('disabled');
      productParent.find(".error-message").removeClass("error-show").text('');
      productParent.find('.product-block-wrap .error-message').removeClass("error-show");
      if(theme_custom.current_date < variantEstimateDate ) {
        if(variantInventoryQuantity <= 0) {
          if(productType=='jacket'){
            $(`.product-variant-wrap[data-product-type="jacket"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
          } else if (productType=='pants') {
            $(`.product-variant-wrap[data-product-type="pants"]`).find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
          } else {
            productParent.find(".estimated-variant-error-block-wrap").addClass("active").find(`.estimated-date`).text(`Estimated ship date: ${variantEstimateDate}`);
          }
        }
      }
    } else {
      if (parseInt(variantInventoryQuantity) <= 0) {
        if(productType=='jacket'){
          $(`.product-variant-wrap[data-product-type="jacket"]`).find(".product-block-wrap .error-message, .error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
          $(`.product-variant-wrap[data-product-type="jacket"]`).find('.pdp-updates-button').addClass('disabled').text("Out of Stock");
        } else if (productType=='pants') {
          $(`.product-variant-wrap[data-product-type="pants"]`).find(".product-block-wrap .error-message, .error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
          $(`.product-variant-wrap[data-product-type="pants"]`).find('.pdp-updates-button').addClass('disabled').text("Out of Stock");
        } else if (productType=='vest') {
          $(`.product-variant-wrap[data-product-type="vest"]`).find(".product-block-wrap .error-message, .error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
          $(`.product-variant-wrap[data-product-type="vest"]`).find('.pdp-updates-button').addClass('disabled').text("Out of Stock");
        } else {
          productParent.find(".product-block-wrap .error-message, .error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
          productParent.find('.pdp-updates-button').addClass('disabled').text("Out of Stock");
        }
      }
    }
  }
  return variantDataGetArray;
}

// DOM loadEvent
theme_custom.loadEvent = function () {
  // shirt or shoes product
  if ($(".singal-product").length > 0) {
    if ($('.product-type').val() == 'shoes' || $('.product-type').val() == 'shirt') {
      if (getCookie("fit-finder-data") != "") {
        var getFitFinderData = JSON.parse(getCookie("fit-finder-data"));
        var productType = $(".product-type").val();
        var parent = $(".product__info-container");
        if (getFitFinderData.shoe_size && productType == 'shoes') {
          if ($(".product-form__input.swatch-product-form").find(`input[name='Size'][value="${getFitFinderData.shoe_size}"]`).length > 0) {
            $(".product-form__input.swatch-product-form").find(`input[name='Size'][value="${getFitFinderData.shoe_size}"]`).prop('checked', true);
          }
        }
        if (getFitFinderData.shirt_neck && getFitFinderData.shirt_sleeve && getFitFinderData.fit && productType == 'shirt') {
          // var shirt_size =  getFitFinderData.shirt_sleeve + ' | ' + getFitFinderData.shirt_neck;
          var shirt_size = getFitFinderData.shirt_neck + ' ' + getFitFinderData.shirt_sleeve;

          if ($(".product-form__input.swatch-product-form").find(`input[value="${shirt_size}"]`).length > 0) {
            $(".product-form__input.swatch-product-form").find(`input[value="${shirt_size}"]`).prop('checked', true);
          }
          var shirt_fit = getFitFinderData.fit;
          if ($(".product-form__input.swatch-product-form").find(`input[value="${shirt_fit}"]`).length > 0) {
            $(".product-form__input.swatch-product-form").find(`input[value="${shirt_fit}"]`).prop('checked', true);
          }
        }
        if (getFitFinderData.jacketSize && productType == 'jacket') {
          var jacketType = getFitFinderData.jacketSize.split(":");
          var jacketTypeVal = '';
          if (jacketType[1] == "S") {
            jacketTypeVal = 'Short'
          } else if (jacketType[1] == "R") {
            jacketTypeVal = 'Regular'
          } else if (jacketType[1] == "L") {
            jacketTypeVal = 'Long'
          }
          $(".product-form__input.swatch-product-form").find(`input[name='Chest Size'][value="${jacketType[0]}"]`).prop('checked', true);
          $(".product-form__input.swatch-product-form").find(`input[name='Style'][value="${jacketTypeVal}"]`).prop('checked', true);
        }
        if (getFitFinderData.pants_waist && getFitFinderData.pants_hight && productType == 'pants') {
          var pants_waist = getFitFinderData.pants_waist;
          if ($(`.swatch-outer-wrapper input[name='Waist'][value="${pants_waist}"]`).length > 0) {
            $(".product-form__input.swatch-product-form").find(`input[name='Waist'][value="${pants_waist}"]`).prop('checked', true);
          }
          var pants_hight = getFitFinderData.pants_hight;
          if ($(`.swatch-outer-wrapper input[name='Length'][value="${pants_hight}"]`).length > 0) {
            $(".product-form__input.swatch-product-form").find(`input[name='Length'][value="${pants_hight}"]`).prop('checked', true);
          }
        }
        if ($('.product-type').val() == 'shirt') {
          $(".swatch-product-form").removeClass("disabled");
          $(".product-form__submit").removeClass("normal-product-disable");
        }
        $(".customize-button-fit-your-find .product-fit-finder").find(".button-title").text("Edit Size");
        localStorage.setItem("edit-fit-finder", "true");
      } else {
        // if ($('.product-type').val() == 'shirt') {
        //   $(".product-form__submit").addClass("normal-product-disable")
        //   $(".swatch-product-form").addClass("disabled");
        //   $(".swatch-color").removeClass("disabled");
        // }
      }
    }
  }
  // Suit or top looks product
  if ($(".looks-product").length > 0) {
    if (getCookie("fit-finder-data") != "") {
      var getFitFinderData = JSON.parse(getCookie("fit-finder-data"));
      setTimeout(function(){
        $(`.product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="jacket"], .product-block-wrap-suit-wrapper .product-variant-wrap[data-product-type="pants"]`).find(".error-message ").removeClass('error-show')
      },500)
      $(".product-data-card").each(function () {
        var parentElement = $(this);
        var productType = $(this).data("product-type").toLowerCase();
        if (getFitFinderData.shoe_size && productType == 'shoes') {
          parentElement.find(`.swatch-wrapper input[data-name='Size']:checked`).removeAttr("checked");
          parentElement.find(`.swatch-wrapper input[data-name='Size'][value="${getFitFinderData.shoe_size}"]`).attr("checked", "checked");
          parentElement.find(".option-name[data-option-title='Size']").text(`${getFitFinderData.shoe_size}`).attr("data-variant-val", getFitFinderData.shoe_size);
          setTimeout(function(){
            theme_custom.getProductVariantData(parentElement);
          },1000)
        }
        if (getFitFinderData.shirt_neck && getFitFinderData.shirt_sleeve && getFitFinderData.fit && productType == 'shirt') {
          // var shirt_size =  getFitFinderData.shirt_sleeve + ' | ' + getFitFinderData.shirt_neck;
          var shirt_size = getFitFinderData.shirt_neck + ' ' + getFitFinderData.shirt_sleeve;
          var shirt_fit = getFitFinderData.fit;
          parentElement.find(`.swatch-wrapper input[data-name='Size']:checked`).removeAttr("checked");
          parentElement.find(`.swatch-wrapper input[data-name='Size'][value="${shirt_size}"]`).attr("checked", "checked");
          parentElement.find(".option-name[data-option-title='Size']").text(`${shirt_size}`).attr("data-variant-val", shirt_size);
          parentElement.find(`.swatch-wrapper input[data-name='Style']:checked`).removeAttr("checked");
          parentElement.find(`.swatch-wrapper input[data-name='Style'][value="${shirt_fit}"]`).attr("checked", "checked");
          parentElement.find(".option-name[data-option-title='Style']").text(`${shirt_fit}`).attr("data-variant-val", shirt_fit);
          setTimeout(function(){
            theme_custom.getProductVariantData(parentElement);
          },1000)
        }
        if (getFitFinderData.jacketSize && productType == 'jacket' || getFitFinderData.jacketSize && productType == 'vest') {
          var jacketType = getFitFinderData.jacketSize.split(":");
          var jacketTypeVal = '';
          if (jacketType[1] == "S") {
            jacketTypeVal = 'Short'
          } else if (jacketType[1] == "R") {
            jacketTypeVal = 'Regular'
          } else if (jacketType[1] == "L") {
            jacketTypeVal = 'Long'
          }
          parentElement.find(`.swatch-wrapper input[data-name='Chest Size']:checked`).removeAttr("checked")
          parentElement.find(`.swatch-wrapper input[data-name='Chest Size'][value="${jacketType[0]}"]`).attr("checked", "checked");
          parentElement.find(`.option-name[data-option-title='Chest Size']`).text(`${jacketType[0]}`).attr("data-variant-val", jacketType[0]);
          parentElement.find(`.swatch-wrapper input[data-name='Style']:checked`).removeAttr("checked");
          parentElement.find(`.swatch-wrapper input[data-name='Style'][value="${jacketTypeVal}"]`).attr("checked", "checked");
          parentElement.find(`.option-name[data-option-title='Style']`).text(`${jacketTypeVal}`).attr("data-variant-val", jacketTypeVal);
          setTimeout(function(){
            theme_custom.getProductVariantData(parentElement);
          },1000)
        }
        if (getFitFinderData.pants_waist && getFitFinderData.pants_hight && productType == 'pants') {
          var pants_waist = getFitFinderData.pants_waist;
          var pants_hight = getFitFinderData.pants_hight;
          parentElement.find(`.swatch-wrapper input[data-name='Waist']:checked`).removeAttr("checked");
          parentElement.find(`.swatch-wrapper input[data-name='Waist'][value="${pants_waist}"]`).attr("checked", "checked");
          parentElement.find(`.option-name[data-option-title='Waist']`).text(`${pants_waist}`).attr("data-variant-val", pants_waist);
          parentElement.find(`.swatch-wrapper input[data-name='Length']:checked`).removeAttr("checked");
          parentElement.find(`.swatch-wrapper input[data-name='Length'][value="${pants_hight}"]`).attr("checked", "checked");
          parentElement.find(`.option-name[data-option-title='Length']`).text(`${pants_hight}`).attr("data-variant-val", pants_hight);
          if (parentElement.find(`.swatch-wrapper input[data-name='Length'][value="${pants_hight}"]`).length > 0) {
          }
          setTimeout(function(){
            theme_custom.getProductVariantData(parentElement);
          },1000)
        }
        if (productType == 'neckties' || productType == 'hanky' || productType == 'bow-ties') {
          setTimeout(function(){
            theme_custom.getProductVariantData(parentElement);
          },1000)
        }
      })
      // product-block-wrap-suit-wrapper
      $(".product-block-wrap-suit-wrapper .variant-info-wrap").each(function () {
        var productType = $(this).data("product-type").toLowerCase();
        if (getFitFinderData.jacketSize && productType == 'jacket') {
          var jacketType = getFitFinderData.jacketSize.split(":");
          var jacketTypeVal = '';
          if (jacketType[1] == "S") {
            jacketTypeVal = 'Short'
          } else if (jacketType[1] == "R") {
            jacketTypeVal = 'Regular'
          } else if (jacketType[1] == "L") {
            jacketTypeVal = 'Long'
          }
          $(this).find("[data-option-title='Chest Size']").attr("data-variant-val", jacketType[0]).text(jacketType[0]);
          $(this).find("[data-option-title='Style']").attr("data-variant-val", jacketTypeVal).text(jacketTypeVal);
          if ($(`.product-data-card-wrap[data-product-type="jacket"]`).find(`.error-message`).text() != '' > 0) {
            $(this).find(".error-message").removeClass(`error-show`).text('');
            $(".product-form__submit").addClass("normal-product-disable");
            $(this).find(".error-message").text(`Jacket product is not available for that specific size`).show();
          } else {
            $(this).find(".error-message").removeClass(`error-show`).text('');
          }
        }
        if ((getFitFinderData.pants_waist && getFitFinderData.pants_hight) && productType == 'pants') {
          var pants_waist = getFitFinderData.pants_waist;
          var pants_hight = getFitFinderData.pants_hight;
          $(this).find(".option-1").attr("data-variant-val", pants_waist).text(pants_waist);
          $(this).find(".option-2").attr("data-variant-val", pants_hight).text(pants_hight);
          if ($(`.product-data-card-wrap[data-product-type="pants"]`).find(".error-message").text() != '' > 0) {
            $(this).find(".error-message").removeClass(`error-show`).text('');
            $(".product-form__submit").addClass("normal-product-disable");
            $(this).find(".error-message").removeClass(`error-show`).text(`Pants product is not available for that specific size`).show();
          } else {
            $(this).find(".error-message").removeClass(`error-show`).text('');
          }
        }
        if (getFitFinderData.jacketSize && productType == 'vest') {
          var jacketType = getFitFinderData.jacketSize.split(":");
          var jacketTypeVal = '';
          if (jacketType[1] == "S") {
            jacketTypeVal = 'Short'
          } else if (jacketType[1] == "R") {
            jacketTypeVal = 'Regular'
          } else if (jacketType[1] == "L") {
            jacketTypeVal = 'Long'
          }
          $(this).find("[data-option-title='Chest Size']").attr("data-variant-val", jacketType[0]).text(jacketType[0]);
          $(this).find("[data-option-title='Style']").attr("data-variant-val", jacketTypeVal).text(jacketTypeVal);
          if ($(`.product-data-card-wrap[data-product-type="vest"]`).find(`.error-message`).text() != '' > 0) {
            $(this).find(".error-message").removeClass("error-show").text('');
            $(".product-form__submit").addClass("normal-product-disable");
            $(this).find(".error-message").text(`Vest product is not available for that specific size`).show();
          } else {
            $(this).find(".error-message").removeClass("error-show").text('');
          }
        }
      });
      $(".looks-add-to-cart").removeClass("disabled");
      $(".customize-button-fit-your-find .top-look-fit-finder").find(".button-title").text("Edit Size");
      localStorage.setItem("edit-fit-finder", "true");
    } else {
      $(".looks-add-to-cart").addClass("disabled");
    }
    setTimeout(function(){
      if($(`.product-data-card-wrap.product-block-item[data-product-type="neckties"]`).length > 0){
        var targetVariant = $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"]`).find(`.option-name.option-1`).text() + ' / ' + $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"]`).find(`.option-name.option-2`).text();
        $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"]`).find(`.product-variant-option option[data-variant-title="${targetVariant}"]`).prop("selected",true);
        var selectedVariantInventoryQuantity = parseInt($(`.product-data-card-wrap.product-block-item[data-product-type="neckties"]`).find($(`.product-variant-option option[data-variant-title="${targetVariant}"]`)).attr("data-variant-inventory-quantity"));
        var selectedVariantInventoryPolicy = $(`.product-data-card-wrap[data-product-type="hanky"]`).find($(`.product-variant-option option[data-variant-title="${targetVariant}"]`)).attr("data-variant-inventory-policy");
        var selectedVariantId= $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"]`).find(`.product-variant-option option[data-variant-title="${targetVariant}"]`).val();`.product-variant-option option[data-variant-title="${targetVariant}"]`
        if (!selectedVariantId) {
          $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"] .product-block-wrap, .product-data-card-wrap[data-product-type="neckties"] .edit-item-popup`).find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
        } else {
          if (selectedVariantInventoryPolicy == 'continue') {
            $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"] .product-block-wrap, .product-data-card-wrap[data-product-type="neckties"] .edit-item-popup`).find(".error-message").removeClass("error-show").text('');
          } else {
            if (selectedVariantInventoryQuantity <= 0) {
              $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"] .product-block-wrap, .product-data-card-wrap[data-product-type="neckties"] .edit-item-popup`).find(".error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
              $(`.product-data-card-wrap[data-product-type="neckties"]`).find('.edit-item-popup .pdp-updates-button').addClass("disabled").find(".button-label").text('Out of Stock')
            } else {
              $(`.product-data-card-wrap.product-block-item[data-product-type="neckties"] .product-block-wrap, .product-data-card-wrap[data-product-type="neckties"] .edit-item-popup`).find(".error-message").removeClass("error-show").text('');
            }
          }
        }
      }
      if($(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).length > 0){
        var targetVariant = $(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).find(`.option-name.option-1`).text();
        $(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).find(`.product-variant-option option[data-variant-title="${targetVariant}"]`).prop("selected",true);
        var productVariantTitle = [];
        var selectOptionVar = $(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).find('.product-variant-option option');
        selectOptionVar.each(function(){
          productVariantTitle.push($(this).attr("data-variant-title"));    
        });
        var selectedVariantId = $(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).find($(`.product-variant-option option[data-variant-title="${targetVariant}"]`)).val();
        var selectedVariantInventoryQuantity = parseInt($(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).find($(`.product-variant-option option[data-variant-title="${targetVariant}"]`)).attr("data-variant-inventory-quantity"));
        var selectedVariantInventoryPolicy = $(`.product-data-card-wrap.product-block-item[data-product-type="hanky"]`).find($(`.product-variant-option option[data-variant-title="${targetVariant}"]`)).attr("data-variant-inventory-policy");
        if (!selectedVariantId) {
          $(`.product-data-card[data-product-type="hanky"] .product-block-wrap, .product-data-card-wrap[data-product-type="hanky"] .edit-item-popup`).find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
        } else {
          if (selectedVariantInventoryPolicy == 'continue') {
            $(`.product-data-card[data-product-type="hanky"] .product-block-wrap, .product-data-card-wrap[data-product-type="hanky"] .edit-item-popup`).find(".error-message").removeClass("error-show").text('');
          } else {
            if (selectedVariantInventoryQuantity <= 0) {
              $(`.product-data-card[data-product-type="hanky"] .product-block-wrap, .product-data-card-wrap[data-product-type="hanky"] .edit-item-popup`).find(".error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
              $(`.product-data-card-wrap[data-product-type="hanky"]`).find('.edit-item-popup .pdp-updates-button .button').addClass("disabled").find(".button-label").text('Out of Stock')
            } else {
              $(`.product-data-card[data-product-type="hanky"] .product-block-wrap, .product-data-card-wrap[data-product-type="hanky"] .edit-item-popup`).find(".error-message").removeClass("error-show").text('');
            }
          }
        }
      }
    },1000)
  }
};
// theme_custom.updateProfileImage
theme_custom.updateProfileImage = function (that) {
  var button = that,
    form_data = new FormData(),
    eventId = $("#weddingevent_id").val(),
    fileVal = $('#imageUpload').prop('files')[0],
    imageType = /image.*/;

  if (!fileVal.type.match(imageType)) {
    return;
  } else {
    form_data.append('eventImage', fileVal);
  }
  $.ajax({
    url: `${theme_custom.base_url}/api/event/picture/${eventId}`,
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
      button.addClass("disabled");
    },
    success: function (result) {
      button.addClass("disabled");
      $('.update-profile-image-popup-wrapper .api_error').addClass("success-event").show().html(result.message);
      setTimeout(() => {
        location.reload();
      }, 5000);
    },
    error: function (xhr, status, error) {
      if (xhr.responseJSON.message == 'Token is invalid or expired.') {
        $('.update-profile-image-popup-wrapper .api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
          'text-align': 'center',
          'color': 'red'
        });
        setTimeout(() => {
          theme_custom.removeLocalStorage();
          window.location.href = '/account/logout';
        }, 5000);
      } else {
        button.addClass("disabled").css("margin-top", "15px");
        $('.update-profile-image-popup-wrapper .api_error').show().html(xhr.responseJSON.message);
        setTimeout(() => {
          $('.update-profile-image-popup-wrapper .api_error').hide();
          button.removeClass("disabled");
        }, 3000);
      }
    }
  });
}
// Money filter 
theme_custom.Shopify = {
  formatMoney: function formatMoney(t, r) {
    function e(t, r) {
      return void 0 === t ? r : t;
    }

    function a(t, r, a, o) {
      if (r = e(r, 2), a = e(a, ","), o = e(o, "."), isNaN(t) || null == t) return 0;
      t = (t / 100).toFixed(r);
      var n = t.split(".");
      return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) + (n[1] ? o + n[1] : "");
    }

    "string" == typeof t && (t = t.replace(".", ""));
    var o = "",
      n = /\{\{\s*(\w+)\s*\}\}/,
      i = r || this.money_format;

    switch (i.match(n)[1]) {
      case "amount":
        o = a(t, 2);
        break;

      case "amount_no_decimals":
        o = a(t, 0);
        break;

      case "amount_with_comma_separator":
        o = a(t, 2, ".", ",");
        break;

      case "amount_with_space_separator":
        o = a(t, 2, " ", ",");
        break;

      case "amount_with_period_and_space_separator":
        o = a(t, 2, " ", ".");
        break;

      case "amount_no_decimals_with_comma_separator":
        o = a(t, 0, ".", ",");
        break;

      case "amount_no_decimals_with_space_separator":
        o = a(t, 0, " ", "");
        break;

      case "amount_with_apostrophe_separator":
        o = a(t, 2, "'", ".");
        break;

      case "amount_with_decimal_separator":
        o = a(t, 2, ".", ".");
    }

    return i.replace(n, o);
  },
  formatImage: function formatImage(originalImageUrl, format) {
    return originalImageUrl.replace(/^(.*)\.([^\.]*)$/g, '$1_' + format + '.$2');
  },
  Image: {
    imageSize: function imageSize(t) {
      var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
      return null !== e ? e[1] : null;
    },
    getSizedImageUrl: function getSizedImageUrl(t, e) {
      if (null == e) return t;
      if ("master" == e) return this.removeProtocol(t);
      var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

      if (null != o) {
        var i = t.split(o[0]),
          r = o[0];
        return this.removeProtocol(i[0] + "_" + e + r);
      }

      return null;
    },
    removeProtocol: function removeProtocol(t) {
      return t.replace(/http(s)?:/, "");
    }
  }
};
// theme_custom.iconWithTextSlider
theme_custom.IconWithTextSlider = function () {
  if ($(window).width() < 768) {
    $('.icontextblock_container').on('init', function (event, slick) {
       // set this slider as const for use in set time out
      const slider = this;
        
      // slight delay so init completes render
      setTimeout(function() {

        // dot
        let dots = $('.slick-dots li', slider);

        // each dot function
        
        $.each(dots, function(i,e) {
          // $(this).attr("role",`tab`);
          $(this).attr("aria-hidden",`false`);
          $(this).find('button').removeAttr("data-role");
          // let slick_list = $(slider).find(".slick-list");
          // $(slick_list).attr("role","button");
            $(this).find('button').removeAttr("role");
            $(this).find('button').removeAttr("aria-required");
        });
      }, 100);

    });
  
    $(".icontextblock_container").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      fade: true,
      adaptiveHeight: true,
      accessibility:false
    });
    
    $(`.index-icon-with-text-slider .section-loader`).fadeOut();
    $(`.index-icon-with-text-slider .page-width-big`).fadeIn();
  }
}
//featureLooksSlider slider
theme_custom.featureLooksSlider = function () {
  $('.feature-looks-slider').slick({
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: false,
    prevArrow: "<img alt='slider-prev' class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
    nextArrow: "<img alt='slider-next' class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    ]
  });
}
// dataURLtoFile
theme_custom.dataURLtoFile = function (dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
var hideConfirmationMsg = setInterval(() => {
  if ($(".form__message").length > 0) {
    setTimeout(() => {
      $(".form__message").addClass("hidden");
      clearInterval(hideConfirmationMsg);
    }, 10000);
  }
}, 1500);
// theme slider 
theme_custom.themeSlider = function () {
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
    prevArrow: "<img alt='slider-prev'  class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
    nextArrow: "<img alt='slider-next'  class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true
  });
  // feature Product
  $('.slider_featureproduct').on('init', function (event, slick) {
    const slider_featureproduct = this;
    setTimeout(function() {
      let slick_list = $(slider_featureproduct).find(".slick-list");
      $(slick_list).attr("role","listitem");
    });
  });
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
    prevArrow: "<img alt='slider-prev'  class='slick-prev pull-left' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_left.png?v=1631874486'>",
    nextArrow: "<img alt='slider-next'  class='slick-next pull-right' src='https://cdn.shopify.com/s/files/1/0588/4700/2812/files/slider_arrow_right.png?v=1631874485'>",
    speed: 300,
    autoplaySpeed: 1000,
    cssEase: 'ease-in-out',
    slidesToShow: 4,
    slidesToScroll: 1,
    //fade: true,
    responsive: [{
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

      // each dot function
      
      $.each(slick_track, function(i,e) {
        $(this).attr("aria-hidden",`false`);
      });

    },100);
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
    autoplay: false,
    prevArrow: `<div class="prev-btn slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="21" viewBox="0 0 11 21" fill="none"><path id="Vector 11" d="M10 20L0.999999 10.5L10 1" stroke="black"/></svg></div>`,
    nextArrow: `<div class="next-btn slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="21" viewBox="0 0 11 21" fill="none"><path id="Vector 10" d="M1 1L10 10.5L1 20" stroke="black"/></svg></div>`,
    speed: 500,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [{
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
}
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
  $('.custom-text-filed').bind("keypress keyup keydown", function (e) {
    //theme_custom.textValidationWithSpacialChar($(this));
    theme_custom.textareaValidation($(this));
  });
  $(".form_zip").bind("keypress keyup keydown", function(e) {
    theme_custom.zipValidation($(this));
  });
  $('.custom-event-reminder-name').bind("keypress keyup keydown", function (e) {
    //theme_custom.textValidationWithSpacialChar($(this));
    theme_custom.eventReminderTitleValidation($(this));
  });
  $('.custom-filed').bind("keypress keyup keydown", function (e) {
    theme_custom.nameValidation($(this));
  });
  $('.form_name').bind("keypress keyup keydown", function (e) {
    theme_custom.nameValidation($(this));
  });

  $(".form_phone").bind("keypress keyup keydown", function (e) {
        var text = $(this).val().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
        $(this).val(text);
        theme_custom.phoneValidation($(this));
  });

  // $('#Contact-Country').change(function() {
  //   theme_custom.countryValidation($(this));
  // });

  $(document).on("change", "#Contact-Country, #Contact-State", function () {
    theme_custom.countryValidation($(this));
  });

  $(".text-area").bind("keypress keyup keydown", function (e) {
    theme_custom.textareaValidation($(this));
  });

  $(".card-number-validate").bind("keypress keyup keydown", function (e) {
    var text = $(this).val().replace(/(\d\d\d\d)(\d\d\d\d)(\d\d\d\d)(\d\d\d\d)/, "$1 $2 $3 $4");
    $(this).val(text);
    theme_custom.cardNumberValidation($(this));
  });

  $(".exp-date").bind("keypress keyup keydown", function (e) {
    if (e.which > 31 && (e.which < 37 || e.which > 40)   && (e.which < 46 || e.which > 57) && (e.which < 96 || e.which > 105)) {
      return false;
    }
    var text = $(this).val();
    if(text.length <= 2){
      if(text.indexOf('/')!= -1){
        $(this).val(text.replace("/", ""));
      }
    }
    if($(this).val().length == 2 && e.which != 8 && e.which != 46){
      var text = $(this).val().replace(/(\d\d)/, "$1/");
    }
    else{
      var text = $(this).val().replace(/(\d\d)(\d\d\d\d)/, "$1/$2");
    }
    $(this).val(text);
    theme_custom.expiryDateValidation($(this));
  });

  $(".cvv-validate").bind("keypress keyup keydown", function (e) {
    if (e.which > 31 && (e.which < 37 || e.which > 40)   && (e.which < 46 || e.which > 57) && (e.which < 96 || e.which > 105)) {
      return false;
    }
    var text = $(this).val().replace(/(\d\d\d)/, "$1");
    $(this).val(text);
    theme_custom.cvvValidation($(this));
  });

};
//theme_custom.emailValidation
theme_custom.emailValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == '') {
    if ($(".template-page-fit-finder").length > 0) {
      $(".save-fit-finder-with-email").addClass("disabled");
    }
    parent.find('.form-error').text('This field is required').addClass("active");
    var count = 1;
  } else {
    function ValidateEmail(email) {
      var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return expr.test(email);
    };
    if (!ValidateEmail($this.val())) {
      if ($(".template-page-fit-finder").length > 0) {
        $(".save-fit-finder-with-email").addClass("disabled");
      }
      parent.find('.form-error').text('Please enter valid email').addClass("active");
      var count = 1;
    } else {
      if ($(".template-page-fit-finder").length > 0) {
        $(".save-fit-finder-with-email").removeClass("disabled");
      }
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
// theme_custom.spacial char using text 
theme_custom.textValidationWithSpacialChar = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  var regex = new RegExp(`[A-Za-z0-9\'\s\.\,\!\ ]+$`);
  // var regex = new RegExp(`^[a-zA-Z0-9]*$`);
  var str = $this.val();
  if ($this.val() == "" || $.trim($this.val()) == '') {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else {
    if (regex.test(str)) {
      parent.find(".form-error").text('Please enter Valid name ').removeClass("active");
    } else {
      parent.find(".form-error").text('Please enter Valid name ').addClass("active");
      count = 1;
    }
  }
  return count;
}
// theme_custom.nameValidation
theme_custom.nameValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  var regex = new RegExp("^[a-zA-Z\-\ \]+$");
  var str = $this.val();
  if ($this.val() == "" || $.trim($this.val()) == '') {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else if ($this.length > 0) {
    if ($this.val().length > 49) {
      if ($this.val().length > 49) {
        parent.find(".form-error").text('This is too long (maximum is 50 characters)').addClass("active");
        count = 1;
      } else {
        parent.find(".form-error").text('This is too long (maximum is 50 characters)').removeClass("active");
      }
    } else {
      parent.find(".form-error").text('This is too long (maximum is 50 characters)').removeClass("active");
      if (regex.test(str)) {
        parent.find(".form-error").text('Please enter only letters and dashes').removeClass("active");
      } else {
        if ($(".template-page-contact").length > 0 || $(".template-customers-register").length > 0) {
          parent.find(".form-error").text('Please enter only characters').addClass("active");
        } else {
          parent.find(".form-error").text('Please enter only letters and dashes').addClass("active");
        }
        count = 1;
      }
    }
  } else {
    parent.find(".form-error").removeClass("active");
  }
  return count;
}
// textare validation
theme_custom.textareaValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == '') {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else if ($this.length > 0) {
    if ($this.val().length > 249) {
      if ($this.val().length > 249) {
        parent.find(".form-error").text('This is too long (maximum is 250 characters)').addClass("active");
        count = 1;
      } else {
        parent.find(".form-error").text('This is too long (maximum is 250 characters)').removeClass("active");
      }
    } else {
      parent.find(".form-error").text('This is too long (maximum is 250 characters)').removeClass("active");
    }
  } else {
    parent.find(".form-error").removeClass("active");
  }
  return count;
}

// theme_custom.zipValidation
theme_custom.zipValidation = function($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  var numbers = /^[A-Za-z0-9_]+$/;
  let targetEl = $this.val().length;
  if ($this.val() == "" || $.trim($this.val()) == '') {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  }
  else if ($this.length > 0) {
    if (!$this.val().match(numbers)) {
      parent.find('.form-error').text('Please Enter valid Zipcode').addClass("active");
      count = 1;
    } else {
      if (targetEl < 3) {
        parent.find(".form-error").text('Please Enter minimum 3 characters').addClass("active");
        count = 1;
      } else if (targetEl > 8) {
        parent.find(".form-error").text('Please Enter maximum 8 characters').addClass("active");
        count = 1;
      } else {
        parent.find(".form-error").removeClass("active");
      }
    }
  }
  else {
    parent.find(".form-error").removeClass("active");
  }
  return count;
}

// event reminder title all reminder popup and create event validation
theme_custom.eventReminderTitleValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == "" || $.trim($this.val()) == '') {
    parent.find('.form-error').text('This field is required').addClass("active");
    count = 1;
  } else if ($this.length > 0) {
    if ($this.val().length > 99) {
      if ($this.val().length > 99) {
        parent.find(".form-error").text('This is too long (maximum is 100 characters)').addClass("active");
        count = 1;
      } else {
        parent.find(".form-error").text('This is too long (maximum is 100 characters)').removeClass("active");
      }
    } else {
      parent.find(".form-error").text('This is too long (maximum is 100 characters)').removeClass("active");
    }
  } else {
    parent.find(".form-error").removeClass("active");
  }
  return count;
}

// theme_custom.phoneValidation
theme_custom.phoneValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  let targetEl = $this.val().length;
  var numbers = /^[0-9]+$/  ;
  var thisValue = $this.val().replace(' ','').replace(')','').replace('(','').replace('-','');
  var thisValueLength = thisValue.length;
  // var numbers = /^\(?([0-9]{3})\)?[\s. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  if (targetEl == 0) {
    parent.find(".form-error").text('This field is required').addClass("active");
    count = 1;
  } else {
    if ($this.val() != "") {
      if (!thisValue.match(numbers)) {
        parent.find(".form-error").text('Please enter only number').addClass("active");
        count = 1;
      } else {
        if (thisValueLength <= 9) {
          parent.find(".form-error").text('Please enter minimum 10 number').addClass("active");
          count = 1;
        } 
        // else if (targetEl >= 14) {
        //   parent.find(".form-error").text('Please enter maximum 14 number').addClass("active");
        //   count = 1;
        // } 
        else {
          parent.find(".form-error").removeClass("active");
        }
      }
    }
  }
  return count;
}

// theme_custom.countryValidation
theme_custom.countryValidation = function($this){
  var count = 0;
  var parent = $this.closest(".form-wrap");
  if ($this.val() == '') {
    parent.find(".form-error").text('Please select value').addClass("active");
    count = 1;
  }else{
    parent.find(".form-error").removeClass("active");
  }
  return count;
}


theme_custom.cardNumberValidation = function ($this) {
  var count = 0;
  var parent = $this.closest(".form-wrap");
  let targetEl = $this.val().length;
  var numbers = /^[0-9]+$/  ;
  // var numbers = /^\(?[0-9]{4}\)?[\s. ]?[0-9]{4}[\s. ]?[0-9]{4}?[\s. ]?[0-9]{4}$/;
  var thisValue = $this.val().replaceAll(' ','');
  var thisValueLength = thisValue.length;
  if (targetEl == 0) {
    parent.find(".form-error").text('This field is required').addClass("active");
    count = 1;
  } else {
    if ($this.val() != "") {
      if (!thisValue.match(numbers)) {
        parent.find(".form-error").text('Please enter only number').addClass("active");
        count = 1;
      } else {
        if (thisValueLength <= 15) {
          parent.find(".form-error").text('Please enter minimum 16 number').addClass("active");
          count = 1;
        } 
        else {
          parent.find(".form-error").removeClass("active");
        }
      }
    }
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
    } else {
      return true;
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
    } else {
      ga('send', 'event', 'Account Creation', 'OnClick', 'New Account', '1');
      return true;
    }
  });
  $('#recovery-form-login').submit(function (e) {
    var error_count = 0;
    error_count = error_count + theme_custom.emailValidation($(this).find('#RecoverEmail'));
    if (error_count > 0) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  });
  $('#ContactForm').submit(function (e) {
    var error_count = 0;
    error_count = error_count + theme_custom.nameValidation($(this).find('[name="contact[Name]"]'));
    error_count = error_count + theme_custom.emailValidation($(this).find('[name="contact[email]"]'));
    error_count = error_count + theme_custom.phoneValidation($(this).find('[name="contact[phone]"]'));
    error_count = error_count + theme_custom.fieldValidation($(this).find('[name="contact[Comment]"]'));

    if (error_count > 0) {
      return false;
    } else {
      return true;
    }
  });
  $(document).on("click", '#footer_newsletter_signup', function (e) {
    var error_count = 0;
    error_count = error_count + theme_custom.emailValidation($(this).find('[name="contact[email]"]'));
    if (error_count > 0) {
      return false;
    } else {
      initForm();
    }
  });
}
// theme_custom.clickEvent
theme_custom.clickEvent = function () {

  $('[data-fancybox]').fancybox({
    afterLoad: function(instance, current) {
      // Add CSS to hide the scrollbar when the modal is open
      $('html').css('overflow', 'hidden');
      $('body').bind('touchmove', function(e) {e.preventDefault()});
    },
    beforeClose: function(instance, current) {
      // Remove the CSS to show the scrollbar when the modal is closed
      $('html').css('overflow', 'auto');
      $('body').unbind('touchmove');
    }
  });

  $(document).on("click", ".black-bg",function(){
    $(".header__icon--menu").click() 
  });
  
  // Top look fav and event click on user has not logged 
  $(document).on("click",".event-or-fav-when-user-has-not-logged", function(){
    localStorage.setItem("event-or-fav-when-user-has-not-logged","true");
    localStorage.setItem("previous-page-link","true");
    localStorage.setItem("page-link",window.location.href);
    window.location.href = $(this).attr("data-href");
  }); 

  // create-event-header-button 
  $(document).on("click",".create-event-header-button", function(){
    if(localStorage.getItem("set-event-id")!= null){
      localStorage.removeItem("set-event-id");
    }
    var buttonLink = $(this).data("href");
    window.location.href = buttonLink;
  }) 

  // event page 
  $(document).on("click", "#eventevent-type .Squer-radio-button-inner, #eventupdate-event-type .Squer-radio-button-inner ", function () {
    var selectEventType = $(this).find(`[name="event-type"]`).val();
    selectEventType = selectEventType.toLowerCase();
    $("#shopify-section-event-role .Squer-radio-button-inner, #shopify-section-update-event-role .Squer-radio-button-inner").addClass("hidden");
    $(`#shopify-section-event-role .Squer-radio-button-inner[data-class="${selectEventType}"], #shopify-section-update-event-role .Squer-radio-button-inner[data-class="${selectEventType}"]`).removeClass("hidden");
  })
  // Icon text 
  $(document).on('click', '.tooltip-main .information', function () {
    $(this).siblings('.information_content').toggle();
  });
  window.onclick = function (event) {
    if (!$(event.target).closest('.tooltip-main').length > 0) {
      $('.information_content').hide();
    }
  }

  //accordion for question-answer-section
  $('.question-heading').click(function (e) {
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
  $(document).on('click', '.btnshow', function () {
    $(this).addClass('displaynone');
    show_url = $('.load-more').attr('href');
    $.ajax({
      type: 'GET',
      url: show_url,
      success: function (data) {
        var ul_data = $(data).find("div.blog-articles").slideToggle("slow").html();
        $('div.blog-articles').append(ul_data);
        var total_data = $('div.blog-articles div.blog-articles__article').length;
        $('div.blog-counter span').text(total_data);
        var page_number = $(data).find('ul.pagination__list').html();
        $('ul.pagination__list').html(page_number);
      }
    });
  });

  //filter-dropdown-blogpage
  $(".blog-filter-label").on("click", function () {
    $(this).toggleClass("selected");
    $(this).next(".filter-tag").toggle();
  });
  var allOptions = $(".filter-tag");
  $(".filter-tag").on("click", "li", function () {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $(".blog-filter-label").html($(this).html());
    allOptions.toggle();
  });

  //video play on how to work page
  $('.play').click(function () {
    if ($(this).siblings('.video').get(0).paused) {
      $(this).siblings('.video').get(0).play();
      $(this).siblings('.video').addClass('pause');
    } else {
      $(this).siblings('.video').get(0).pause();
      $(this).siblings('.video').removeClass('pause')
    }
  });

  //  Create Event page click event start
  const api_url = theme_custom.api_base_url;
  $("#addpersonbutton").click(function () {
    $("#personForm-FirstName, #personForm-LastName, #personForm-email, #personForm-telephone").val('');
    $(".form-error").text('').hide();
    if ($('.custom-checkobx input:radio:checked')) {
      $('.custom-checkobx input:radio:checked').prop("checked", false);
    }
    $(".person_form_wrap").toggle();
    $(".add-person-button .button-down-arrow").toggle();
    $('.create-event-error').removeClass('active');
  });
  $("#cancel_person").click(function (e) {
    e.preventDefault();
    $(".person_form_wrap").hide();
    $(".add-person-button .button-down-arrow").hide();
  });
  $("button#saveperson").click(function (e) {
    $('.create-event-error').removeClass('active');
    e.preventDefault();
    var parent = $(this).closest('.person_form_wrap');
    var error_count = 0;
    error_count = error_count + theme_custom.nameValidation(parent.find('#personForm-FirstName'));
    error_count = error_count + theme_custom.nameValidation(parent.find('#personForm-LastName'));
    error_count = error_count + theme_custom.emailValidation(parent.find('#personForm-email'));
    error_count = error_count + theme_custom.phoneValidation(parent.find('#personForm-telephone'));
    if ($(".custom_checkbox input:radio:checked").length > 0) {
      $(".custom-checkobx").find(".form-error").text('').hide();
    } else {
      $(".custom-checkobx").find(".form-error").text("please select payment option required*").show();
      error_count = error_count + 1;
    }
    if (error_count == 0) {
      var personFormFirstName = $("#personForm-FirstName").val();
      var personFormLastName = $("#personForm-LastName").val();
      var personFormEmail = $("#personForm-email").val();
      var personFormtelephone = $("#personForm-telephone").val();
      var radio_val = $(".field.form-wrap.custom-checkobx span.custom_checkbox input[type=radio]:checked").val();
      var data_radio_val = $(".field.form-wrap.custom-checkobx span.custom_checkbox input[type=radio]:checked").data('val');
      var html = '';
      html = '<div class="blockemail_wrap"><a class="block_icontext_link click_here" href="javascript"><div class="icontext_icon_image "> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><style type="text/css">.pencil-icon{fill:#0776BD;}.pencil-icon1{fill:none;stroke:#0776BD;stroke-miterlimit:10;}</style><g><g> <path class="pencil-icon" d="M16.8,2.1l1.7,0.2l1.8,2l-0.2,1.9L5.7,19.7l-3.8-0.2L2,16L16.8,2.1 M16.4,1.1L1,15.5l-0.2,4.9L6,20.7l15-14 l0.3-2.8L19,1.3L16.4,1.1L16.4,1.1z"></path></g><line class="pencil-icon1" x1="8.1" y1="18.4" x2="3.6" y2="13.4"></line><line class="pencil-icon1" x1="18" y1="9.3" x2="13.5" y2="4.3"></line></g></svg></div></a>';
      html += '<div class="text_email_wrap">';
      html += '<h2 class="icontext_title h4">' + ' <span class="first_name_field" > ' + personFormFirstName + '</span>' + '<span class="last_name_field">' + personFormLastName + '</span></h2>';
      html += '<span class="people_email_wrap">' + personFormEmail + '</span><br>';
      html += '<div><span class="telephone">' + personFormtelephone + '</span></div>';
      html += '<span class="pay_text">' + radio_val + '</span>';
      html += '<input type="hidden" class="first_name" value="' + personFormFirstName + '">';
      html += '<input type="hidden" class="last_name" value="' + personFormLastName + '">';
      html += '<input type="hidden" class="email" value="' + personFormEmail + '">';
      html += '<input type="hidden" class="phone_no" value="' + personFormtelephone + '">';
      html += '<input type="hidden" class="pay_value" value="' + radio_val + '" data-value = "' + data_radio_val + '">';
      html += '</div></div>';
      $('.blockicontext_loop').append(html);
      var blockwrap = document.getElementsByClassName("blockemail_wrap");
      for (var i = 0; i < blockwrap.length; i++) {
        var blockwraps = blockwrap[i];
        blockwraps.setAttribute("id", "blockpeople" + i + 1);
      }
      $("#personForm-FirstName, #personForm-LastName, #personForm-email, #personForm-telephone").val('');
      if ($('.custom-checkobx input:radio:checked')) {
        $('.custom-checkobx input:radio:checked').prop("checked", false);
      }
      $("#addpersonbutton").click();
    }
  });
  $(document).on('click', 'a.click_here', function (e) {
    e.preventDefault();
    var parent = $(this).parent().attr('id');
    var first_name = $(this).parent('.blockemail_wrap').find('.text_email_wrap .first_name').val();
    var last_name = $(this).parent('.blockemail_wrap').find('.text_email_wrap .last_name').val();
    var email = $(this).parent('.blockemail_wrap').find(' .text_email_wrap .email').val();
    var phone_no = $(this).parent('.blockemail_wrap').find('.text_email_wrap .phone_no').val();
    var pay_value = $(this).parent('.blockemail_wrap').find('.text_email_wrap .pay_value').attr('data-value');
    $(".custom-model-main").find('.pop_firstname').val(first_name);
    $(".custom-model-main").find('.pop_lastname').val(last_name);
    $(".custom-model-main").find('.pop_email').val(email);
    $(".custom-model-main").find('.pop_phone').val(phone_no);
    if (pay_value == 1) {
      $(".custom-model-main").find('.cst_check_box #yess').prop("checked", true);
    } else {
      $(".custom-model-main").find('.cst_check_box #Noo').prop("checked", true);
    }
    $(".custom-model-main").find('#parent_id').val(parent);
    $('body').addClass("body_fixed");
    $(".custom-model-main").addClass('model-open');
  });
  $("#popsave").click(function (e) {
    $('.form-error').removeClass('active');
    e.preventDefault();
    var parent = $(this).closest('.custom-model-inner');
    var error_count = 0;
    error_count = error_count + theme_custom.nameValidation(parent.find('.pop_firstname'));
    error_count = error_count + theme_custom.nameValidation(parent.find('.pop_lastname'));
    error_count = error_count + theme_custom.emailValidation(parent.find('.pop_email'));
    if (error_count == 0) {
      var savefirstname = $(".pop_firstname").val();
      var savelastname = $(".pop_lastname").val();
      var saveemail = $(".pop_email").val();
      var savephone = $(".pop_phone").val();
      var radio_valss = $(".field.form-wrap.custom-checkobx span.cst_check_box input[type=radio]:checked").val();
      var idval = $(this).parent('.pop-up-content-wrap').find('#parent_id').val();
      var data_radio_val = $(".field.form-wrap.custom-checkobx span.cst_check_box input[type=radio]:checked").data('radioval');
      $("#" + idval).find(".first_name_field").text(savefirstname);
      $("#" + idval).find(".last_name_field").text(savelastname);
      $("#" + idval).find(".people_email_wrap").text(saveemail);
      $("#" + idval).find(".telephone").text(savephone);
      $("#" + idval).find(".pay_text").text(radio_valss);
      $("#" + idval).find(".first_name").val(savefirstname);
      $("#" + idval).find(".last_name").val(savelastname);
      $("#" + idval).find(".email").val(saveemail);
      $("#" + idval).find(".phone_no").val(savephone);
      $("#" + idval).find(".pay_value").val(radio_valss);
      $("#" + idval).find(".pay_value").attr('data-value', data_radio_val);
      $('body').removeClass("body_fixed");
      $(".custom-model-main").removeClass('model-open');
    }
  });
  $(".close-btn, .bg-overlay ").click(function () {
    $('body').removeClass("body_fixed");
    $(".custom-model-main").removeClass('model-open');
    $(".payment-confirmation-popup").removeClass('model-open'); 
    $('.fancybox-container').removeClass('hidden');
  });
  //  Create Event page click event end

  // Logout button click event start
  $(document).on("click", ".account-logout-btn", function () {
    $.ajax({
      type: "POST",
      url: '/cart/clear.js',
      success: function () {
        setTimeout(() => {
          setCookie("fit-finder-data", '');
          theme_custom.removeLocalStorage(); 
          window.location.href = '/account/logout';
        }, 100);
      },
      dataType: 'json'
    });
  })
  // Logout button click event end

  // Edit size button start
  $(document).on("click", ".edit-size-button", function () {
    localStorage.setItem("edit-fit-finder", "true");
    window.location.href = "/pages/fit-finder"
  });
  // Edit size button end

  // update profile image popup start
  $(document).on("click", ".update-profile-image-button", function () {
    var that = $(this);
    theme_custom.updateProfileImage(that);
  })
  // update profile image popup end

  // start create event click event start
  $(document).on('click', '.create_event_btn', function (e) {
    e.preventDefault();
    var parent = $(this).closest('#creatEventWrap');
    var name = '',
      event_type_id = '',
      event_date = $('#eventDate').val(),
      event_role_id = '',
      data = '',
      error_count = 0
    button = $(this);
    // error_count = error_count + theme_custom.textValidationWithSpacialChar(parent.find('#EventForm-EventName'));
    error_count = error_count +  theme_custom.eventReminderTitleValidation(parent.find('.custom-event-reminder-name'));
    if (error_count > 0) {
      $('html, body').animate({
        scrollTop: $('.event-name_container').offset().top - 120
      }, 1000);
      return false; 
    } else {
      name = parent.find('#EventForm-EventName').val();
    }
    if ($('[name="event-type"]:checked').length > 0) {
      event_type_id = parent.find('[name="event-type"]:checked').attr('data-event_type_id');
    } else {
      $('#eventevent-type .event-type_section_wrap .event-type-error').addClass('active');
      $('html, body').animate({
        scrollTop: $('#eventevent-type').offset().top - 120
      }, 1000);
      return false;
    }
    if ($('.Squer-radio-button-inner:not(.hidden) [name="event_role"]:checked').length > 0) {
      event_role_id = parent.find('[name="event_role"]:checked').attr('data-event_role_id');
    } else {
      $('#eventevent-role .event-role_section_wrap .event-role-error').addClass('active');
      $('html, body').animate({
        scrollTop: $('#eventevent-role').offset().top - 120
      }, 1000);
      return false;
    }
    // if ($('.blockemail_wrap').length == 0) {
    //   $('.api_error.create-event-error').text("Please add at least one member.").addClass('active');
    //   return false;
    // }
    if (error_count == 0) {
      var event_name = $('#EventForm-EventName').val();
      var event_type = $('[name="event-type"]:checked').data('event_type_id');
      var event_date = $('#eventDate').val();
      var event_role = $('[name="event_role"]:checked').data('event_role_id');
      var member_people = $('.blockemail_wrap');
      var event_owner_number = $('.event_owner_number').val().replace('(','').replace(' ','').replace(')','').replace('-','');
      var members = [];
      theme_custom.emailArr = [];
      for (var i = 0; i < member_people.length; i++) {
        var first_name = $(member_people[i]).find('.first_name').val();
        var last_name = $(member_people[i]).find('.last_name').val();
        var email = $(member_people[i]).find('.email').val();
        var phone_no = $(member_people[i]).find('.phone_no').val().replace('(','').replace(' ','').replace(')','').replace('-','');
        var pay_value = $(member_people[i]).find('.pay_value').data('value');
        var member_obj = {
          "first_name": first_name,
          "last_name": last_name,
          "email": email,
          "phone": phone_no,
          "is_host_paying": pay_value
        };
        theme_custom.emailArr.push(email);
        members.push(member_obj);
      }
      var event_data = {
        "name": event_name,
        "event_type_id": event_type,
        "event_date": event_date,
        "event_role_id": event_role,
        "owner_phone_number":event_owner_number,
        "members": members
      }
      $(this).addClass("disable");
      $.ajax({
        url: `${theme_custom.base_url}/api/event/create`,
        method: "POST",
        data: event_data,
        dataType: "json",
        headers: {
          "Authorization": 'Bearer ' + localStorage.getItem("customerToken")
        },
        beforeSend: function () {
          $(this).addClass("disable");
        },
        success: function (result) {
          if (result.success) {
            $('.api_error').addClass("success-event").show().html(result.message);
            setTimeout(function () {
              button.removeClass("disable");
              window.location.href = '/account';
            }, 1500)
          } else {
            $('.api_error').show().html(`${xhr.responseJSON.data.event_date[i]}`);
            setTimeout(function () {
              $('.api_error').fadeOut();
              button.removeClass("disable");
            }, 10000);
          }
        },
        error: function (xhr, status, error) {
          button.removeClass("disable");
          if (xhr.responseJSON.message == 'Token is invalid or expired.') {
            $('.api_error').show().html('Something went wrong <a class="try-again-link" href="/account/login">Please try again</a>').css({
              'text-align': 'center',
              'color': 'red'
            });
            setTimeout(() => {
              theme_custom.removeLocalStorage();
              window.location.href = '/account/logout';
            }, 5000);
          } else {
            var event_date_msg = '';
            if (xhr.responseJSON.data) {
              if (xhr.responseJSON.data.event_date != undefined) {
                for (let i = 0; i < xhr.responseJSON.data.event_date.length; i++) {
                  event_date_msg += `<span>${xhr.responseJSON.data.event_date[i]}</span>`;
                }
              } else {
                if(xhr.responseJSON.data.length > 0){
                  for (let i = 0; i < xhr.responseJSON.data.length; i++) {
                    var errorMsg = xhr.responseJSON.data[i];
                    var membererror = '';
                    $.each(errorMsg, function (key, value) {
                      membererror += `<p><b style="text-transform: uppercase;">${key}</b>: ${value}</p>`;
                    })
                    event_date_msg += `<div>${membererror}</div>`;
                  }
                } else {
                  for (let i = 0; i < xhr.responseJSON.data.members.length; i++) {
                    event_date_msg += `<span>${xhr.responseJSON.data.members[i]}</span>`;
                  }
                }
              }
            } else {
              event_date_msg += `<span>${xhr.responseJSON.message}</span>`;
            }
            $('.api_error').show().html(event_date_msg);
            setTimeout(function () {
              $('.api_error').fadeOut();
              button.removeClass("disable");
            }, 10000);
          }
        }
      });
    }
  });
  // end create event click event end
}
// theme_custom.changeEvent
theme_custom.changeEvent = function () {
  $(".beforeafterinput").on("input change", (e) => {
    var sliderPos = e.target.value;
    // Update the width of the foreground image
    $('.beforeafter_agterimage').css('width', `calc(${sliderPos}% - 5px)`)
    // Update the position of the slider button
    $('.beforeslider-button').css('left', `calc(${sliderPos}% - 21px)`)
  });

  $('input[type=radio][name=is_host_paying]').change(function () {
    $(this).closest(".custom-checkobx").find(".form-error").hide();
    if($(this).closest(".custom-checkobx").find('[value="I Pay"]').prop('checked')){
      $(".payment-confirmation-popup").addClass('model-open');
      $('body').addClass("body_fixed");
      // $.fancybox.close();
      $('.fancybox-container').addClass('hidden');
    }
  });

  $('input[type=radio][name=is_host_paying_update]').change(function () {
    $(this).closest(".custom-checkobx").find(".form-error").hide();
    if($(this).closest(".custom-checkobx").find('[value="I Pay"]').prop('checked')){
      $(".payment-confirmation-popup").addClass('model-open');
      $('body').addClass("body_fixed");
      // $.fancybox.close();
      $('.fancybox-container').addClass('hidden');
    }
  });

  $(document).on('click', '.payment-confirm-btn-main #i-pay', function (e) {
    $('.fancybox-container').removeClass('hidden');
    $(".payment-confirmation-popup").removeClass('model-open');
    $('body').removeClass("body_fixed");
    if($('[data-target="update-guest-popup"]').hasClass('active')){
      $("[data-target='update-guest-popup'] .invite-another-member-popup-wrapper").find(`input[name='is_host_paying_update'][value="I Pay"]`).prop('checked', true);
      $("[data-target='update-guest-popup'] .event-person-form_section_wrap .person_form_wrap").find(`input[name='is_host_paying_update'][value="I Pay"]`).prop('checked', true);
    }else{
      $(".invite-another-member-popup-wrapper").find(`input[name='is_host_paying'][value="I Pay"]`).prop('checked', true);
      $(".event-person-form_section_wrap .person_form_wrap").find(`input[name='is_host_paying'][value="I Pay"]`).prop('checked', true);
    }
    
  });

  $(document).on('click', '.payment-confirm-btn-main #they-pay', function (e) {
    $('.fancybox-container').removeClass('hidden');
    $(".payment-confirmation-popup").removeClass('model-open');
    $('body').removeClass("body_fixed");
    if($('[data-target="update-guest-popup"]').hasClass('active')){
      $("[data-target='update-guest-popup'] .invite-another-member-popup-wrapper").find(`input[name='is_host_paying_update'][value="They Pay"]`).prop('checked', true);
      $("[data-target='update-guest-popup'] .event-person-form_section_wrap .person_form_wrap").find(`input[name='is_host_paying_update'][value="They Pay"]`).prop('checked', true);
    }else{
      $(".invite-another-member-popup-wrapper").find(`input[name='is_host_paying'][value="They Pay"]`).prop('checked', true);
      $(".event-person-form_section_wrap .person_form_wrap").find(`input[name='is_host_paying'][value="They Pay"]`).prop('checked', true);
    }
  });
  $(document).on("change", "#imageUpload", function () {
    theme_custom.previewImage(this);
  });

  // imageUpload change 
  $("#imageUpload").change(function () {
    var input = $(this);
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
        $('#imagePreview').attr("data-src", e.target.result)
      }
      reader.readAsDataURL(input.files[0]);
    }
  });

  // start event-type change event
  $(document).on('change', 'input[name="event-type"]', function () {
    $('#eventevent-type .event-type_section_wrap .event-type-error').removeClass('active');
  });
  // end event-type change event

  // start event-role change event
  $(document).on('change', 'input[name="event_role"]', function () {
    $('#eventevent-role .event-role_section_wrap .event-role-error').removeClass('active');
  });
  // end event-role change event

  // edit product Popup
  if (($(".template-cart").length > 0 && $(".edit-item-popup").length > 0)) {
    $(document).on('change', '.swatch-wrap .swatch-element input[type="radio"]', function () {
      var selectedVal = $(this).closest(".swatch").data("s_value").toLocaleLowerCase();
      var currentSelectOption = $(this).data("value");
      if (currentSelectOption == selectedVal) {
        $(this).closest(".edit-item-popup").find(".error-message").removeClass(`error-show`).text('');
        $(this).closest(".edit-item-popup").find(".updates-button, .pdp-updates-button").addClass("disabled");
      } else {
        $(this).closest(".edit-item-popup").find(".error-message").removeClass(`error-show`).text('');
        $(this).closest(".edit-item-popup").find(".updates-button, .pdp-updates-button").removeClass("disabled");
      }
    });
  }
  // end event-role change event
}
// theme_custom.previewImage
theme_custom.previewImage = function (input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
      $('#imagePreview').attr("image-preview", e.target.result);
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }
    reader.readAsDataURL(input.files[0]);
    $(".update-profile-image-button").removeClass("disabled");
  }
}
function formToJSON(elements) {
  return [].reduce.call(elements, function (data, element) {
    data[element.name] = element.value;
    return data;
  }, {});
}

function getUrlString(data) {
  var urlParameters = Object.entries(data).map(function (e) {
    return e.join('=');
  }).join('&');

  return urlParameters;
}

function initForm() {
  var action = $(".footer_newsletter_signup").attr("action"),
    inputs = $(".form-value");
  fetch(action, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: getUrlString(formToJSON(inputs))
  }).then(function (response) {
    $("#footer_newsletter_signup .form-wrapper").addClass("hidden");
    $("#footer_newsletter_signup .newsletter-form__message.newsletter-form__message--success").addClass("show");
  }).catch(function (error) {
    $("#footer_newsletter_signup .newsletter-form__message.form__message").removeClass("hidden");
  });
}

// theme_custom.init
theme_custom.init = function () {
  theme_custom.formValidation();
  theme_custom.submitEvent();
  theme_custom.clickEvent();
  theme_custom.changeEvent();
  theme_custom.loadEvent();
  theme_custom.featureLooksSlider();
  theme_custom.IconWithTextSlider();
  theme_custom.themeSlider();
  $(window).resize(function () {
    theme_custom.IconWithTextSlider();
  });
}
// dom ready 
$(document).ready(function () {
  theme_custom.init();
  $(`[type="text"],[type="number"],[type="password"],[type="tel"],textarea`).bind('keydown', function (e) {
    if (this.value.length === 0 && e.which === 32) e.preventDefault();
  });
  if ($(".template-index").length > 0) {
    localStorage.removeItem("customizerlookUrl");
    localStorage.removeItem("customizerlookFrom");
    localStorage.removeItem("edit-fit-finder")
  }
  if ($(".template-page-customize-your-look").length > 0) {
    localStorage.removeItem("customizerlookPageFitFinder");
  }
  if ($(".template-product-jacket-pant-combination, .template-product-top-looks-pdp").length > 0) {
    localStorage.removeItem("previous-page-link");
  }
  if (localStorage.getItem("customizerlookPageLogin")) {
    window.location.href = '/pages/customize-your-look';
    localStorage.setItem("customizerlookPageLogin", "true");
  }
  if (localStorage.getItem("page-link") && $(".template-index").length > 0) {
    localStorage.removeItem("page-link");
  }
  if (localStorage.getItem("hosted-by") && $(".template-index").length > 0) {
    localStorage.removeItem("hosted-by");
  }
});
document.addEventListener('readystatechange', event => {
  if (event.target.readyState === "complete") {
    // setTimeout(() => {
    //   $(".page-main-loader").addClass("hidden");
    //   $("html,body").css({
    //     "overflow" : ""
    //   })
    // }, 1000);
    if ($(".template-customers-login").length > 0) {
      var loginPageFormSubmit = setInterval(function () {
        if ($("#customer_login[onsubmit]").length > 0) {
          $("#customer_login").removeAttr("onsubmit");
          $(".btn").removeClass("disable");
          clearInterval(loginPageFormSubmit);
        }
      }, 100);
      var loginPageFormSubmitRecover = setInterval(function () {
        if ($("[action='/account/recover'][onsubmit]").length > 0) {
          $("[action='/account/recover']").removeAttr("onsubmit");
          $(".btn").removeClass("disable");
          clearInterval(loginPageFormSubmitRecover);
        }
      }, 100);
    }
    if ($(".template-customers-register").length > 0) {
      var loginPageFormSubmit = setInterval(function () {
        if ($("#create_customer[onsubmit]").length > 0) {
          $("#create_customer").removeAttr("onsubmit");
          $(".btn").removeClass("disable");
          clearInterval(loginPageFormSubmit);
        }
      }, 100);
    }
    if ($(".template-page-contact").length > 0) {
      var contactpageonsubmit = setInterval(function () {
        if ($("#ContactForm[onsubmit]").length > 0) {
          $("#ContactForm").removeAttr("onsubmit");
          $(".btn").removeClass("disable");
          clearInterval(contactpageonsubmit);
        }
      }, 100);
      setTimeout(function () { $('.form-status-list').css('display', 'none'); }, 10000);
    }
  }
});


$(document).on('change', '.swatch-wrapper-options .swatch.swatch-wrap select', function () {
    var select_value = $(this).find('option:selected').val();
    $(this).closest('.swatch.swatch-wrap').find('.swatch-product-wrapper.swatch-element').each(function () {
        var this_value = $(this).data('value');
        if(select_value == this_value){
            $(this).find('input').trigger('click');
              $(this).closest('.edit-item-popup').find('.pdp-updates-button').trigger('click');
        }
    })
});

$(document).on('change', 'variant-selects select.select__select', function () {
  var select_name = $(this).closest(".product-form__input--dropdown").attr('data-option');
  var select_value = $(this).val();
  $(`input[name="${select_name}"][value="${select_value}"]`).prop('checked', true);
});

// Upsell product Add item 
$(document).on("click",".upsell-product-add",function(e){
  e.preventDefault();
  var button = $(this);
  button.addClass("disabled").find(".btn-title").text(button.find(".btn-title").attr("data-text"));
  var data = {
    "id": button.closest(".product-item").find(".product-var-id").val(),
    "quantity": 1,
  }
  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: data,
    dataType: 'json',
    success: function() {
      setTimeout(() => {
        button.addClass("disabled").find(".btn-title").text("ADDED");
      }, 1000);
    },
    error: function(xhr, status, error) {
      button.closest(".product-info-wrapper").append(`<p class="error-message error-show">${xhr.responseJSON.description}</p>`);
      setTimeout(() => {
        button.closest(".product-info-wrapper").find(".error-message").remove();
        button.removeClass("disabled").find(".btn-title").text("ADD");
      }, 1000);
    }
  });
})

// Upsell Product Popup close and page reload 
$(document).on("click",".product-upsell-wrapper .close-icon",function(){
  $(".product-upsell-wrapper").removeClass("show");
  $("html, body").css({
    "overflow" : ""
  });
  window.location.reload()
});

// Upsell Product Swatch changes 
$(document).on('change', `.upsell-product-items-wrapper input[type="radio"]`, function(){
  var optionValue = $(this).val();
  $(this).closest(".swatch-wrap").find(".option-value").text(optionValue);
  var parent = $(this).closest(".product-item");
  if(parent.find('[data-option-index="0"] input:checked').length > 0){
    variantTitle = parent.find('[data-option-index="0"] input:checked').val();
  }
  if(parent.find('[data-option-index="1"] input:checked').length > 0){
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
  }
  if(parent.find('[data-option-index="2"] input:checked').length > 0){
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
  }    
  var selectedVar = parent.find($(`.product-variant-option option[data-variant-title="${variantTitle}"]`)).val();
  var selectedVariantInventoryQuantity = parent.find($(`.product-variant-option option[data-variant-title="${variantTitle}"]`)).attr("data-variant-inventory-quantity");
  var selectedVariantInventoryPolicy = parent.find($(`.product-variant-option option[data-variant-title="${variantTitle}"]`)).attr("data-variant-inventory-policy");
  if(!selectedVar){
    parent.find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
    parent.find(".upsell-product-add").addClass("disabled");
  } else {
    var targetVariant = parent.find($(`.product-variant-option option[data-variant-title="${variantTitle}"]`))
    parent.closest(".product-item").find(".img img").attr("src",targetVariant.attr("data-variant-image"));
    if(selectedVariantInventoryPolicy == 'continue'){
      parent.find(".error-message").removeClass("error-show").text('');
      parent.find(".upsell-product-add").removeClass("disabled").find(".btn-title").text("ADD");
      parent.find(".product-var-id").val(selectedVar);
    } else {
      if(selectedVariantInventoryQuantity <= 0){
        parent.find(".error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
        parent.find(".upsell-product-add").addClass("disabled");
      } else {
        parent.find(".error-message").removeClass("error-show").text('');
        parent.find(".upsell-product-add").removeClass("disabled").find(".btn-title").text("ADD");
        parent.find(".product-var-id").val(selectedVar);
      }
    }
  }
});

$(".cart-page .header-bottom-link a.link").click(function(e){
  e.preventDefault();
  var target =  document.referrer;
  window.location.href = target ;
});

document.addEventListener("DOMContentLoaded", function() {
  $(`.image-with-text`).find(`.section-loader`).hide();
  $(`.image-with-text`).find(`.page-width-big`).show();
});

$(document).on("click", ".edit-item-custom-btn", function(){
  var target = $(this).closest(".product-block-wrap-suit-wrapper").find(".edit-item-popup");
  var option1 = $(this).closest(".product-block-wrap-suit-wrapper").find(".option-1").text().toLocaleLowerCase(),
      option2 = $(this).closest(".product-block-wrap-suit-wrapper").find(".option-2").text().toLocaleLowerCase(),
      option3 = $(this).closest(".product-block-wrap-suit-wrapper").find(".option-3").text().toLocaleLowerCase();
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

// Show the first 12 blocks
$('.wedding-gallery .multicolumn-list__item:lt(12)').removeClass('hidden');

// Handle click event for the load more button
$(document).on("click",'#load-more-btn',function() { 
  // Find the next set of hidden blocks
  var hiddenBlocks = $('.multicolumn-list__item.hidden:lt(12)');
  
  // Remove the 'hidden' class from the next set of blocks
  hiddenBlocks.removeClass('hidden');

  // If there are no more hidden blocks, hide the load more button
  if ($('.multicolumn-list__item.hidden').length === 0) {
    $(this).hide();
  }
});

// shoes collection page on Color Swatch Click event 
$(document).on("click",".main-collection-product-grid .swatch-title-color .swatch-element-item",function(){
  var variant_color = $(this).closest(`.swatch-element-item`).attr(`data-swatch-title`);
  var variant_size = $(`.swatch-title-size`).find(`.swatch-element-item:first`).attr(`data-swatch-title`);
  var selected_var = `${variant_color} / ${variant_size}`;
  var get_variant_id = $(this).closest(`.card-wrapper`).find(`.product-variant option[data-variant-title="${selected_var}"]`).attr(`data-variant-id`);
  var product_url = $(this).closest(`.card-wrapper`).find(`.full-unstyled-link`).attr("href");
  var variant_link = `${product_url}?variant=${get_variant_id}`;
  window.location.href = variant_link;
})

// frequently-bought-together
$(document).on("click", ".fbt-add-to-cart", function (e) {
  e.preventDefault();
  if($(`.checkbox.checked`).closest(`.upsell-product-wrap`).find(`.selecte-size-button[data-size-selected="select-size"]`).length > 0){
    $(`.checkbox.checked`).closest(`.upsell-product-wrap`).find(`.error-message`).show();
    return true;
  }
  if($(`.error-message.static`).length > 0){
    $(`.error-message.static`).addClass("undefined")
    return true;
  }
  var button = $(this);
  button.addClass(`disabled`).find(".btn-title").text(button.find(".btn-title").attr("data-text"));
  if ($(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.checkbox`).hasClass(`checked`) || $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.checkbox`).hasClass(`checked`)) {
    if($(`.parent-product.product-type-vest`).length > 0) {
      var jacket_selected_variant = $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option`).val();
      var jacket_selected_variant_title = $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option option[value="${jacket_selected_variant}"]`).attr("data-variant-title");

      var pant_selected_variant = $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.product-variant-option`).val();
      var pant_selected_variant_title = $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.product-variant-option option[value="${pant_selected_variant}"]`).attr("data-variant-title");
      var items = [
        {
          "id": $(`.upsell-product-wrap[data-product-type="vest"]`).find(`.product-variant-option`).val(),
          "quantity": 1
        }
      ];
      if($(`.upsell-product-wrapper .upsell-product-wrap[data-product-type="jacket"]`).find(".checkbox").hasClass("checked")) {
        var item = {
          "id": $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option`).val(),
          "quantity": 1,
          "properties": {
            "combo-variant-title" : jacket_selected_variant_title,
            "pant-variant-title" : pant_selected_variant_title
          }
        }
        items.push(item)
      }
      if($(`.upsell-product-wrapper .upsell-product-wrap[data-product-type="pants"]`).find(".checkbox").hasClass("checked")) {
        var item = {
          "id": $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.product-variant-option`).val(),
          "quantity": 1,
          "properties": {
            "combo-variant-title" : jacket_selected_variant_title,
            "pant-variant-title" : pant_selected_variant_title
          }
        }
        items.push(item)
      }
    } else {
      var productArray = $(`.upsell-product-wrapper .upsell-product-wrap`);
      var items = [];
      if($(`.parent-product.product-type-jacket`).length > 0){
        var selected_variant = $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option`).val();
        var selected_variant_title = $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option option[value="${selected_variant}"]`).attr("data-variant-title");
        if($(`.upsell-product-wrapper .upsell-product-wrap[data-product-type="pants"]`).find(".checkbox").hasClass("checked")) {
          var pant_selected_variant = $(`.upsell-product-wrapper .upsell-product-wrap`).find(`.product-variant-option`).val();
          var pant_selected_variant_title = $(`.upsell-product-wrapper .upsell-product-wrap`).find(`.product-variant-option option[value="${pant_selected_variant}"]`).attr("data-variant-title");
        }
        var item = {
          "id": $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option`).val(),
          "quantity": 1,
          "properties": {
            "combo-variant-title" : selected_variant_title,
            "pant-variant-title" : pant_selected_variant_title
          }
        };
        items.push(item);
      }
      if($(`.parent-product.product-type-pants`).length > 0) {
        var pant_selected_variant = $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.product-variant-option`).val();
        var pant_selected_variant_title = $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.product-variant-option option[value="${pant_selected_variant}"]`).attr("data-variant-title");
        if($(`.upsell-product-wrapper .upsell-product-wrap[data-product-type="jacket"]`).find(".checkbox").hasClass("checked")) {
          var selected_variant = $(`.upsell-product-wrapper .upsell-product-wrap`).find(`.product-variant-option`).val();
          var selected_variant_title = $(`.upsell-product-wrapper .upsell-product-wrap`).find(`.product-variant-option option[value="${selected_variant}"]`).attr("data-variant-title");
        }
        var item = {
            "id": $(`.upsell-product-wrap[data-product-type="pants"]`).find(`.product-variant-option`).val(),
            "quantity": 1,
            "properties": {
              "combo-variant-title" : selected_variant_title,
              "pant-variant-title" : pant_selected_variant_title
            }
          };
        items.push(item);
      }
      productArray.each(function(){
        if($(this).find(`.checkbox`).hasClass("checked")){
          if($(this).attr("data-product-type") == "pants") {
            item = {
              "id": $(this).closest(`.upsell-product-wrap`).find(`.product-variant-option`).val(),
              "quantity": 1,
              "properties": {
                "combo-variant-title" : selected_variant_title,
                "pant-variant-title" : pant_selected_variant_title
              }
            }
          } else if($(this).attr("data-product-type") == "jacket") {
            item = {
              "id": $(this).closest(`.upsell-product-wrap`).find(`.product-variant-option`).val(),
              "quantity": 1,
              "properties": {
                "combo-variant-title" : selected_variant_title,
                "pant-variant-title" : pant_selected_variant_title
              }
            }
          } else {
            item = {
              "id": $(this).closest(`.upsell-product-wrap`).find(`.product-variant-option`).val(),
              "quantity": 1
            }
          }
          items.push(item);
        }
      });
    }
    data = {
      items: items
    };
    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
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
  } else {
    var productArray = $(`.upsell-product-wrapper .upsell-product-wrap`);
    item = {};
    var items = [
      {
        "id": $(`.upsell-product-wrap[data-product-type="jacket"]`).find(`.product-variant-option`).val(),
        "quantity": 1,
        "properties": {
          "separate-product": "separate-product"
        }
      }
    ];
    productArray.each(function(){
      if($(this).find(`.checkbox`).hasClass("checked")){
        item = {
          "id": $(this).closest(`.upsell-product-wrap`).find(`.product-variant-option`).val(),
          "quantity": 1
        }
        items.push(item);
      }
    })
    data = {
      items: items
    };
    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
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
  }
});
$(document).on("click",".frequently-bought-together .selecte-size-button",function(){
  $(this).closest(`.upsell-product-wrap`).find(`.edit-item-button`).trigger("click");
})
$(document).on("click", ".frequently-bought-together .edit-item-button", function () {
  var target = $(this).closest(".upsell-product-wrap").find(".edit-item-popup");
  var option1 = $(this).closest(".upsell-product-wrap").find(".option-1").text().toLocaleLowerCase(),
      option2 = $(this).closest(".upsell-product-wrap").find(".option-2").text().toLocaleLowerCase(),
      option3 = $(this).closest(".upsell-product-wrap").find(".option-3").text().toLocaleLowerCase();
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
$(document).on("click", ".template-product-jacket-pant-separate-product .pdp-updates-button, .product-type-vest .pdp-updates-button", function () {
  var productHandle = $(this).closest(".edit-item-popup").data("product-handle"),
    itemParent = $(".upsell-product-wrap[data-product-handle='" + productHandle + "']"),
    parent = $(this).closest('.edit-item-popup'),
    variantTitle = '',
    currentVariantVal,
    dataHandle = parent.data("product-handle"),
    v_price, v_img,
    variant_info_wrap = $(".variant-info-wrap[data-product-handle='" + productHandle + "']");
  if (parent.find('[data-option-index="0"] input:checked').length > 0) {
    variantTitle = parent.find('[data-option-index="0"] input:checked').val();
  }
  if (parent.find('[data-option-index="1"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="1"] input:checked').val();
  }
  if (parent.find('[data-option-index="2"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + parent.find('[data-option-index="2"] input:checked').val();
  }
  var selectedVariantId = $(this).closest(".edit-item-popup").find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).val();
  if (!selectedVariantId) {
    $(this).find(".loading-overlay").addClass("hidden");
    $(this).closest(".edit-item-popup").find(".error-message").removeClass("error-show").text('');
    $(this).closest(".edit-item-popup").find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
  } else {
    parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).prop("selected", true);
    currentVariantVal = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('value');
    v_price = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('data-variant-price');
    v_img = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr('data-variant-image');

    
    var data_variant_inventory_policy = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-inventory-policy");
    var data_variant_inventory_quantity = parseInt(parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-inventory-quantity"));
    var data_variant_estimate_date = parent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`).attr("data-variant-estimate-date")
    if(theme_custom.current_date < data_variant_estimate_date) {
      if(data_variant_inventory_policy == "continue" && data_variant_inventory_quantity <= 0){
        $(`.estimated-variant-error-block-wrap[data-varaint-title="${selected_variant_title}"]`).addClass("active");
      }
    }
    if (parent.find('[data-option-index="0"] input:checked').length > 0) {
      itemParent.find(".variant-title .option-1").text(parent.find('[data-option-index="0"] input:checked').val());
      variant_info_wrap.find(".option-1").text(parent.find('[data-option-index="0"] input:checked').val());
    }
    if (parent.find('[data-option-index="1"] input:checked').length > 0) {
      itemParent.find(".variant-title .option-2").text(parent.find('[data-option-index="1"] input:checked').val());
      if(itemParent.closest(`.parent-product.product-type-pants`).length > 0){
        variant_info_wrap.find(".option-2").text(' x ' + parent.find('[data-option-index="1"] input:checked').val());
      } else {
        variant_info_wrap.find(".option-2").text(parent.find('[data-option-index="1"] input:checked').val());
      }
    }
    if (parent.find('[data-option-index="2"] input:checked').length > 0) {
      itemParent.find(".variant-title .option-3").text(parent.find('[data-option-index="2"] input:checked').val());
      variant_info_wrap.find(".option-title .option-3").text(parent.find('[data-option-index="2"] input:checked').val());
    }
    $(`.product-data-card[data-product-handle='${dataHandle}']`).find(".product-variant-id").val(currentVariantVal);
    $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-price .money').text(theme_custom.Shopify.formatMoney(v_price, theme_custom.money_format));
    $(`.product-data-card[data-product-handle='${dataHandle}']`).find('.product-image img').attr("src", v_img).attr("srcset", v_img);
    $(`.variant-info-wrap`).removeClass(`hidden`);
    $(`.edit-item-btn`).text(`Edit Size`);
    if ($(".error-message.error-show").length > 0) {
      $(".product-form__submit").addClass("disabled");
    } else {
      $(".product-form__submit").removeClass("disabled");
    }
    if($(`.template-product-jacket-pant-separate-product, .product-type-vest`).length > 0){
      itemParent.find(`.selecte-size-button`).addClass("hidden").attr("data-size-selected","edit-item");
      itemParent.find(`.variant-wrap`).removeClass("hidden");
      itemParent.find(`.parent-error-msg`).text(``).hide();
      if($(itemParent).closest(`.parent-product`).length > 0){
        itemParent.find(`.parent-error-msg`).removeClass("static undefined").removeAttr("variant-not-found");
      }
    }
    parent.find(".pdp-updates-button").find(".button").addClass("disabled");
    parent.find(".fancybox-close-small").click();
  }
})

theme_custom.editItemPopup = function (parentElement) {
  var variantDataGetArr = [];
  var productParent = parentElement,
      productId = productParent.attr("data-product-id"),
      variantTitle = '', 
      variantId, 
      variantImage, 
      variantPrice, 
      selectedOption;
  if (productParent.find('[data-option-index="0"] input:checked').length > 0) {
    variantTitle = productParent.find('[data-option-index="0"] input:checked').val();
  }
  if (productParent.find('[data-option-index="1"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + productParent.find('[data-option-index="1"] input:checked').val();
  }
  if (productParent.find('[data-option-index="2"] input:checked').length > 0) {
    variantTitle = variantTitle + ' / ' + productParent.find('[data-option-index="2"] input:checked').val();
  }
  var selectedOption = productParent.find(`.product-variant-option option[data-variant-title="${variantTitle}"]`),
      variantId = selectedOption.attr('value'),
      variantPrice = selectedOption.attr('data-variant-price'),
      variantImage = selectedOption.attr('data-variant-image'),
      variantInventoryQuantity = selectedOption.attr('data-variant-inventory-quantity'),
      variantInventoryPolicy = selectedOption.attr('data-variant-inventory-policy'),
      variantEstimateDate = selectedOption.attr('data-variant-estimate-date');;
  
  variantDataGetArr['productId'] = productId;
  variantDataGetArr['variantId'] = variantId;
  variantDataGetArr['variantImage'] = variantImage;
  variantDataGetArr['variantPrice'] = variantPrice;
  variantDataGetArr['variantTitle'] = variantTitle;
  variantDataGetArr['variantQty'] = variantInventoryQuantity;
  variantDataGetArr['variantInventoryPolicy'] = variantInventoryPolicy;
  if (!variantId) {
    productParent.find(".pdp-updates-button").addClass("disabled").text("Unavailable");
    productParent.find(".error-message").addClass("error-show").text(theme_custom.product_unavailable);
  } else {
    if (variantInventoryPolicy == 'continue') {
      productParent.find('.pdp-updates-button').removeClass('disabled').text("Update");
      productParent.find(".error-message").removeClass("error-show").text('');
      if (parseInt(variantInventoryQuantity) <= 0 && theme_custom.current_date < variantEstimateDate) {
        console.log(`This Variant is ${variantTitle} estimated date`);
      }
    } else {
      if (parseInt(variantInventoryQuantity) > 0) {
        productParent.find('.pdp-updates-button').removeClass('disabled').text("Update");
        productParent.find(".error-message").removeClass("error-show").text('');
      } else {
        productParent.find(".pdp-updates-button").addClass("disabled").text("Out of Stock");
        productParent.find(".error-message").addClass("error-show").text(theme_custom.product_out_of_stock);
      }
    }
  }
  return variantDataGetArr;
}

$(document).on("change", ".swatch-element [type='radio']", function () {
  var parentElement = $(this).closest('.edit-item-popup');
  theme_custom.editItemPopup(parentElement);
})
$(document).on("click",".frequently-bought-together .checkbox",function(){
  var target_price, final_price;
  if($(this).hasClass("checked")){
    $(this).removeClass("checked");
    target_price = parseInt($(`.frequently-bought-together .footer-wrap .price-wrap .price`).attr(`data-price`));
    final_price = target_price - parseInt($(this).closest(`.upsell-product-wrap`).find(`.product-price .money`).attr("data-price"));
  } else {
    $(this).addClass("checked");
    target_price = parseInt($(`.frequently-bought-together .footer-wrap .price-wrap .price`).attr(`data-price`));
    final_price = target_price + parseInt($(this).closest(`.upsell-product-wrap`).find(`.product-price .money`).attr("data-price"));
  }
  if($(`.frequently-bought-together .checkbox.checked`).length >= 1){
    $(`.fbt-add-to-cart`).removeClass("disabled");
  } else {
    $(`.fbt-add-to-cart`).addClass("disabled");
  }  
  $(".frequently-bought-together .footer-wrap .price-wrap .price").attr("data-price", final_price).text(theme_custom.Shopify.formatMoney(final_price, theme_custom.money_format));
});
$(document).on("click",".size-chart-btn",function(){
  var target = $(`.size-chart-wrapper`);
  $.fancybox.open(target);
})
$(".announcement-bar-main-wrapper").slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: "<img alt='slider-prev' class='slick-prev' src='https://cdn.shopify.com/s/files/1/0585/3223/3402/files/white-arrow-slick-prev.png'>",
  nextArrow: "<img alt='slider-next' class='slick-next' src='https://cdn.shopify.com/s/files/1/0585/3223/3402/files/white-arrow-slick-next.png'>",
  autoplay: true,
  autoplaySpeed: 2500,
});

var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();

// Ensure month and day have leading zeros if needed
if(month < 10) {
  month = '0' + month;
}
if(day < 10) {
  day = '0' + day;
}

theme_custom.current_date = month + '/' + day + '/' + year;

document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    if($(`.product-default`).length > 0) {
      let selected_variant_title = $(`[data-option-index="0"]`).find(`[type="radio"]:checked`).val();
      if($(`[data-option-index="1"]`).length > 0) {
        var variant_second_option = $(`[data-option-index="1"]`).find(`[type="radio"]:checked`).val()
        selected_variant_title = selected_variant_title + ' / ' + variant_second_option
      }
      if($(`[data-option-index="2"]`).length > 0) {
        var variant_third_option = $(`[data-option-index="2"]`).find(`[type="radio"]:checked`).val()
        selected_variant_title = selected_variant_title + ' / ' + variant_third_option
      }
      var data_variant_inventory_policy = $(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-inventory-policy");
      var data_variant_inventory_quantity = parseInt($(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-inventory-quantity"));
      var data_variant_estimate_date = $(`.product-variant-option option[data-variant-title="${selected_variant_title}"]`).attr("data-variant-estimate-date")
      if(theme_custom.current_date < data_variant_estimate_date) {
        if(data_variant_inventory_policy == "continue" && data_variant_inventory_quantity <= 0){
          $(`.estimated-variant-error-block-wrap[data-varaint-title="${selected_variant_title}"]`).addClass("active");
        }
      }
    }
  }, 1000);
});