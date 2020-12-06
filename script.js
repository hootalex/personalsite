$();

$(function() {
  $('img').each(function() {
    var o = $(this);
    if (!o.attr('title') && o.attr('alt')) o.attr('title', o.attr('alt'));
  });
});


$(document).bind('keypress',function(e){
  function changeFavicon(src) {
      $('link[rel="shortcut icon"]').attr('href', src)
  }
  var charCode=
      (e.keyCode ? e.keyCode : e.which);
  if(charCode == 97){
$('link').html('<link rel="stylesheet" type="text/css" href="https://aelx.co/light.css">');
changeFavicon('https://aelx.co/favicon2.ico');
     }
     if(charCode == 115){
   $('link').html('<link rel="stylesheet" type="text/css" href="https://aelx.co/dark.css">');
   changeFavicon('//google.com/favicon.ico');
        }
 });


 /*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */

  // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  // })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  //
  // ga('create', 'UA-78729250-1', 'auto');
  // ga('send', 'pageview');


(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },

    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

$(function(){
		$("#page-wrap").wrapInner("<table cellspacing='30'><tr>");
		$(".post").wrap("<td></td>");
		$('html, body').mousewheel(function(event, delta) {
			this.scrollLeft -= (delta * 100);
		});
	});

// Crazy scroll based on mouse position
//   $(document).mousemove(function(e) {
//     var percent = e.clientX / $(window).width();
//     $('body, html').scrollLeft($(document).width() * percent);
// });

