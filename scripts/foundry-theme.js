/**
 * bl-jquery-image-center jQuery Plugin
 *
 * @copyright Boxlight Media Ltd. 2012
 * @license MIT License
 * @description Centers an image by moving, cropping and filling spaces inside it's parent container. Call
 * this on a set of images to have them fill their parent whilst maintaining aspect ratio
 * @author Robert Cambridge
 *
 * Usage: See documentation at http://boxlight.github.com/bl-jquery-image-center
 */
function arrayContainsArray(t, e) {
    return 0 !== e.length && e.every(function(e) {
        return t.indexOf(e) >= 0
    })
}

function unique(t, e, o) {
    return o.indexOf(t) == e
}

function cartesianProduct(t) {
    var e, o, n, i, r, a = [];
    if (!t || 0 == t.length) return t;
    for (r = t.splice(0, 1)[0], t = cartesianProduct(t), e = 0, n = r.length; e < n; e++)
        if (t && t.length)
            for (o = 0, i = t.length; o < i; o++) a.push([r[e]].concat(t[o]));
        else a.push([r[e]]);
    return a
}

function enableAddButton(t) {
    var e = $(".add-to-cart-button"),
        o = e.find(".status_text"),
        n = e.attr("data-add-title");
    e.attr("disabled", !1), priceTitle = t ? " - " + Format.money(t, !0, !0) : "", o.html(n + priceTitle)
}

function disableAddButton(t) {
    var e = $(".add-to-cart-button"),
        o = e.find(".status_text"),
        n = e.attr("data-add-title");
    if ("sold-out" == t) n = e.attr("data-sold-title");
    e.is(":disabled") || e.attr("disabled", "disabled"), o.html(n)
}

function enableSelectOption(t) {
    t.removeAttr("disabled"), t.text(t.attr("data-name")), t.removeAttr("disabled-type"), t.parent().is("span") && t.unwrap()
}

function disableSelectOption(t, e) {
    if ("sold-out" === e && (disabled_text = t.parent().attr("data-sold-text"), disabled_type = "sold-out", "false" === show_sold_out_product_options ? hide_option = !0 : hide_option = !1), "unavailable" === e && (disabled_text = t.parent().attr("data-unavailable-text"), disabled_type = "unavailable", hide_option = !0), t.val() > 0) {
        var o = t.attr("data-name");
        t.attr("disabled", !0), t.text(o + " " + disabled_text), t.attr("disabled-type", disabled_type), !0 === hide_option && (t.parent().is("span") || t.wrap("<span>"))
    }
}

function processProduct(t) {
    t.has_option_groups && (disableAddButton("add-to-cart"), setInitialProductOptionStatuses(t), $(".product_option_group").on("change", function() {
        disableAddButton("add-to-cart"), $("#option").val(0), processAvailableDropdownOptions(t, $(this))
    }), $("#option").val() > 0 && enableAddButton()), $(".product_option_select").length && (disableAddButton(), "false" === show_sold_out_product_options && $('option[disabled-type="sold-out"]').wrap("<span>")), $(".reset-selection-button").on("click", function() {
        disableAddButton("add-to-cart"), $("#option").val(0), $(this).hide(), $(".product_option_group option").each(function(t, e) {
            e.value > 0 && enableSelectOption($(e))
        }), setInitialProductOptionStatuses(t)
    })
}

function createCartesianProductOptions(t) {
    for (product_option_groups = [], ogIndex = 0; ogIndex < t.option_groups.length; ogIndex++) {
        for (product_option_group_group_values = [], ogvIndex = 0; ogvIndex < t.option_groups[ogIndex].values.length; ogvIndex++) product_option_group_group_values.push(t.option_groups[ogIndex].values[ogvIndex].id);
        product_option_groups.push(product_option_group_group_values)
    }
    return cartesianProduct(product_option_groups)
}

function setInitialProductOptionStatuses(t) {
    for (product_option_group_values = [], ogIndex = 0; ogIndex < t.option_groups.length; ogIndex++)
        for (ogvIndex = 0; ogvIndex < t.option_groups[ogIndex].values.length; ogvIndex++) product_option_group_values.push(t.option_groups[ogIndex].values[ogvIndex].id);
    for (cartesian_options = createCartesianProductOptions(t), pogv = 0; pogv < product_option_group_values.length; pogv++) {
        var e = product_option_group_values[pogv],
            o = 0,
            n = 0,
            i = 0;
        for (co = 0; co < cartesian_options.length; co++) cartesian_options[co].includes(e) && (product_option = findProductOptionByValueArray(t.options, cartesian_options[co]), product_option && (i++, product_option.sold_out && n++), o++);
        dropdown_select = $(".product_option_group option[value='" + e + "']"), 0 !== i && o !== n && i !== n || (0 === i && (disable_type = "unavailable"), o !== n && i !== n || (disable_type = "sold-out"), disableSelectOption(dropdown_select, disable_type))
    }
}

