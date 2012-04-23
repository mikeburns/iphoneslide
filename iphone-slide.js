// Generated by CoffeeScript 1.3.1

/*
// iphoneSlide - jQuery plugin
// @version: 0.8 (2012/03/03)
// @requires jQuery v1.4.3+
// @author Hina, Cain Chen. hinablue [at] gmail [dot] com
// @modified by: Adam Chow adamchow2326@yahoo.com.au
// Examples and documentation at: http://jquery.hinablue.me/jqiphoneslide
//
// Dual licensed under the MIT and GPL licenses:
// http://www.opensource.org/licenses/mit-license.php
// http://www.gnu.org/licenses/gpl.html
*/


(function() {
  var $, iphoneslide;

  $ = jQuery;

  iphoneslide = (function() {
    "use strict";

    var defaults, m;

    var name = 'iphoneslide';

    function iphoneslide(options, callback, workspace) {
      this.workspace = $(workspace);
      this._create(options, callback);
    }

    m = Math;

    defaults = {
      handler: null,
      pageHandler: null,
      slideHandler: null,
      direction: 'horizontal',
      maxShiftPage: 5,
      responsive: false,
      draglaunch: 0.5,
      friction: 0.325,
      sensitivity: 20,
      extrashift: 800,
      touchduring: 800,
      easing: 'swing',
      bounce: true,
      pageshowfilter: false,
      autoPlay: false,
      cancelAutoPlayOnResize: true,
      autoCreatePager: false,
      pager: {
        pagerType: 'dot',
        selectorName: '.banner_pager',
        childrenOnClass: 'on',
        slideToAnimated: true
      },
      autoPlayTime: 3000,
      onShiftComplete: null
    };

    iphoneslide.prototype.workspace = null;

    iphoneslide.prototype.handler = null;

    iphoneslide.prototype.pagesHandler = null;

    iphoneslide.prototype.totalPages = 0;

    iphoneslide.prototype.matrixRow = 0;

    iphoneslide.prototype.matrixColumn = 0;

    iphoneslide.prototype.pagesOuterWidth = 0;

    iphoneslide.prototype.pagesOuterHeight = 0;

    iphoneslide.prototype.maxWidthPage = 0;

    iphoneslide.prototype.maxHeightPage = 0;

    iphoneslide.prototype.nowPage = 1;

    iphoneslide.prototype.initiPhoneSlide = false;

    iphoneslide.prototype.autoPlayerTimer = null;

    iphoneslide.prototype.isTouch = false;

    iphoneslide.prototype.isStartDrag = false;

    iphoneslide.prototype.isPager = false;

    iphoneslide.prototype.initDND = {};

    iphoneslide.prototype.duringDND = {};

    iphoneslide.prototype.posDND = {
      origX: 0,
      origY: 0,
      X: 0,
      Y: 0
    };

    iphoneslide.prototype.boundry = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };

    iphoneslide.prototype.options = {};

    iphoneslide.prototype._updatepagernav = function() {
      var _this = this;
      if (this.isPager === true) {
        return $(opts.pager.selectorName).each(function(i, e) {
          return $("li", $(e)).removeClass(_this.options.pager.childrenOnClass).eq(_this.nowPage - 1).addClass(_this.options.pager.childrenOnClass);
        });
      }
    };

    iphoneslide.prototype._createpager = function() {
      var i, instance, opts, pageLinks, pagerHtml, pagerIndicator, _i, _ref;
      instance = this;
      opts = this.options;
      if (this.isPager === true) {
        return this;
      }
      switch (opts.pager.pagerType) {
        case "number":
          pagerIndicator = 0;
          break;
        case "dot":
          pagerIndicator = "&#8226";
          break;
        default:
          pagerIndicator = "";
      }
      for (i = _i = _ref = this.totalPages; _ref <= 1 ? _i <= 1 : _i >= 1; i = _ref <= 1 ? ++_i : --_i) {
        pagerLinks += '<li><span>' + (typeof pagerIndicator === "number" ? this.totalPages - i + 1 : pagerIndicator) + '</span></li>';
      }
      if (opts.pager.selectorName.charAt(0) === ".") {
        pagerHtml = $('<ul class="' + opts.pager.selectorName.substr(1, opts.pager.selectorName.length - 1) + '"></ul>').html(pagerLinks);
      } else if (opts.pager.selectorName.charAt(0) === "#") {
        pagerHtml = $('<ul id="' + opts.pager.selectorName.substr(1, opts.pager.selectorName.length - 1) + '"></ul>').html(pagerLinks);
      } else {
        pagerHtml = $("<ul></ul>").html(pagerLinks);
      }
      this.isPager = true;
      this.workspace.parent().append(pagerHtml);
      $(pagerHtml).delegate("li", "click.iphoneslidepager", function(event) {
        event.preventDefault();
        if (instance.autoPlayerTimer) {
          clearInterval(instance.autoPlayerTimer);
        }
        return instance.slide2page($(this).index() + 1, opts.pager.slideToAnimated);
      });
      if (opts.autoPlay === true) {
        if (this.autoPlayerTimer) {
          clearInterval(this.autoPlayerTimer);
        }
        this.autoPlayerTimer = setInterval(function() {
          if (instance.nowPage !== instance.totalPages) {
            return instance.slide2page("next");
          } else {
            return instance.slide2page(1);
          }
        }, opts.autoPlayTime);
      }
      pagerHtml = null;
      pageLinks = null;
      return this._updatepagernav();
    };

    iphoneslide.prototype._slidetopage = function(easing) {
      var animate, nowPageElem, opts, outerHeightBoundary, outerWidthBoundary, shift;
      opts = this.options;
      easing = typeof easing === "object" ? easing : {
        X: 0,
        Y: 0
      };
      shift = {
        X: 0,
        Y: 0
      };
      animate = {
        before: {},
        after: {}
      };
      outerWidthBoundary = this.workspace.width();
      outerHeightBoundary = this.workspace.height();
      nowPageElem = this.pagesHandler.eq(this.nowPage - 1);
      shift.X = nowPageElem.position().left;
      shift.X -= (outerWidthBoundary - nowPageElem.outerWidth(true)) / 2;
      shift.Y = nowPageElem.position().top;
      shift.Y -= (outerHeightBoundary - nowPageElem.outerHeight(true)) / 2;
      switch (opts.direction) {
        case "matrix":
          animate = {
            before: {
              top: -1 * shift.Y + easing.Y,
              left: -1 * shift.X + easing.X
            },
            after: {
              top: -1 * shift.Y,
              left: -1 * shift.X
            }
          };
          break;
        case "vertical":
          animate = {
            before: {
              top: -1 * shift.Y + easing.Y
            },
            after: {
              top: -1 * shift.Y
            }
          };
          break;
        case "horizontal":
          animate = {
            before: {
              left: -1 * shift.X + easing.X
            },
            after: {
              left: -1 * shift.X
            }
          };
      }
      nowPageElem = null;
      this._updatepagernav();
      return animate;
    };

    iphoneslide.prototype._getmovingdata = function(pos, init, timestamp) {
      var e, ex, opts, s, t, v, w;
      opts = this.options;
      v = ex = 0;
      w = this.workspace.outerWidth() || this.workspace.width();
      s = parseInt(init);
      e = parseInt(pos);
      t = parseInt(timestamp);
      v = m.abs(s - e) / m.abs(t);
      ex = m.floor(m.pow(v / 12, 2) * m.abs(opts.extrashift) / (2 * 9.80665 / 12 * m.abs(opts.friction)) * 0.01);
      ex = s > w / 2 ? m.floor(w / 3) : s;
      return {
        speed: v,
        shift: ex
      };
    };

    iphoneslide.prototype._click = function(event) {
      var REGEX, currentTag;
      event.stopPropagation();
      currentTag = event.currentTarget.nodeName.toLowerCase();
      switch (currentTag) {
        case "a":
          REGEX = /http(s?):\/\/.*/gi;
          if (REGEX.test(event.currentTarget)) {
            window.open(event.currentTarget);
          }
          break;
        case "button":
        case "input":
          $(event.currentTarget).trigger("click");
          break;
        default:
          return true;
      }
      return true;
    };

    iphoneslide.prototype._stopdrag = function(event) {
      var animate, bounce, during, easing, opts, pageColumn, pages, shift, stopEvent, thisMove, thisPage, thisPageSize, timestamp, touches,
        _this = this;
      opts = this.options;
      if (this.isStartDrag === false) {
        return false;
      }
      if (this.isTouch === true) {
        touches = event.originalEvent.touches || event.originalEvent.targetTouches || event.originalEvent.changedTouches;
      }
      stopEvent = typeof touches === "undefined" ? event : (touches.length > 0 ? touches[0] : {
        pageX: this.duringDND.pageX,
        pageY: this.duringDND.pageY,
        timeStamp: this.duringDND.timestamp
      });
      if (opts.slideHandler === null || typeof opts.slideHandler !== "string") {
        this.workspace.undelegate(opts.handler, "mousemove.iphoneslide touchmove.iphoneslide MozTouchMove.iphoneslide mouseup.iphoneslide mouseleave.iphoneslide touchend.iphoneslide touchcancel.iphoneslide");
      } else {
        this.workspace.undelegate(opts.slideHandler, "mousemove.iphoneslide touchmove.iphoneslide MozTouchMove.iphoneslide mouseup.iphoneslide mouseleave.iphoneslide touchend.iphoneslide touchcancel.iphoneslide");
      }
      if (m.max(m.abs(this.initDND.origX - stopEvent.pageX), m.abs(this.initDND.origY - stopEvent.pageY)) >= parseInt(opts.sensitivity)) {
        timestamp = m.abs(stopEvent.timeStamp - this.initDND.timestamp);
        bounce = {
          width: this.workspace.outerWidth(),
          height: this.workspace.outerHeight()
        };
        thisPage = this.pagesHandler.eq(this.nowPage - 1);
        thisPageSize = {
          width: thisPage.outerWidth(true),
          height: thisPage.outerHeight(true)
        };
        thisMove = {
          X: this._getmovingdata(stopEvent.pageX, this.initDND.origX, timestamp),
          Y: this._getmovingdata(stopEvent.pageY, this.initDND.origY, timestamp)
        };
        shift = {
          X: 0,
          Y: 0,
          shift: m.max(thisMove.X.shift, thisMove.Y.shift),
          speed: m.max(thisMove.X.speed, thisMove.Y.speed)
        };
        easing = {
          X: m.min(stopEvent.pageX - this.initDND.origX, thisPageSize.width),
          Y: m.min(stopEvent.pageY - this.initDND.origY, thisPageSize.height)
        };
        pages = {
          X: m.abs(this.posDND.X) >= bounce.width * opts.draglaunch || m.abs(this.posDND.Y) >= bounce.height * opts.draglaunch ? 0 : timestamp > opts.touchduring ? 1 : m.ceil(thisMove.X.speed * thisMove.X.shift / thisPageSize.width),
          Y: m.abs(this.posDND.X) >= bounce.width * opts.draglaunch || m.abs(this.posDND.Y) >= bounce.height * opts.draglaunch ? 0 : timestamp > opts.touchduring ? 1 : m.ceil(thisMove.Y.speed * thisMove.Y.shift / thisPageSize.height)
        };
        during = m.min(300, opts.touchduring, m.max(1 / shift.speed * m.abs(opts.extrashift), m.abs(opts.extrashift) * 0.5));
        switch (opts.direction) {
          case "matrix":
            pageColumn = m.ceil(this.nowPage / this.matrixRow);
            pages.X = pages.X > this.matrixRow ? this.matrixRow : m.abs(this.posDND.X) < thisPageSize.width * opts.draglaunch ? (m.floor(m.abs(easing.Y / easing.X)) > 2 ? 0 : pages.X) : (easing.X > 0 ? m.min(pages.X, this.nowPage - this.matrixRow * (pageColumn - 1)) : m.min(pages.X, this.matrixRow * pageColumn - this.nowPage));
            pages.Y = pages.Y > this.matrixColumn ? this.matrixColumn : m.abs(this.posDND.Y) < thisPageSize.height * opts.draglaunch ? (m.floor(m.abs(easing.X / easing.Y)) > 2 ? 0 : pages.Y) : (easing.Y > 0 ? m.min(pages.Y, pageColumn - 1) : this.matrixRow * pages.Y + this.nowPage > this.totalPages ? this.matrixColumn - pageColumn : pages.Y);
            this.nowPage = easing.X > 0 ? (this.nowPage - pages.X < 1 ? 1 : this.nowPage - pages.X) : (this.nowPage + pages.X > this.totalPages ? this.totalPages : this.nowPage + pages.X);
            this.nowPage = easing.Y > 0 ? (this.nowPage - pages.Y * this.matrixRow < 1 ? 1 : this.nowPage - pages.Y * this.matrixRow) : (pages.Y * this.matrixRow > this.totalPages ? this.totalPages : this.nowPage + pages.Y * this.matrixRow);
            break;
          case "vertical":
            pages.X = 0;
            pages.Y = pages.Y === 0 ? 1 : pages.Y > opts.maxShiftPage ? opts.maxShiftPage : (easing.Y > 0 ? (this.nowPage - pages.Y < 1 ? this.nowPage - 1 : pages.Y) : (this.nowPage + pages.Y > this.totalPages ? this.totalPages - this.nowPage : pages.Y));
            this.nowPage = easing.Y > 0 ? (this.nowPage - pages.Y < 1 ? 1 : this.nowPage - pages.Y) : (this.nowPage + pages.Y > this.totalPages ? this.totalPages : this.nowPage + pages.Y);
            break;
          case "horizontal":
            pages.Y = 0;
            pages.X = pages.X === 0 ? 1 : pages.X > opts.maxShiftPage ? opts.maxShiftPage : (easing.X > 0 ? (this.nowPage - pages.X < 1 ? this.nowPage - 1 : pages.X) : (this.nowPage + pages.X > this.totalPages ? this.totalPages - this.nowPage : pages.X));
            this.nowPage = easing.X > 0 ? (this.nowPage - pages.X < 1 ? 1 : this.nowPage - pages.X) : (this.nowPage + pages.X > this.totalPages ? this.totalPages : this.nowPage + pages.X);
        }
        this.nowPage = this.nowPage >= this.totalPages ? this.totalPages : this.nowPage;
        animate = opts.bounce === true ? this._slidetopage(easing) : this._slidetopage(0);
        if (opts.bounce === true) {
          this.handler.animate(animate.before, during);
        }
        this.handler.animate(animate.after, 300, (typeof $.easing[opts.easing] !== "undefined" ? opts.easing : "swing"), function() {
          _this.isStartDrag = false;
          _this._updatepagernav();
          return _this.complete();
        });
      } else {
        animate = this._slidetopage(0);
        this.handler.animate(animate.after, 300);
      }
      thisPage = null;
      stopEvent = null;
      this.isStartDrag = false;
      return true;
    };

    iphoneslide.prototype._startdrag = function(event) {
      var moveEvent, opts, touches;
      opts = this.options;
      if ($.browser.msie && !event.button || this.isStartDrag === false) {
        return this._stopdrag(event);
      }
      if (this.isStartDrag === true) {
        if (this.isTouch === true) {
          touches = event.originalEvent.touches || event.originalEvent.targetTouches || event.originalEvent.changedTouches;
        }
        moveEvent = typeof touches === "undefined" ? event : touches[0];
        this.duringDND = {
          pageX: moveEvent.pageX,
          pageY: moveEvent.pageY,
          timestamp: event.timeStamp
        };
        this.posDND.X = parseInt(moveEvent.pageX - this.initDND.origX);
        this.posDND.Y = parseInt(moveEvent.pageY - this.initDND.origY);
        switch (opts.direction) {
          case "matrix":
            this.handler.css({
              left: this.posDND.origX + this.posDND.X,
              top: this.posDND.origY + this.posDND.Y
            });
            break;
          case "vertical":
            this.handler.css("top", this.posDND.origY + this.posDND.Y);
            break;
          case "herizontal":
            this.handler.css("left", this.posDND.origX + this.posDND.X);
        }
      }
      if (this.isTouch === true) {
        if (this.boundry.top > moveEvent.pageY || this.boundry.left > moveEvent.pageX || this.boundry.right < moveEvent.pageX || this.boundry.bottom < moveEvent.pageY) {
          this._stopdrag(event);
        }
      }
      moveEvent = null;
      return this.isStartDrag;
    };

    iphoneslide.prototype._initdrag = function(event) {
      var opts, startEvent, touches,
        _this = this;
      opts = this.options;
      if (this.autoPlayerTimer !== null) {
        clearInterval(this.autoPlayerTimer);
      }
      if (this.isStartDrag === true) {
        return false;
      }
      if (this.isTouch === true) {
        touches = event.originalEvent.touches || event.originalEvent.targetTouches || event.originalEvent.changedTouches;
      }
      this.isStartDrag = true;
      startEvent = typeof touches === "undefined" ? event : touches[0];
      this.initDND = {
        timestamp: event.timeStamp,
        origX: startEvent.pageX,
        origY: startEvent.pageY
      };
      this.posDND.origX = this.posDND.X = this.handler.position().left;
      this.posDND.origY = this.posDND.Y = this.handler.position().top;
      if (opts.slideHandler === null || typeof opts.slideHandler !== "string") {
        if (!this.isTouch) {
          this.workspace.delegate(opts.handler, "mousemove.iphoneslide", function(event) {
            event.preventDefault();
            return _this._startdrag(event);
          }).delegate(opts.handler, "mouseleave.iphoneslide mouseup.iphoneslide", function(event) {
            event.preventDefault();
            return _this._stopdrag(event);
          });
        } else {
          this.workspace.delegate(opts.handler, "touchmove.iphoneslide MozTouchMove.iphoneslide", function(event) {
            event.preventDefault();
            return _this._startdrag(event);
          }).delegate(opts.handler, "touchend.iphoneslide touchcancel.iphoneslide", function(event) {
            event.preventDefault();
            return _this._stopdrag(event);
          });
        }
      } else {
        if (!this.isTouch) {
          this.workspace.delegate(opts.slideHandler, "mousemove.iphoneslide", function(event) {
            event.preventDefault();
            return _this._startdrag(event);
          }).delegate(opts.slideHandler, "mouseleave.iphoneslide mouseup.iphoneslide", function(event) {
            event.preventDefault();
            return _this._stopdrag(event);
          });
        } else {
          this.workspace.delegate(opts.slideHandler, "touchmove.iphoneslide MozTouchMove.iphoneslide", function(event) {
            event.preventDefault();
            return _this._startdrag(event);
          }).delegate(opts.slideHandler, "touchend.iphoneslide touchcancel.iphoneslide", function(event) {
            event.preventDefault();
            return _this._stopdrag(event);
          });
        }
      }
      startEvent = null;
      return this.isStartDrag;
    };

    iphoneslide.prototype._create = function(options, callback) {
      var opts,
        _this = this;
      if (!this._init(options)) {
        return this;
      }
      opts = this.options;
      this.nowPage = 1;
      if (!this.isTouch) {
        if (opts.slideHandler === null || typeof opts.slideHandler !== "string") {
          this.workspace.delegate(opts.handler, "mousedown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._initdrag(event);
          });
          this.handler.delegate("a, button, input[type=button], input[type=reset], input[type=submit]", "mousedown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._click(event);
          });
        } else {
          this.workspace.delegate(opts.slideHandler, "mousedown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._initdrag(event);
          });
          this.handler.filter(opts.slideHandler).delegate("a, button, input[type=button], input[type=reset], input[type=submit]", "mousedown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._click(event);
          });
        }
      } else {
        if (opts.slideHandler === null || typeof opts.slideHandler !== "string") {
          this.workspace.delegate(opts.handler, "touchstart.iphoneslide MozTouchDown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._initdrag(event);
          });
          this.handler.delegate("a, button, input[type=button], input[type=reset], input[type=submit]", "touchstart.iphoneslide MozTouchDown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._click(event);
          });
        } else {
          this.workspace.delegate(opts.slideHandler, "touchstart.iphoneslide MozTouchDown.iphoneslide", function(event) {
            event.preventDefault();
            return _this._initdrag(event);
          });
          this.handler.filter(opts.slideHandler).delegate("a, button, input[type=button], input[type=reset], input[type=submit]", "touchstart.iphoneslide MozTouchDown.iphone?slide", function(event) {
            event.preventDefault();
            return _this._click(event);
          });
        }
      }
      if (opts.autoCreatePager === true && !this.isPager) {
        this._createpager();
      }
      $(window).resize(function() {
        if (_this.autoPlayerTimer && opts.cancelAutoPlayOnResize) {
          clearInterval(_this.autoPlayerTimer);
        }
        return _this.reset();
      });
      if ($.isFunction(callback === true)) {
        return callback.call(this);
      }
    };

    iphoneslide.prototype._init = function(options) {
      var opts, tmpPage;
      opts = this.options = $.extend({}, defaults, options);
      tmpPage = this.nowPage || 1;
      if (opts.handler === null || typeof opts.handler !== "string") {
        opts.handler = ".iphone-slide-page-handler";
        this.workspace.children(":first").addClass("iphone-slide-page-handler");
        this.options = opts;
      }
      this.isTouch = this.touch();
      this.handler = $(opts.handler, this.workspace);
      if (this.handler.children().size() === 0) {
        return false;
      }
      if (opts.pageHandler === null || typeof opts.pageHandler !== "string") {
        switch (this.handler.attr('tagName').toLowerCase()) {
          case "ul":
          case "ol":
            opts.pageHandler = 'li';
            break;
          default:
            opts.pageHandler = this.handler.children(':first').attr('tagName').toLowerCase();
        }
      }
      if (!opts.pageshowfilter) {
        this.pagesHandler = this.handler.children(opts.pageHandler);
      } else {
        this.pagesHandler = this.handler.children(opts.pageHandler).filter(':visible');
      }
      this.totalPages = this.pagesHandler.length;
      this._setBoundry();
      this.nowPage = 0;
      this.slide2page(tmpPage);
      this.pagesHandler.css('display', 'block');
      return this;
    };

    iphoneslide.prototype._setBoundry = function() {
      var i, maxPageSize, opts, _i, _ref,
        _this = this;
      opts = this.options;
      maxPageSize = this._getMaxPageSize();
      switch (opts.direction) {
        case "matrix":
          this.matrixRow = m.ceil(m.sqrt(this.totalPages));
          this.matrixColumn = m.ceil(this.totalPages / this.matrixRow);
          this.pagesOuterWidth = maxPageSize.width * this.matrixRow;
          this.pagesOuterHeight = maxPageSize.height * this.matrixColumn;
          this.handler.width(this.pagesOuterWidth).height(this.pagesOuterHeight);
          if (!opts.responsive) {
            this.pagesHandler.each(function(i, elem) {
              var _h, _w;
              elem = $(elem);
              _w = elem.outerWidth();
              _h = elem.outerHeight();
              if (_w < maxPageSize.width) {
                elem.css({
                  'margin-left': (maxPageSize.width - _w) / 2,
                  'margin-right': (maxPageSize.width - _w) / 2
                });
              }
              if (_h < maxPageSize.height) {
                elem.css({
                  'margin-top': (maxPageSize.height - _h) / 2,
                  'margin-bottom': (maxPageSize.height(-_h)) / 2
                });
              }
              return elem = null;
            });
          } else {
            this.pagesHandler.width(maxPageSize.width).height(maxPageSize.height);
          }
          for (i = _i = _ref = this.matrixColumn; _ref <= 1 ? _i <= 1 : _i >= 1; i = _ref <= 1 ? ++_i : --_i) {
            $('<br class="matrix-break-point" style="clear:both;">').insertAfter(this.pagesHandler.eq((i - 1) * this.matrixRow - 1));
          }
          this.workspace.width(maxPageSize.width).height(maxPageSize.height);
          break;
        case "vertical":
          this.pagesOuterWidth = maxPageSize.width;
          if (!opts.responsive) {
            this.pagesHandler.each(function(i, elem) {
              var _h, _w;
              elem = $(elem);
              _h = elem.outerHeight(true);
              _w = elem.outerWidth(true);
              _this.pagesOuterHeight += _h;
              if (_w < maxPageSize.width) {
                elem.css('margin-left', (maxPageSize - _w) / 2);
              }
              return elem = null;
            });
          } else {
            this.pagesOuterHeight = this.pagesHandler.size() * maxPageSize.height;
            this.pagesHandler.width(maxPageSize.width).height(maxPageSize.height);
          }
          this.handler.height(this.pagesOuterHeight).width(this.pagesOuterWidth).css('top', (maxPageSize.height - this.pagesHandler.eq(0).outerHeight(true)) / 2);
          this.workspace.width(maxPageSize.width);
          break;
        case "horizontal":
          this.pagesOuterHeight = maxPageSize.height;
          if (!opts.responsive) {
            this.pagesHandler.each(function(i, elem) {
              var _h, _w;
              elem = $(elem);
              _w = elem.outerWidth(true);
              _h = elem.outerHeight(true);
              _this.pagesOuterWidth += _w;
              if (_h < maxPageSize.height) {
                elem.css('margin-top', (maxPageSize.height - _h) / 2);
              }
              return elem = null;
            });
          } else {
            this.pagesOuterWidth = this.pagesHandler.size() * maxPageSize.width;
            this.pagesHandler.width(maxPageSize.width).height(maxPageSize.height);
          }
          this.handler.width(this.pagesOuterWidth).height(this.pagesOuterHeight).css('left', (maxPageSize.width - this.pagesHandler.eq(0).outerWidth(true)) / 2);
          this.workspace.height(maxPageSize.height);
      }
      return this.boundry = {
        top: this.workspace.position().top,
        left: this.workspace.position().left,
        right: this.workspace.position().left + this.workspace.width(),
        bottom: this.workspace.position().top + this.workspace.height()
      };
    };

    iphoneslide.prototype._getMaxPageSize = function() {
      var maxHeightPage, maxWidthPage, opts;
      opts = this.options;
      if (opts.responsive === true) {
        return {
          width: this.workspace.width(),
          height: this.workspace.height()
        };
      }
      maxWidthPage = 0;
      maxHeightPage = 0;
      this.pagesHandler.each(function(i, elem) {
        var _h, _w;
        elem = $(elem);
        _w = elem.outerWidth(true);
        _h = elem.outerHeight(true);
        maxWidthPage = _w >= maxWidthPage ? _w : maxWidthPage;
        maxHeightPage = _h >= maxHeightPage ? _h : maxHeightPage;
        return elem = null;
      });
      return {
        width: maxWidthPage,
        height: maxHeightPage
      };
    };

    iphoneslide.prototype.slide2page = function(page, effect) {
      var animate, opts,
        _this = this;
      opts = this.options;
      page || (page = 1);
      effect = typeof effect === "boolean" ? effect : true;
      if (typeof page === "string") {
        switch (page) {
          case "prev":
            page = this.nowPage - 1;
            break;
          case "next":
            page = this.nowPage + 1;
        }
      }
      if (page <= 0 || page > this.totalPages || page === this.nowPage) {
        return false;
      }
      this.nowPage = page;
      animate = this._slidetopage(page);
      if (effect === true) {
        this.handler.animate(animate.after, 300, (typeof $.easing[opts.easing] !== "undefined" ? opts.easing : "swing"), function() {
          return _this.complete();
        });
      } else {
        this.handler.css(animate.after);
        this.complete();
      }
      return this;
    };

    iphoneslide.prototype.blank2page = function(content, jump2page, callback) {
      var firstElem, opts,
        _this = this;
      opts = this.options;
      if (typeof content === "string") {
        content = [content];
      } else {
        if (!$.isArray(content)) {
          content = [];
        }
      }
      if (typeof jump2page !== "boolean") {
        jump2page = false;
      }
      if (typeof jump2page === "function") {
        callback = jump2page;
      } else {
        if (typeof callback !== "function") {
          callback = null;
        }
      }
      if (content.length > 0) {
        firstElem = this.pagesHandler.eq(0);
        this.nowPage = jump2page === true ? this.totalPages + 1 : this.nowPage;
        $.each(content, function(index, html) {
          firstElem.clone().removeAttr('style').html(html).appendTo(_this.handler);
          if (index === content.length - 1) {
            return _this._init(opts).slide2page(_this.nowPage);
          }
        });
      }
      return this;
    };

    iphoneslide.prototype.reset = function() {
      this._setBoundry();
      return this;
    };

    iphoneslide.prototype.complete = function() {
      var opts;
      opts = this.options;
      if (typeof opts.onShiftComplete !== "function") {
        return false;
      }
      opts.onShiftComplete.apply(this, [this.pagesHandler.eq(this.nowPage - 1), this.nowPage]);
      return this;
    };

    iphoneslide.prototype.update = function(key) {
      key = key || {};
      if ($.isPlainObject(key === true)) {
        this.options = $.extend({}, this.options, key);
      }
    };

    iphoneslide.prototype.touch = function() {
      var REGEX, REGEX2, userAgent;
      userAgent = navigator.userAgent || navigator.vendor || window.opera;
      REGEX = /android.+(mobile|pad)|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge|maemo|midp|mmp|netfront|operam(ob|in)i|palm(os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows(ce|phone)|xda|xiino/i;
      REGEX2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|awa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r|s)|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp(i|ip)|hs\-c|ht(c(\-||_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac(|\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt(|\/)|klon|kpt|kwc-|kyo(c|k)|le(no|xi)|lg(g|\/(k|l|u)|50|54|e-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-||o|v)|zz)|mt(50|p1|v)|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v)|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-|)|webc|whit|wi(g|nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i;
      if (REGEX.test(userAgent) || REGEX2.test(userAgent.substr(0, 4))) {
        return true;
      } else {
        return false;
      }
    };

    return iphoneslide;

  })();

  $.fn.iphoneSlide = function(options, callback) {
    var args;
    switch (typeof options) {
      case "string":
        args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
          var instance;
          instance = $.data(this, 'iphoneslide');
          if (!instance) {
            return false;
          }
          if (!$.isFunction(instance[options] || options.charAt(0 === "_"))) {
            return false;
          }
          return instance[options].apply(instance, args);
        });
        break;
      case "object":
        this.each(function() {
          var instance;
          instance = $.data(this, 'iphoneslide');
          if (!instance) {
            return $.data(this, 'iphoneslide', new iphoneslide(options, callback, this));
          } else {
            return instance.update(options);
          }
        });
    }
    return this;
  };

}).call(this);
