var config = require('./config');
module.exports = {
    forEach: function (obj, iterator, context) {
        if (obj instanceof Array) {
            for (var i = 0; i < obj.length; i++)
                iterator.call(context, obj[i], i);
        }
        else if (obj instanceof Object) {
            for (var key in obj)
                iterator.call(context, obj[key], key);
        }
        return obj;
    },
    getEventElement: function (event) {
        event = event || window.event;
        return event.srcElement || event.target;
    },
    stopEvent: function (event) {
        !!event.preventDefault ? event.preventDefault() : (event.returnValue = !1);
        !!event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = !0);
    },
    delegate: function (elem, type, classname, handler) {
        this.addEvent(elem, type, this.bind(this, function (e) {
            var target = this.getEventElement(e);
            if(this.hasClass(target, classname)) {
                handler(e, target);
            }
        }));
    },
    addEvent: document.addEventListener ?
        function (elem, type, handler, opt_isCapture) {
            elem.addEventListener(type, handler, opt_isCapture);
        } :
        function (elem, type, handler, opt_isCapture) {
            elem.attachEvent('on' + type, handler);
        },
    delEvent: document.removeEventListener ?
        function (elem, type, handler, opt_isCapture) {
            elem.removeEventListener(type, handler, opt_isCapture);
        } :
        function (elem, type, handler, opt_isCapture) {
            elem.detachEvent('on' + type, handler);
        },
    bind: function (self, fn) {
        var curryArgs = arguments.length > 2 ? [].slice.call(arguments, 2) : [];
        if (typeof(fn) === 'function' && !(fn instanceof RegExp)) {
            return curryArgs.length ? function () {
                return arguments.length ? fn.apply(self, curryArgs.concat([].slice.call(arguments, 0))) : fn.apply(self, curryArgs);
            } : function () {
                return arguments.length ? fn.apply(self, arguments) : fn.call(self);
            };
        }
        else {
            return fn;
        }
    },
    log: function (content) {
        if (window.console && config.debug) {
            console.log(typeof(content) == 'string' ? content : JSON.stringify(content));
        }
    },
    isString: function (p) {
        return this.typeOf(p) == 'string';
    },
    isArray: function (data) {
        return this.typeOf(data) === 'array';
    },
    isObject: function (o) {
        return this.typeOf(o) == 'object';
    },
    isEmail: function (email) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(email);
    },
    isAndroid: function () {
        return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
    },
    isIOS: function () {
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    typeOf: function (o) {
        return o === null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase();
    },
    loadJS: function (src) {
        var n = document.getElementsByTagName('script')[0];
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = false;
        s.src = src;
        n.parentNode.insertBefore(s, n);
    },
    loadCSS: function (src) {
        var n = document.getElementsByTagName('script')[0];
        var s = document.createElement("link");
        s.setAttribute("rel", "stylesheet");
        s.setAttribute("type", "text/css");
        s.setAttribute("href", src);
        n.parentNode.insertBefore(s, n);
    },
    getQueryString: function (searchUrl, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = searchUrl.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    ajax: function (url, params, method, callback) {
        var that = this;
        var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = that.jsonParse(xmlhttp.responseText);
                callback(data);
            }
        }
        xmlhttp.open(method, url, true);
        if(method == 'POST') {
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
        }
        xmlhttp.send(params);
    },
    get: function (url, params, callback) {
        var _tail = this.formatParams(params);
        if (_tail.length > 0) {
            url = url + '?' + _tail;
        }
        this.ajax(url, null, 'GET', callback);
    },
    post: function (url, params, callback) {
        this.ajax(url, JSON.stringify(params), 'POST', callback);
    },
    formatParams: function (data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        return arr.join("&");
    },
    strToDom: function (str) {
        var objE = document.createElement("div");
        objE.innerHTML = str;
        return objE.childNodes;
    },
    hasClass: function (obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function (obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    },
    removeClass: function (obj, cls) {
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
            obj.className = obj.className.replace(/(^\s*)|(\s*$)/g, "");
        }
    },
    trim: function (str) {
        return (str || '').replace(/(^\s*)|(\s*$)/g, "");
    },
    toggleClass: function (obj, cls) {
        if (this.hasClass(obj, cls)) {
            this.removeClass(obj, cls);
        } else {
            this.addClass(obj, cls);
        }
    },
    jsonParse: function (objstr) {
        return JSON.parse ? JSON.parse(objstr) : eval('(' + objstr + ')');
    },
    getId: function (id) {
        return document.getElementById(id || '');
    },
    getTag: function (tag, context, istoarray) {
        var _tags = (context || document).getElementsByTagName(tag || '');
        if(istoarray) {
            _tags = this.toArray(_tags);
        }
        return _tags;
    },
    css: function (dom, cssstyle) {
        return window.getComputedStyle(dom)[cssstyle];
    },
    noop: function () {

    },
    getDomain: function (url) {
        return url.match(/https?:\/\/([^\/]+)\//i)[0];
    },
    toArray: function (s) {
        try{
            return Array.prototype.slice.call(s);
        } catch(e){
            var arr = [];
            for(var i = 0,len = s.length; i < len; i++){
                arr[i] = s[i];
            }
            return arr;
        }
    }
}