function processAvailableDropdownOptions(t, e) {
    if (selected_values = getSelectedValues(), num_selected = selected_values.count(t => t > 0), allSelected = selected_values.every(isGreaterThanZero), num_option_groups = t.option_groups.length, changed_value = parseInt(e.val()), selected_value = [], selected_value.push(changed_value), this_group_id = e.attr("data-group-id"), $(".product_option_group").not(e).find("option").each(function(t, e) {
            e.value > 0 && enableSelectOption($(e))
        }), cartesian_options = createCartesianProductOptions(t), 1 === num_selected && num_option_groups > 1)
        for (ogIndex = 0; ogIndex < t.option_groups.length; ogIndex++) {
            var o = t.option_groups[ogIndex];
            if (o.id != this_group_id)
                for (ogvIndex = 0; ogvIndex < o.values.length; ogvIndex++) {
                    var n = o.values[ogvIndex];
                    option_group_value_array = [], option_group_value_array.push(changed_value), option_group_value_array.push(parseInt(n.id));
                    var r = 0,
                        a = 0,
                        s = 0;
                    for (co = 0; co < cartesian_options.length; co++) arrayContainsArray(cartesian_options[co], option_group_value_array) && (product_option = findProductOptionByValueArray(t.options, cartesian_options[co]), product_option && (s++, product_option.sold_out && a++), r++);
                    dropdown_select = $(".product_option_group option[value='" + n.id + "']"), 0 !== s && r !== a && s !== a || (0 === s && (disable_type = "unavailable"), r !== a && s !== a || (disable_type = "sold-out"), disableSelectOption(dropdown_select, disable_type))
                }
        }
    if (2 === num_selected && 3 === num_option_groups)
        for ($(".product_option_group").each(function(t, e) {
                0 == e.value && (unselected_group_id = parseInt($(e).attr("data-group-id")))
            }), ogIndex = 0; ogIndex < t.option_groups.length; ogIndex++)
            if ((o = t.option_groups[ogIndex]).id != this_group_id)
                for (ogvIndex = 0; ogvIndex < o.values.length; ogvIndex++) {
                    n = o.values[ogvIndex], option_group_value_array = [], option_group_value_array.push(changed_value), option_group_value_array.push(parseInt(n.id));
                    r = 0, a = 0, s = 0;
                    for (co = 0; co < cartesian_options.length; co++) arrayContainsArray(cartesian_options[co], option_group_value_array) && (product_option = findProductOptionByValueArray(t.options, cartesian_options[co]), product_option && (s++, product_option.sold_out && a++), r++);
                    if (o.id === unselected_group_id) {
                        for (option_group_value_array = [], option_group_value_array.push(parseInt(n.id)), svIndex = 0; svIndex < selected_values.length; svIndex++) selected_values[svIndex] > 0 && option_group_value_array.push(selected_values[svIndex]);
                        product_option = findProductOptionByValueArray(t.options, option_group_value_array), dropdown_select = $(".product_option_group option[value='" + n.id + "']"), product_option ? product_option.sold_out && disableSelectOption(dropdown_select, "sold-out") : disableSelectOption(dropdown_select, "unavailable")
                    }
                    dropdown_select = $(".product_option_group option[value='" + n.id + "']"), 0 !== s && r !== a && s !== a || (0 === s && (disable_type = "unavailable"), r !== a && s !== a || (disable_type = "sold-out"), disableSelectOption(dropdown_select, disable_type))
                }
    num_selected > 1 && allSelected && $(".product_option_group").not(e).each(function(e, o) {
        (o = $(o)).find("option").each(function(e, n) {
            if (is_selected = $(n).is(":selected"), !is_selected && n.value > 0)
                for (option_group_value_array = [], option_group_value_array.push(parseInt(n.value)), $(".product_option_group").not(o).each(function(t, e) {
                        option_group_value_array.push(parseInt(e.value))
                    }), product_option = findProductOptionByValueArray(t.options, option_group_value_array), i = 0; i < option_group_value_array.length; i++) dropdown_select = $(".product_option_group option[value='" + option_group_value_array[i] + "']").not(":selected"), dropdown_select && (product_option ? product_option.sold_out ? disableSelectOption(dropdown_select, "sold-out") : enableSelectOption(dropdown_select) : disableSelectOption(dropdown_select, "unavailable"))
        })
    }), allSelected && (product_option = findProductOptionByValueArray(t.options, selected_values), product_option && !product_option.sold_out && product_option.id > 0 ? ($("#option").val(product_option.id), enableAddButton(product_option.price), num_option_groups > 1 && $(".reset-selection-button").fadeIn("fast")) : disableAddButton("sold-out"))
}

function findProductOptionByValueArray(t, e) {
    for (var o = 0; o < t.length; o++)
        if (option_group_values = t[o].option_group_values, option_ids = [], option_group_values.forEach(function(t) {
                option_ids.push(t.id)
            }), arrayContainsArray(option_ids, e)) return t[o]
}