// Navlink Window Idea
//
// $(document).scroll(function(){
// 		$('.link').addClass('linkmin');
// });
//
// $(window).scroll(function() {
//    if($(window).scrollLeft() + $(window).width() == $(document).width()) {
//        $('.linkmin').removeClass('linkmin');
//    }
// });

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Zooming = factory());
}(this, (function () { 'use strict';

var body$1 = document.body;
var docElm = document.documentElement;
var webkitPrefix = 'WebkitAppearance' in document.documentElement.style ? '-webkit-' : '';

var divide = function divide(denominator) {
  return function (numerator) {
    return numerator / denominator;
  };
};

var half = divide(2);

var loadImage = function loadImage(url, cb) {
  var img = new Image();
  img.onload = function () {
    if (cb) cb(img);
  };
  img.src = url;
};

var scrollTop = function scrollTop() {
  return window.pageYOffset || (docElm || body$1.parentNode || body$1).scrollTop;
};

var getWindowCenter = function getWindowCenter() {
  var docWidth = docElm.clientWidth || body$1.clientWidth;
  var docHeight = docElm.clientHeight || body$1.clientHeight;

  return {
    x: half(docWidth),
    y: half(docHeight)
  };
};

var toggleListeners = function toggleListeners(el, types, handler) {
  var add = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  types.forEach(function (t) {
    if (add) {
      el.addEventListener(t, handler[t]);
    } else {
      el.removeEventListener(t, handler[t]);
    }
  });
};

/**
 * A list of options.
 *
 * @type {Object}
 * @example
 * // Default options
 * var options = {
 *   defaultZoomable: 'img[data-action="zoom"]',
 *   enableGrab: true,
 *   preloadImage: true,
 *   transitionDuration: 0.4,
 *   transitionTimingFunction: 'cubic-bezier(0.4, 0, 0, 1)',
 *   bgColor: 'rgb(255, 255, 255)',
 *   bgOpacity: 1,
 *   scaleBase: 1.0,
 *   scaleExtra: 0.5,
 *   scrollThreshold: 40,
 *   onOpen: null,
 *   onClose: null,
 *   onRelease: null,
 *   onBeforeOpen: null,
 *   onBeforeClose: null,
 *   onBeforeGrab: null,
 *   onBeforeMove: null,
 *   onBeforeRelease: null
 * }
 */
var options = {
  /**
   * Zoomable elements by default. It can be a css selector or an element.
   * @type {string|Element}
   */
  defaultZoomable: 'img',

  /**
   * To be able to grab and drag the image for extra zoom-in.
   * @type {boolean}
   */
  enableGrab: true,

  /**
   * Preload images with attribute "data-original".
   * @type {boolean}
   */
  preloadImage: true,

  /**
   * Transition duration in seconds.
   * @type {number}
   */
  transitionDuration: 0.4,

  /**
   * Transition timing function.
   * @type {string}
   */
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0, 1)',

  /**
   * Overlay background color.
   * @type {string}
   */
  bgColor: 'rgb(0, 0, 0)',

  /**
   * Overlay background opacity.
   * @type {number}
   */
  bgOpacity: 1,

  /**
   * The base scale factor for zooming. By default scale to fit the window.
   * @type {number}
   */
  scaleBase: 1.0,

  /**
   * The extra scale factor when grabbing the image.
   * @type {number}
   */
  scaleExtra: 0.8,

  /**
   * How much scrolling it takes before closing out.
   * @type {number}
   */
  scrollThreshold: 40,

  /**
   * A callback function that will be called when a target is opened and
   * transition has ended. It will get the target element as the argument.
   * @type {Function}
   */
  onOpen: null,

  /**
   * Same as above, except fired when closed.
   * @type {Function}
   */
  onClose: null,

  /**
   * Same as above, except fired when released.
   * @type {Function}
   */
  onRelease: null,

  /**
   * A callback function that will be called before open.
   * @type {Function}
   */
  onBeforeOpen: null,

  /**
   * A callback function that will be called before close.
   * @type {Function}
   */
  onBeforeClose: null,

  /**
   * A callback function that will be called before grab.
   * @type {Function}
   */
  onBeforeGrab: null,

  /**
   * A callback function that will be called before move.
   * @type {Function}
   */
  onBeforeMove: null,

  /**
   * A callback function that will be called before release.
   * @type {Function}
   */
  onBeforeRelease: null
};

var style = {
  target: {
    close: null,
    open: null
  },
  overlay: {
    init: {
      zIndex: 99998,
      backgroundColor: options.bgColor,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      transition: 'opacity\n        ' + options.transitionDuration + 's\n        ' + options.transitionTimingFunction
    }
  },
  cursor: {
    default: 'auto',
    zoomIn: webkitPrefix + 'zoom-in',
    zoomOut: webkitPrefix + 'zoom-out',
    grab: webkitPrefix + 'grab',
    move: 'move'
  }
};

var sniffTransition = function sniffTransition(el) {
  var ret = {};
  var trans = ['webkitTransition', 'transition', 'mozTransition'];
  var tform = ['webkitTransform', 'transform', 'mozTransform'];
  var end = {
    'transition': 'transitionend',
    'mozTransition': 'transitionend',
    'webkitTransition': 'webkitTransitionEnd'
  };

  trans.some(function (prop) {
    if (el.style[prop] !== undefined) {
      ret.transitionProp = prop;
      ret.transEndEvent = end[prop];
      return true;
    }
  });

  tform.some(function (prop) {
    if (el.style[prop] !== undefined) {
      ret.transformProp = prop;
      ret.transformCssProp = prop.replace(/(.*)Transform/, '-$1-transform');
      return true;
    }
  });

  return ret;
};

var checkTrans = function checkTrans(transitionProp, transformProp) {
  return function setStyle(el, styles, remember) {
    var value = void 0;
    if (styles.transition) {
      value = styles.transition;
      delete styles.transition;
      styles[transitionProp] = value;
    }
    if (styles.transform) {
      value = styles.transform;
      delete styles.transform;
      styles[transformProp] = value;
    }

    var s = el.style;
    var original = {};

    for (var key in styles) {
      if (remember) original[key] = s[key] || '';
      s[key] = styles[key];
    }

    return original;
  };
};

var calculateTranslate = function calculateTranslate(rect) {
  var windowCenter = getWindowCenter();
  var targetCenter = {
    x: rect.left + half(rect.width),
    y: rect.top + half(rect.height)
  };

  // The vector to translate image to the window center
  return {
    x: windowCenter.x - targetCenter.x,
    y: windowCenter.y - targetCenter.y
  };
};

var calculateScale = function calculateScale(rect, scaleBase) {
  var windowCenter = getWindowCenter();
  var targetHalfWidth = half(rect.width);
  var targetHalfHeight = half(rect.height);

  // The distance between target edge and window edge
  var targetEdgeToWindowEdge = {
    x: windowCenter.x - targetHalfWidth,
    y: windowCenter.y - targetHalfHeight
  };

  var scaleHorizontally = targetEdgeToWindowEdge.x / targetHalfWidth;
  var scaleVertically = targetEdgeToWindowEdge.y / targetHalfHeight;

  // The additional scale is based on the smaller value of
  // scaling horizontally and scaling vertically
  return scaleBase + Math.min(scaleHorizontally, scaleVertically);
};

var TOUCH_SCALE_FACTOR = 2;

var processTouches = function processTouches(touches, cb) {
  var total = touches.length;
  var firstTouch = touches[0];
  var multitouch = total > 1;

  var scaleExtra = options.scaleExtra;
  var i = touches.length;
  var xs = 0,
      ys = 0;

  // keep track of the min and max of touch positions

  var min = { x: firstTouch.clientX, y: firstTouch.clientY };
  var max = { x: firstTouch.clientX, y: firstTouch.clientY };

  while (i--) {
    var t = touches[i];
    var _ref = [t.clientX, t.clientY],
        x = _ref[0],
        y = _ref[1];

    xs += x;
    ys += y;

    if (!multitouch) continue;

    if (x < min.x) {
      min.x = x;
    } else if (x > max.x) {
      max.x = x;
    }

    if (y < min.y) {
      min.y = y;
    } else if (y > max.y) {
      max.y = y;
    }
  }

  if (multitouch) {
    // change scaleExtra dynamically
    var distX = max.x - min.x,
        distY = max.y - min.y;


    if (distX > distY) {
      scaleExtra = distX / window.innerWidth * TOUCH_SCALE_FACTOR;
    } else {
      scaleExtra = distY / window.innerHeight * TOUCH_SCALE_FACTOR;
    }
  }

  cb(xs / total, ys / total, scaleExtra);
};

var _this = undefined;

var PRESS_DELAY = 200;
var EVENT_TYPES_GRAB = ['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];

// elements
var body = document.body;
var overlay = document.createElement('div');
var target = void 0;
var parent = void 0;

// state
var shown = false; // target is open
var lock = false; // target is in transform
var released = true; // mouse/finger is not pressing down
var lastScrollPosition = null;
var translate = void 0;
var scale = void 0;
var srcThumbnail = void 0;
var pressTimer = void 0;

var trans = sniffTransition(overlay);
var transformCssProp = trans.transformCssProp;
var transEndEvent = trans.transEndEvent;
var setStyleHelper = checkTrans(trans.transitionProp, trans.transformProp);

var setStyle$1 = function setStyle$1(el, styles, remember) {
  return setStyleHelper(el, styles, remember);
};

var eventHandler = {

  click: function click(e) {
    e.preventDefault();

    if (shown) {
      if (released) api.close();else api.release();
    } else {
      api.open(e.currentTarget);
    }
  },

  scroll: function scroll() {
    var st = scrollTop();

    if (lastScrollPosition === null) {
      lastScrollPosition = st;
    }

    var deltaY = lastScrollPosition - st;

    if (Math.abs(deltaY) >= options.scrollThreshold) {
      lastScrollPosition = null;
      api.close();
    }
  },

  keydown: function keydown(e) {
    var code = e.key || e.code;
    if (code === 'Escape' || e.keyCode === 27) {
      if (released) api.close();else api.release(function () {
        return api.close();
      });
    }
  },

  mousedown: function mousedown(e) {
    if (e.button !== 0) return;
    e.preventDefault();

    pressTimer = setTimeout(function () {
      api.grab(e.clientX, e.clientY);
    }, PRESS_DELAY);
  },

  mousemove: function mousemove(e) {
    if (released) return;
    api.move(e.clientX, e.clientY);
  },

  mouseup: function mouseup(e) {
    if (e.button !== 0) return;
    clearTimeout(pressTimer);

    if (released) api.close();else api.release();
  },

  touchstart: function touchstart(e) {
    e.preventDefault();

    pressTimer = setTimeout(function () {
      processTouches(e.touches, function (x, y, scaleExtra) {
        api.grab(x, y, scaleExtra);
      });
    }, PRESS_DELAY);
  },

  touchmove: function touchmove(e) {
    if (released) return;

    processTouches(e.touches, function (x, y, scaleExtra) {
      api.move(x, y, scaleExtra);
    });
  },

  touchend: function touchend(e) {
    if (e.targetTouches.length > 0) return;
    clearTimeout(pressTimer);

    if (released) api.close();else api.release();
  }
};

/**
 * Zooming methods.
 * @type {Object}
 */
var api = {

  /**
   * Make element(s) zoomable.
   * @param  {string|Element} el A css selector or an Element.
   * @return {api}
   */
  listen: function listen(el) {
    if (typeof el === 'string') {
      var els = document.querySelectorAll(el),
          i = els.length;

      while (i--) {
        api.listen(els[i]);
      }

      return _this;
    }

    if (el.tagName !== 'IMG') return;

    el.style.cursor = style.cursor.zoomIn;

    el.addEventListener('click', eventHandler.click);

    if (options.preloadImage && el.hasAttribute('data-original')) {
      loadImage(el.getAttribute('data-original'));
    }

    return _this;
  },

  /**
   * Open (zoom in) the Element.
   * @param  {Element} el The Element to open.
   * @param  {Function} [cb=options.onOpen] A callback function that will be
   * called when a target is opened and transition has ended. It will get
   * the target element as the argument.
   * @return {api}
   */
  open: function open(el) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options.onOpen;

    if (shown || lock) return;

    target = typeof el === 'string' ? document.querySelector(el) : el;

    if (target.tagName !== 'IMG') return;

    // onBeforeOpen event
    if (options.onBeforeOpen) options.onBeforeOpen(target);

    shown = true;
    lock = true;
    parent = target.parentNode;

    // load hi-res image if preloadImage option is disabled
    if (!options.preloadImage && target.hasAttribute('data-original')) {
      loadImage(target.getAttribute('data-original'));
    }

    var rect = target.getBoundingClientRect();
    translate = calculateTranslate(rect);
    scale = calculateScale(rect, options.scaleBase);

    // force layout update
    target.offsetWidth;

    style.target.open = {
      position: 'relative',
      zIndex: 99999,
      cursor: options.enableGrab ? style.cursor.grab : style.cursor.zoomOut,
      transition: transformCssProp + '\n        ' + options.transitionDuration + 's\n        ' + options.transitionTimingFunction,
      transform: 'translate(' + translate.x + 'px, ' + translate.y + 'px) scale(' + scale + ')'
    };

    // trigger transition
    style.target.close = setStyle$1(target, style.target.open, true);

    // insert overlay
    parent.appendChild(overlay);
    setTimeout(function () {
      return overlay.style.opacity = options.bgOpacity;
    }, 30);

    document.addEventListener('scroll', eventHandler.scroll);
    document.addEventListener('keydown', eventHandler.keydown);

    target.addEventListener(transEndEvent, function onEnd() {
      target.removeEventListener(transEndEvent, onEnd);

      lock = false;

      if (options.enableGrab) {
        toggleListeners(document, EVENT_TYPES_GRAB, eventHandler, true);
      }

      if (target.hasAttribute('data-original')) {
        (function () {
          srcThumbnail = target.getAttribute('src');
          var dataOriginal = target.getAttribute('data-original');
          var temp = target.cloneNode(false);

          // force compute the hi-res image in DOM to prevent
          // image flickering while updating src
          temp.setAttribute('src', dataOriginal);
          temp.style.position = 'absolute';
          temp.style.visibility = 'hidden';
          body.appendChild(temp);

          setTimeout(function () {
            target.setAttribute('src', dataOriginal);
            body.removeChild(temp);
          }, 10);
        })();
      }

      if (cb) cb(target);
    });

    return _this;
  },

  /**
   * Close (zoom out) the Element currently opened.
   * @param  {Function} [cb=options.onClose] A callback function that will be
   * called when a target is closed and transition has ended. It will get
   * the target element as the argument.
   * @return {api}
   */
  close: function close() {
    var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options.onClose;

    if (!shown || lock) return;

    // onBeforeClose event
    if (options.onBeforeClose) options.onBeforeClose(target);

    lock = true;

    // force layout update
    target.offsetWidth;

    overlay.style.opacity = 0;
    setStyle$1(target, { transform: 'none' });

    document.removeEventListener('scroll', eventHandler.scroll);
    document.removeEventListener('keydown', eventHandler.keydown);

    target.addEventListener(transEndEvent, function onEnd() {
      target.removeEventListener(transEndEvent, onEnd);

      shown = false;
      lock = false;

      if (options.enableGrab) {
        toggleListeners(document, EVENT_TYPES_GRAB, eventHandler, false);
      }

      if (target.hasAttribute('data-original')) {
        // downgrade source
        target.setAttribute('src', srcThumbnail);
      }

      // trigger transition
      setStyle$1(target, style.target.close);

      // remove overlay
      parent.removeChild(overlay);

      if (cb) cb(target);
    });

    return _this;
  },

  /**
   * Grab the Element currently opened given a position and apply extra zoom-in.
   * @param  {number}   x The X-axis of where the press happened.
   * @param  {number}   y The Y-axis of where the press happened.
   * @param  {number}   scaleExtra Extra zoom-in to apply.
   * @param  {Function} [cb=options.scaleExtra] A callback function that will be
   * called when a target is grabbed and transition has ended. It will get
   * the target element as the argument.
   * @return {api}
   */
  grab: function grab(x, y) {
    var scaleExtra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : options.scaleExtra;
    var cb = arguments[3];

    if (!shown || lock) return;

    // onBeforeGrab event
    if (options.onBeforeGrab) options.onBeforeGrab(target);

    released = false;

    var windowCenter = getWindowCenter();
    var dx = windowCenter.x - x,
        dy = windowCenter.y - y;


    setStyle$1(target, {
      cursor: style.cursor.move,
      transform: 'translate(' + (translate.x + dx) + 'px, ' + (translate.y + dy) + 'px)\n        scale(' + (scale + scaleExtra) + ')'
    });

    target.addEventListener(transEndEvent, function onEnd() {
      target.removeEventListener(transEndEvent, onEnd);
      if (cb) cb(target);
    });
  },

  /**
   * Move the Element currently grabbed given a position and apply extra zoom-in.
   * @param  {number}   x The X-axis of where the press happened.
   * @param  {number}   y The Y-axis of where the press happened.
   * @param  {number}   scaleExtra Extra zoom-in to apply.
   * @param  {Function} [cb=options.scaleExtra] A callback function that will be
   * called when a target is moved and transition has ended. It will get
   * the target element as the argument.
   * @return {api}
   */
  move: function move(x, y) {
    var scaleExtra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : options.scaleExtra;
    var cb = arguments[3];

    if (!shown || lock) return;

    // onBeforeMove event
    if (options.onBeforeMove) options.onBeforeMove(target);

    released = false;

    var windowCenter = getWindowCenter();
    var dx = windowCenter.x - x,
        dy = windowCenter.y - y;


    setStyle$1(target, {
      transition: transformCssProp,
      transform: 'translate(' + (translate.x + dx) + 'px, ' + (translate.y + dy) + 'px)\n        scale(' + (scale + scaleExtra) + ')'
    });

    target.addEventListener(transEndEvent, function onEnd() {
      target.removeEventListener(transEndEvent, onEnd);
      if (cb) cb(target);
    });
  },

  /**
   * Release the Element currently grabbed.
   * @param  {Function} [cb=options.onRelease] A callback function that will be
   * called when a target is released and transition has ended. It will get
   * the target element as the argument.
   * @return {api}
   */
  release: function release() {
    var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options.onRelease;

    if (!shown || lock) return;

    // onBeforeRelease event
    if (options.onBeforeRelease) options.onBeforeRelease(target);

    lock = true;

    setStyle$1(target, style.target.open);

    target.addEventListener(transEndEvent, function onEnd() {
      target.removeEventListener(transEndEvent, onEnd);

      lock = false;
      released = true;

      if (cb) cb(target);
    });

    return _this;
  },

  /**
   * Update options.
   * @param  {Object} opts An Object that contains options.
   * @return {api}
   */
  config: function config(opts) {
    if (!opts) return options;

    for (var key in opts) {
      options[key] = opts[key];
    }

    setStyle$1(overlay, {
      backgroundColor: options.bgColor,
      transition: 'opacity\n        ' + options.transitionDuration + 's\n        ' + options.transitionTimingFunction
    });

    return _this;
  }
};

// Init ------------------------------------------------------------------------

setStyle$1(overlay, style.overlay.init);
overlay.setAttribute('id', 'zoom-overlay');
overlay.addEventListener('click', function () {
  return api.close();
});
document.addEventListener('DOMContentLoaded', function () {
  api.listen(options.defaultZoomable);
});

return api;

})));
//# sourceMappingURL=zooming.js.map