function getSelectedValues() {
    return selected_values = [], $(".product_option_group").each(function(t, e) {
        selected_values.push(parseInt(e.value))
    }), selected_values
}! function(t) {
    t.fn.centerImage = function(e, o) {
        o = o || function() {};
        var n = this,
            i = t(this).length;
        e = "inside" == e;
        var r = function(o) {
                var n = t(o),
                    i = n.parent();
                i.css({
                    overflow: "hidden",
                    position: "absolute" == i.css("position") ? "absolute" : "relative"
                }), n.css({
                    position: "static",
                    width: "auto",
                    height: "auto",
                    "max-width": "100%",
                    "max-height": "100%"
                });
                var r = {
                    w: i.width(),
                    h: i.height(),
                    r: i.width() / i.height()
                };
                o = {
                    w: n.width(),
                    h: n.height(),
                    r: n.width() / n.height()
                };
                n.css({
                    "max-width": "none",
                    "max-height": "none",
                    width: Math.round(r.r > o.r ^ e ? "100%" : r.h / o.h * o.w),
                    height: Math.round(r.r < o.r ^ e ? "100%" : r.w / o.w * o.h)
                });
                r = {
                    w: i.width(),
                    h: i.height()
                }, o = {
                    w: n.width(),
                    h: n.height()
                };
                n.css({
                    position: "absolute",
                    left: Math.round((r.w - o.w) / 2),
                    top: Math.round((r.h - o.h) / 3)
                }), a(o)
            },
            a = function(t) {
                i--, o.apply(n, [t, i])
            };
        return n.each(function() {
            var e;
            this.complete || "complete" === this.readyState ? (e = this, setTimeout(function() {
                r(e)
            }, 1)) : function(e) {
                t(e).one("load", function() {
                    setTimeout(function() {
                        r(e)
                    }, 1)
                }).one("error", function() {
                    a(e)
                }).end(), (navigator.userAgent.indexOf("Trident/5") >= 0 || navigator.userAgent.indexOf("Trident/6")) && (e.src = e.src)
            }(this)
        })
    }, t.fn.imageCenterResize = function(e) {
        return t(this).centerImage("inside", e)
    }, t.fn.imageCropFill = function(e) {
        return t(this).centerImage("outside", e)
    }
}(jQuery),
/*!
Waypoints - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
function() {
    "use strict";

    function t(n) {
        if (!n) throw new Error("No options passed to Waypoint constructor");
        if (!n.element) throw new Error("No element option passed to Waypoint constructor");
        if (!n.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, n), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = n.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), o[this.key] = this, e += 1
    }
    var e = 0,
        o = {};
    t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t)
    }, t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, t.prototype.destroy = function() {
        this.context.remove(this), this.group.remove(this), delete o[this.key]
    }, t.prototype.disable = function() {
        return this.enabled = !1, this
    }, t.prototype.enable = function() {
        return this.context.refresh(), this.enabled = !0, this
    }, t.prototype.next = function() {
        return this.group.next(this)
    }, t.prototype.previous = function() {
        return this.group.previous(this)
    }, t.invokeAll = function(t) {
        var e = [];
        for (var n in o) e.push(o[n]);
        for (var i = 0, r = e.length; i < r; i++) e[i][t]()
    }, t.destroyAll = function() {
        t.invokeAll("destroy")
    }, t.disableAll = function() {
        t.invokeAll("disable")
    }, t.enableAll = function() {
        t.invokeAll("enable")
    }, t.refreshAll = function() {
        t.Context.refreshAll()
    }, t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }, t.viewportWidth = function() {
        return document.documentElement.clientWidth
    }, t.adapters = [], t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = t
}(),
function() {
    "use strict";

    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function e(t) {
        this.element = t, this.Adapter = i.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + o, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, n[t.waypointContextKey] = this, o += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var o = 0,
        n = {},
        i = window.Waypoint,
        r = window.onload;
    e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical);
        t && e && (this.adapter.off(".waypoints"), delete n[this.key])
    }, e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(), e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function() {
            e.didResize || (e.didResize = !0, i.requestAnimationFrame(t))
        })
    }, e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function() {
            e.didScroll && !i.isTouch || (e.didScroll = !0, i.requestAnimationFrame(t))
        })
    }, e.prototype.handleResize = function() {
        i.Context.refreshAll()
    }, e.prototype.handleScroll = function() {
        var t = {},
            e = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (var o in e) {
            var n = e[o],
                i = n.newScroll > n.oldScroll ? n.forward : n.backward;
            for (var r in this.waypoints[o]) {
                var a = this.waypoints[o][r],
                    s = n.oldScroll < a.triggerPoint,
                    d = n.newScroll >= a.triggerPoint;
                (s && d || !s && !d) && (a.queueTrigger(i), t[a.group.id] = a.group)
            }
        }
        for (var l in t) t[l].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    }, e.prototype.innerHeight = function() {
        return this.element == this.element.window ? i.viewportHeight() : this.adapter.innerHeight()
    }, e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, e.prototype.innerWidth = function() {
        return this.element == this.element.window ? i.viewportWidth() : this.adapter.innerWidth()
    }, e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints)
            for (var o in this.waypoints[e]) t.push(this.waypoints[e][o]);
        for (var n = 0, i = t.length; n < i; n++) t[n].destroy()
    }, e.prototype.refresh = function() {
        var t, e = this.element == this.element.window,
            o = e ? undefined : this.adapter.offset(),
            n = {};
        for (var r in this.handleScroll(), t = {
                horizontal: {
                    contextOffset: e ? 0 : o.left,
                    contextScroll: e ? 0 : this.oldScroll.x,
                    contextDimension: this.innerWidth(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                    offsetProp: "left"
                },
                vertical: {
                    contextOffset: e ? 0 : o.top,
                    contextScroll: e ? 0 : this.oldScroll.y,
                    contextDimension: this.innerHeight(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                    offsetProp: "top"
                }
            }) {
            var a = t[r];
            for (var s in this.waypoints[r]) {
                var d, l, p, u, c = this.waypoints[r][s],
                    f = c.options.offset,
                    h = c.triggerPoint,
                    g = 0,
                    _ = null == h;
                c.element !== c.element.window && (g = c.adapter.offset()[a.offsetProp]), "function" == typeof f ? f = f.apply(c) : "string" == typeof f && (f = parseFloat(f), c.options.offset.indexOf("%") > -1 && (f = Math.ceil(a.contextDimension * f / 100))), d = a.contextScroll - a.contextOffset, c.triggerPoint = g + d - f, l = h < a.oldScroll, p = c.triggerPoint >= a.oldScroll, u = !l && !p, !_ && (l && p) ? (c.queueTrigger(a.backward), n[c.group.id] = c.group) : !_ && u ? (c.queueTrigger(a.forward), n[c.group.id] = c.group) : _ && a.oldScroll >= c.triggerPoint && (c.queueTrigger(a.forward), n[c.group.id] = c.group)
            }
        }
        return i.requestAnimationFrame(function() {
            for (var t in n) n[t].flushTriggers()
        }), this
    }, e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t)
    }, e.refreshAll = function() {
        for (var t in n) n[t].refresh()
    }, e.findByElement = function(t) {
        return n[t.waypointContextKey]
    }, window.onload = function() {
        r && r(), e.refreshAll()
    }, i.requestAnimationFrame = function(e) {
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t).call(window, e)
    }, i.Context = e
}(),
function() {
    "use strict";

    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function o(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), n[this.axis][this.name] = this
    }
    var n = {
            vertical: {},
            horizontal: {}
        },
        i = window.Waypoint;
    o.prototype.add = function(t) {
        this.waypoints.push(t)
    }, o.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, o.prototype.flushTriggers = function() {
        for (var o in this.triggerQueues) {
            var n = this.triggerQueues[o],
                i = "up" === o || "left" === o;
            n.sort(i ? e : t);
            for (var r = 0, a = n.length; r < a; r += 1) {
                var s = n[r];
                (s.options.continuous || r === n.length - 1) && s.trigger([o])
            }
        }
        this.clearTriggerQueues()
    }, o.prototype.next = function(e) {
        this.waypoints.sort(t);
        var o = i.Adapter.inArray(e, this.waypoints);
        return o === this.waypoints.length - 1 ? null : this.waypoints[o + 1]
    }, o.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var o = i.Adapter.inArray(e, this.waypoints);
        return o ? this.waypoints[o - 1] : null
    }, o.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t)
    }, o.prototype.remove = function(t) {
        var e = i.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    }, o.prototype.first = function() {
        return this.waypoints[0]
    }, o.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }, o.findOrCreate = function(t) {
        return n[t.axis][t.name] || new o(t)
    }, i.Group = o
}(),
function() {
    "use strict";

    function t(t) {
        this.$element = e(t)
    }
    var e = window.jQuery,
        o = window.Waypoint;
    e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function(e, o) {
        t.prototype[o] = function() {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[o].apply(this.$element, t)
        }
    }), e.each(["extend", "inArray", "isEmptyObject"], function(o, n) {
        t[n] = e[n]
    }), o.adapters.push({
        name: "jquery",
        Adapter: t
    }), o.Adapter = t
}(),
function() {
    "use strict";

    function t(t) {
        return function() {
            var o = [],
                n = arguments[0];
            return t.isFunction(arguments[0]) && ((n = t.extend({}, arguments[1])).handler = arguments[0]), this.each(function() {
                var i = t.extend({}, n, {
                    element: this
                });
                "string" == typeof i.context && (i.context = t(this).closest(i.context)[0]), o.push(new e(i))
            }), o
        }
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}(),
function(t, e, o) {
    function n(t, e) {
        return typeof t === e
    }

    function i() {
        var t, e, o, i, r, a;
        for (var s in y)
            if (y.hasOwnProperty(s)) {
                if (t = [], (e = y[s]).name && (t.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length))
                    for (o = 0; o < e.options.aliases.length; o++) t.push(e.options.aliases[o].toLowerCase());
                for (i = n(e.fn, "function") ? e.fn() : e.fn, r = 0; r < t.length; r++) 1 === (a = t[r].split(".")).length ? b[a[0]] = i : (!b[a[0]] || b[a[0]] instanceof Boolean || (b[a[0]] = new Boolean(b[a[0]])), b[a[0]][a[1]] = i), m.push((i ? "" : "no-") + a.join("-"))
            }
    }

    function r(t) {
        var e = x.className,
            o = b._config.classPrefix || "";
        if ($ && (e = e.baseVal), b._config.enableJSClass) {
            var n = new RegExp("(^|\\s)" + o + "no-js(\\s|$)");
            e = e.replace(n, "$1" + o + "js$2")
        }
        b._config.enableClasses && (e += " " + o + t.join(" " + o), $ ? x.className.baseVal = e : x.className = e)
    }

    function a(t, e) {
        return !!~("" + t).indexOf(e)
    }

    function s() {
        return "function" != typeof e.createElement ? e.createElement(arguments[0]) : $ ? e.createElementNS.call(e, "http://www.w3.org/2000/svg", arguments[0]) : e.createElement.apply(e, arguments)
    }

    function d(t) {
        return t.replace(/([a-z])-([a-z])/g, function(t, e, o) {
            return e + o.toUpperCase()
        }).replace(/^-/, "")
    }

    function l(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    }

    function p(t, e, o) {
        var i;
        for (var r in t)
            if (t[r] in e) return !1 === o ? t[r] : n(i = e[t[r]], "function") ? l(i, o || e) : i;
        return !1
    }

    function u(t) {
        return t.replace(/([A-Z])/g, function(t, e) {
            return "-" + e.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function c() {
        var t = e.body;
        return t || ((t = s($ ? "svg" : "body")).fake = !0), t
    }

    function f(t, o, n, i) {
        var r, a, d, l, p = "modernizr",
            u = s("div"),
            f = c();
        if (parseInt(n, 10))
            for (; n--;)(d = s("div")).id = i ? i[n] : p + (n + 1), u.appendChild(d);
        return (r = s("style")).type = "text/css", r.id = "s" + p, (f.fake ? f : u).appendChild(r), f.appendChild(u), r.styleSheet ? r.styleSheet.cssText = t : r.appendChild(e.createTextNode(t)), u.id = p, f.fake && (f.style.background = "", f.style.overflow = "hidden", l = x.style.overflow, x.style.overflow = "hidden", x.appendChild(f)), a = o(u, t), f.fake ? (f.parentNode.removeChild(f), x.style.overflow = l, x.offsetHeight) : u.parentNode.removeChild(u), !!a
    }

    function h(e, n) {
        var i = e.length;
        if ("CSS" in t && "supports" in t.CSS) {
            for (; i--;)
                if (t.CSS.supports(u(e[i]), n)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in t) {
            for (var r = []; i--;) r.push("(" + u(e[i]) + ":" + n + ")");
            return f("@supports (" + (r = r.join(" or ")) + ") { #modernizr { position: absolute; } }", function(t) {
                return "absolute" == getComputedStyle(t, null).position
            })
        }
        return o
    }

    function g(t, e, i, r) {
        function l() {
            u && (delete k.style, delete k.modElem)
        }
        if (r = !n(r, "undefined") && r, !n(i, "undefined")) {
            var p = h(t, i);
            if (!n(p, "undefined")) return p
        }
        for (var u, c, f, g, _, v = ["modernizr", "tspan", "samp"]; !k.style && v.length;) u = !0, k.modElem = s(v.shift()), k.style = k.modElem.style;
        for (f = t.length, c = 0; f > c; c++)
            if (g = t[c], _ = k.style[g], a(g, "-") && (g = d(g)), k.style[g] !== o) {
                if (r || n(i, "undefined")) return l(), "pfx" != e || g;
                try {
                    k.style[g] = i
                } catch (m) {}
                if (k.style[g] != _) return l(), "pfx" != e || g
            } return l(), !1
    }

    function _(t, e, o, i, r) {
        var a = t.charAt(0).toUpperCase() + t.slice(1),
            s = (t + " " + S.join(a + " ") + a).split(" ");
        return n(e, "string") || n(e, "undefined") ? g(s, e, i, r) : p(s = (t + " " + A.join(a + " ") + a).split(" "), e, o)
    }

    function v(t, e, n) {
        return _(t, o, o, e, n)
    }
    var m = [],
        y = [],
        w = {
            _version: "3.3.1",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(t, e) {
                var o = this;
                setTimeout(function() {
                    e(o[t])
                }, 0)
            },
            addTest: function(t, e, o) {
                y.push({
                    name: t,
                    fn: e,
                    options: o
                })
            },
            addAsyncTest: function(t) {
                y.push({
                    name: null,
                    fn: t
                })
            }
        },
        b = function() {};
    b.prototype = w, b = new b;
    var x = e.documentElement,
        $ = "svg" === x.nodeName.toLowerCase(),
        C = "Moz O ms Webkit",
        S = w._config.usePrefixes ? C.split(" ") : [];
    w._cssomPrefixes = S;
    var A = w._config.usePrefixes ? C.toLowerCase().split(" ") : [];
    w._domPrefixes = A;
    var I = {
        elem: s("modernizr")
    };
    b._q.push(function() {
        delete I.elem
    });
    var k = {
        style: I.elem.style
    };
    b._q.unshift(function() {
        delete k.style
    }), w.testAllProps = _, w.testAllProps = v, b.addTest("flexbox", v("flexBasis", "1px", !0)), b.addTest("flexwrap", v("flexWrap", "wrap", !0)), i(), r(m), delete w.addTest, delete w.addAsyncTest;
    for (var O = 0; O < b._q.length; O++) b._q[O]();
    t.Modernizr = b
}(window, document),
/*!
 * Stickyfill -- `position: sticky` polyfill
 * v. 1.1.4 | https://github.com/wilddeer/stickyfill
 * Copyright Oleg Korsunsky | http://wd.dizaina.net/
 *
 * MIT License
 */
function(t, e) {
    function o() {
        C = O = S = A = I = k = L
    }

    function n(t, e) {
        for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o])
    }

    function i(t) {
        return parseFloat(t) || 0
    }

    function r() {
        P = {
            top: e.pageYOffset,
            left: e.pageXOffset
        }
    }

    function a() {
        if (e.pageXOffset != P.left) return r(), void S();
        e.pageYOffset != P.top && (r(), d())
    }

    function s() {
        setTimeout(function() {
            e.pageYOffset != P.top && (P.top = e.pageYOffset, d())
        }, 0)
    }

    function d() {
        for (var t = E.length - 1; t >= 0; t--) l(E[t])
    }

    function l(t) {
        if (t.inited) {
            var e = P.top <= t.limit.start ? 0 : P.top >= t.limit.end ? 2 : 1;
            t.mode != e && g(t, e)
        }
    }

    function p() {
        for (var t = E.length - 1; t >= 0; t--)
            if (E[t].inited) {
                var e = Math.abs(y(E[t].clone) - E[t].docOffsetTop),
                    o = Math.abs(E[t].parent.node.offsetHeight - E[t].parent.height);
                if (e >= 2 || o >= 2) return !1
            } return !0
    }

    function u(t) {
        isNaN(parseFloat(t.computed.top)) || t.isCell || "none" == t.computed.display || (t.inited = !0, t.clone || _(t), "absolute" != t.parent.computed.position && "relative" != t.parent.computed.position && (t.parent.node.style.position = "relative"), l(t), t.parent.height = t.parent.node.offsetHeight, t.docOffsetTop = y(t.clone))
    }

    function c(t) {
        var e = !0;
        t.clone && v(t), n(t.node.style, t.css);
        for (var o = E.length - 1; o >= 0; o--)
            if (E[o].node !== t.node && E[o].parent.node === t.parent.node) {
                e = !1;
                break
            } e && (t.parent.node.style.position = t.parent.css.position), t.mode = -1
    }

    function f() {
        for (var t = E.length - 1; t >= 0; t--) u(E[t])
    }

    function h() {
        for (var t = E.length - 1; t >= 0; t--) c(E[t])
    }

    function g(t, e) {
        var o = t.node.style;
        switch (e) {
            case 0:
                o.position = "absolute", o.left = t.offset.left + "px", o.right = t.offset.right + "px", o.top = t.offset.top + "px", o.bottom = "auto", o.width = "auto", o.marginLeft = 0, o.marginRight = 0, o.marginTop = 0;
                break;
            case 1:
                o.position = "fixed", o.left = t.box.left + "px", o.right = t.box.right + "px", o.top = t.css.top, o.bottom = "auto", o.width = "auto", o.marginLeft = 0, o.marginRight = 0, o.marginTop = 0;
                break;
            case 2:
                o.position = "absolute", o.left = t.offset.left + "px", o.right = t.offset.right + "px", o.top = "auto", o.bottom = 0, o.width = "auto", o.marginLeft = 0, o.marginRight = 0
        }
        t.mode = e
    }

    function _(t) {
        t.clone = document.createElement("div");
        var e = t.node.nextSibling || t.node,
            o = t.clone.style;
        o.height = t.height + "px", o.width = t.width + "px", o.marginTop = t.computed.marginTop, o.marginBottom = t.computed.marginBottom, o.marginLeft = t.computed.marginLeft, o.marginRight = t.computed.marginRight, o.padding = o.border = o.borderSpacing = 0, o.fontSize = "1em", o.position = "static", o.cssFloat = t.computed.cssFloat, t.node.parentNode.insertBefore(t.clone, e)
    }

    function v(t) {
        t.clone.parentNode.removeChild(t.clone), t.clone = undefined
    }

    function m(t) {
        var e = getComputedStyle(t),
            o = t.parentNode,
            n = getComputedStyle(o),
            r = t.style.position;
        t.style.position = "relative";
        var a = {
                top: e.top,
                marginTop: e.marginTop,
                marginBottom: e.marginBottom,
                marginLeft: e.marginLeft,
                marginRight: e.marginRight,
                cssFloat: e.cssFloat,
                display: e.display
            },
            s = {
                top: i(e.top),
                marginBottom: i(e.marginBottom),
                paddingLeft: i(e.paddingLeft),
                paddingRight: i(e.paddingRight),
                borderLeftWidth: i(e.borderLeftWidth),
                borderRightWidth: i(e.borderRightWidth)
            };
        t.style.position = r;
        var d = {
                position: t.style.position,
                top: t.style.top,
                bottom: t.style.bottom,
                left: t.style.left,
                right: t.style.right,
                width: t.style.width,
                marginTop: t.style.marginTop,
                marginLeft: t.style.marginLeft,
                marginRight: t.style.marginRight
            },
            l = w(t),
            p = w(o),
            u = {
                node: o,
                css: {
                    position: o.style.position
                },
                computed: {
                    position: n.position
                },
                numeric: {
                    borderLeftWidth: i(n.borderLeftWidth),
                    borderRightWidth: i(n.borderRightWidth),
                    borderTopWidth: i(n.borderTopWidth),
                    borderBottomWidth: i(n.borderBottomWidth)
                }
            };
        return {
            node: t,
            box: {
                left: l.win.left,
                right: B.clientWidth - l.win.right
            },
            offset: {
                top: l.win.top - p.win.top - u.numeric.borderTopWidth,
                left: l.win.left - p.win.left - u.numeric.borderLeftWidth,
                right: -l.win.right + p.win.right - u.numeric.borderRightWidth
            },
            css: d,
            isCell: "table-cell" == e.display,
            computed: a,
            numeric: s,
            width: l.win.right - l.win.left,
            height: l.win.bottom - l.win.top,
            mode: -1,
            inited: !1,
            parent: u,
            limit: {
                start: l.doc.top - s.top,
                end: p.doc.top + o.offsetHeight - u.numeric.borderBottomWidth - t.offsetHeight - s.top - s.marginBottom
            }
        }
    }

    function y(t) {
        for (var e = 0; t;) e += t.offsetTop, t = t.offsetParent;
        return e
    }

    function w(t) {
        var o = t.getBoundingClientRect();
        return {
            doc: {
                top: o.top + e.pageYOffset,
                left: o.left + e.pageXOffset
            },
            win: o
        }
    }

    function b() {
        W = setInterval(function() {
            !p() && S()
        }, 500)
    }

    function x() {
        clearInterval(W)
    }

    function $() {
        z && (document[R] ? x() : b())
    }

    function C() {
        z || (r(), f(), e.addEventListener("scroll", a), e.addEventListener("wheel", s), e.addEventListener("resize", S), e.addEventListener("orientationchange", S), t.addEventListener(q, $), b(), z = !0)
    }

    function S() {
        if (z) {
            h();
            for (var t = E.length - 1; t >= 0; t--) E[t] = m(E[t].node);
            f()
        }
    }

    function A() {
        e.removeEventListener("scroll", a), e.removeEventListener("wheel", s), e.removeEventListener("resize", S), e.removeEventListener("orientationchange", S), t.removeEventListener(q, $), x(), z = !1
    }

    function I() {
        A(), h()
    }

    function k() {
        for (I(); E.length;) E.pop()
    }

    function O(t) {
        for (var e = E.length - 1; e >= 0; e--)
            if (E[e].node === t) return;
        var o = m(t);
        E.push(o), z ? u(o) : C()
    }

    function T(t) {
        for (var e = E.length - 1; e >= 0; e--) E[e].node === t && (c(E[e]), E.splice(e, 1))
    }
    var P, W, E = [],
        z = !1,
        B = t.documentElement,
        L = function() {},
        R = "hidden",
        q = "visibilitychange";
    t.webkitHidden !== undefined && (R = "webkitHidden", q = "webkitvisibilitychange"), e.getComputedStyle || o();
    for (var H = ["", "-webkit-", "-moz-", "-ms-"], N = document.createElement("div"), j = H.length - 1; j >= 0; j--) {
        try {
            N.style.position = H[j] + "sticky"
        } catch (F) {}
        "" != N.style.position && o()
    }
    r(), e.Stickyfill = {
        stickies: E,
        add: O,
        remove: T,
        init: C,
        rebuild: S,
        pause: A,
        stop: I,
        kill: k
    }
}(document, window), window.jQuery && (window.jQuery.fn.Stickyfill = function() {
    return this.each(function() {
        Stickyfill.add(this)
    }), this
}), API.onError = function(t) {
    var e = $("<ul>", {
            "class": "errors"
        }),
        o = $(".cart_form"),
        n = $(".product-form");
    $.each(t, function(t, o) {
        e.append($("<li>").html(o))
    }), o.length > 0 ? (o.find(".errors").remove(), o.prepend(e), $("html, body").animate({
        scrollTop: 0
    }, "fast")) : n.length > 0 && (n.find(".errors").hide(), n.prepend(e))
};
var processUpdate = function(t, e, o, n) {
        var i = Format.money(n.total, !0, !0),
            r = n.item_count;
        return 0 == r ? $(".cart_form").slideUp("fast", function() {
            $(".cart_empty_message").fadeIn("fast"), $("h1").html("Your bag is empty"), $(".cart_value").fadeOut("fast"), $(".cart_value").html("0"), $("html, body").animate({
                scrollTop: 0
            }, "fast")
        }) : ($(".errors").hide(), $(".cart_info h3 > span").html(i), $(".cart_value").fadeIn("fast"), $(".cart_value").html(r), t.val(o)), o > 0 || $('.cart_item[data-cart-id="' + e + '"]').slideUp("fast"), !1
    },
    updateCart = function(t) {
        var e = t.item_count;
        $(".cart_value").fadeIn("fast"), $(".cart_value").html(e), $(".mini_cart").removeClass("empty");
        var o = $(".cart_holder"),
            n = $(window).width();
        o.load("/cart?" + $.now() + " .cart_holder > *", function() {
            n > 800 && ($(".mini_cart").is(":visible") || $(".mini_cart").fadeIn("fast"))
        })
    },
    inPreview = /http(s?):\/\/draft-+\w+\.bigcartel\.(test|biz|com)/.test(window.origin) || /\/admin\/design/.test(top.location.pathname);
if (inPreview) var timeout_start = 1e3;
else timeout_start = 1;
var center_featured_categories = function() {
    $(".featured_categories li").each(function() {
        var t = $(this).find("a"),
            e = $(this).find("img"),
            o = new Image;
        o.src = e.attr("src"), o.onload = function() {
            t.css("height", t.width() + "px"), e.centerImage()
        }
    })
};
$(function() {
    $(".page-home").length && (0 == $(".page-home").children().length && $(".page-home").addClass("home-empty"));
    if ($(".cart_info").Stickyfill(), $(".category_select").change(function() {
            document.location.href = $(this).val()
        }), $(".qty").click(function() {
            var t = $(this),
                e = $(this).parent().find("input"),
                o = parseInt(e.val()),
                n = 99,
                i = 1,
                r = $(this).parent().data("cart-id");
            if (isNaN(o) || o < i) var a = i;
            else if (o > n) a = n;
            if ("plus" == t.data("func")) {
                if (o < n) a = o + 1
            } else if (o > i) a = o - 1;
            a > 0 ? Cart.updateItem(r, a, function(t) {
                processUpdate(e, r, a, t)
            }) : Cart.removeItem(r, function(t) {
                processUpdate(e, r, 0, t)
            })
        }), $(".welcome_text").length) new Waypoint({
        element: $(".welcome_text"),
        handler: function(t) {
            Waypoint.viewportWidth() > 765 && ("down" === t ? $(".welcome_text").addClass("fade_out") : $(".welcome_text").removeClass("fade_out"))
        },
        offset: 120
    });
    if ($(".content").length) new Waypoint({
        element: $(".content"),
        handler: function(t) {
            var e = Waypoint.viewportWidth();
            $(".welcome_image").length && e > 765 && ("down" === t ? $("header").addClass("background_overlay") : $("header").removeClass("background_overlay"))
        },
        offset: 88
    });
    $(".qty_holder input").blur(function() {
        var t = $(this).parent().data("cart-id"),
            e = $(this).val(),
            o = $(this);
        Cart.updateItem(t, e, function(n) {
            processUpdate(o, t, e, n)
        })
    }), $(".open_menu a, .open_search a").click(function() {
        return $("body").addClass("overlay_open"), $(".overlay").addClass("open"), !1
    }), $(".open_search a").click(function() {
        return $("body").addClass("overlay_open"), $(".overlay").addClass("search"), $("#search").focus(), !1
    }), $(".open_menu a").click(function() {
        return $("body").addClass("overlay_open"), $(".overlay").addClass("navigation"), !1
    }), $(".open_cart a").click(function() {
        return $(".mini_cart").fadeToggle(), !1
    }), $(".close_overlay").click(function() {
        $(".overlay").removeClass("open navigation search"), $("body").removeClass("overlay_open")
    }), $(".product_thumbnails li a").click(function(t) {
        return t.preventDefault(), $(".primary_image").attr("src", $(this).attr("href")), $(".product_thumbnails li").removeClass("active"), $(this).parent().addClass("active"), !1
    }), $(".product-form").submit(function(t) {
        t.preventDefault();
        var e = $(this).find("#quantity").val(),
            o = $(this).find("#option").val(),
            n = $(this).find(".add-to-cart-button"),
            i = $(this).find(".status_text"),
            r = i.html(),
            a = n.data("added-text"),
            s = n.data("adding-text");
        console.log(i), console.log(s), i.html(s), Cart.addItem(o, e, function(t) {
            i.html(a), $(".errors").length && $(".errors").hide(), updateCart(t)
        }), setTimeout(function() {
            i.clone().appendTo(n).html(r).hide(), n.find("span").first().remove(), n.find("span").first().fadeIn(400), n.blur()
        }, 800)
    });
    var t = $(".featured_categories > li").length;
    switch ($(".product_list > li").length < 4 && $(".product_list").addClass("justify_center"), t) {
        case 1:
            $(".featured_categories").remove();
            break;
        case 2:
            $(".featured_categories").addClass("two_categories");
            break;
        case 3:
            $(".featured_categories").addClass("three_categories");
            break;
        case 4:
            $(".featured_categories").addClass("four_categories");
            break;
        case 5:
            $(".featured_categories").addClass("five_categories");
            break;
        case 6:
            $(".featured_categories").addClass("six_categories");
            break;
        case 7:
            $(".featured_categories").addClass("seven_categories");
            break;
        case 8:
            $(".featured_categories").addClass("eight_categories");
            break;
        case 9:
            $(".featured_categories").addClass("nine_categories");
            break;
        case 10:
            $(".featured_categories").addClass("ten_categories")
    }
}), $(document).on("keyup", function(t) {
    27 == t.keyCode && ($("body").removeClass("overlay_open"), $(".overlay").removeClass("open").removeClass("navigation search"), $(".mini_cart").is(":visible") && $(".mini_cart").fadeOut())
}), $(document).click(function(t) {
    var e = $(".mini_cart");
    $(".add-to-cart-button").is(t.target) || $(".status_text").is(t.target) || e.is(t.target) || 0 !== e.has(t.target).length || e.is(":visible") && e.fadeOut()
}), $(document).ready(function() {
    setTimeout(function() {
        center_featured_categories()
    }, timeout_start)
}), $(window).on("load resize", function() {
    center_featured_categories(), $("body").css("margin-bottom", $(".footer").outerHeight())
});
var isGreaterThanZero = function(t) {
    return t > 0
};
Array.prototype.equals = function(t) {
    if (!t) return !1;
    if (this.length != t.length) return !1;
    for (var e = 0, o = this.length; e < o; e++)
        if (this[e] instanceof Array && t[e] instanceof Array) {
            if (!this[e].equals(t[e])) return !1
        } else if (this[e] != t[e]) return !1;
    return !0
}, Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
    value: function(t, e) {
        function o(t, e) {
            return t === e || "number" == typeof t && "number" == typeof e && isNaN(t) && isNaN(e)
        }
        if (null == this) throw new TypeError('"this" is null or not defined');
        var n = Object(this),
            i = n.length >>> 0;
        if (0 === i) return !1;
        for (var r = 0 | e, a = Math.max(r >= 0 ? r : i - Math.abs(r), 0); a < i;) {
            if (o(n[a], t)) return !0;
            a++
        }
        return !1
    }
}), Array.prototype.count = function(t) {
    return this.reduce((e, o) => t(o) ? e + 1 : e, 0)
}, $(".product_option_select").on("change", function() {
    enableAddButton($(this).find("option:selected").attr("data-price"))
});