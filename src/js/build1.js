(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    'use strict';

    var snabbdom = require('../../snabbdom.js');
    var patch = snabbdom.init([require('../../modules/class'),
        require('../../modules/props'), require('../../modules/style'),
        require('../../modules/eventlisteners')]);
    var h = require('../../h.js');
    var users = require('../../src/js/user.js');
    var userView = require('../../src/js/userView.js');
    var errorView = require('../../src/js/errorView.js');
    var errors = require('../../src/js/error.js');



var main = (function(){

    var vnode,

        margin = 8,

        totalHeight = 0;



    function view(data) {
        return h('div',
            [
                h('h1', 'GitHub Users'),
                h('input', { on:  {input: users.user.enterUser() }}),
                h('a.btn.add', { on: { click: users.user.addUer() }}, 'Fetch!'),
                h('h2', "Hold tight!"),
                h('p.name' , "We're about to fetch: \"\""  ),
                h('div.list', { style: { height: totalHeight + 'px' } },
                    users.user.findUser() ===true ?  data.map(userView(user)) : data.map(errorView(error)))]);  // display all the users or the error to the view
    }


    function render() {

        if (users.user.findUser===true)
        {
            users.array = users.array.reduce(function (acc, m) {  //acc= previousValue , m = currentValue
                var last = acc[acc.length -1];
                m.offset = last ? last.offset + last.elmHeight + margin : margin;
                return acc.concat(m);
            }, []);
        }
        else
        {
            errors.array = errors.array.reduce(function (acc, m) {
                var last = acc[acc.length - 1];
                m.offset = last ? last.offset + last.elmHeight + margin : margin;
                return acc.concat(m);
            }, []);
        }

        totalHeight =  users.user.findUser===true ?
        users.array[data.length - 1].offset + users.array[data.length - 1].elmHeight :
        errors.array[errors.array.length - 1].offset + errors.array[errors.array.length - 1].elmHeight;

        vnode = users.user.findUser===true ?
            patch(vnode, view(users.array))  :  patch(vnode, view(errors.array)) ;
    }


    window.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('container');
        vnode = patch(container, findUser===true ?  view(data) : view(errors));
        render();
    }());

    return {
        render: render()
    }

});



    module.exports = main;

},{"../../h.js":2,"../../modules/class":4,"../../modules/eventlisteners":5,"../../modules/props":6,"../../modules/style":7,"../../snabbdom.js":8}],2:[function(require,module,exports){
    'use strict';

    var VNode = require('./vnode');
    var is = require('./is');

    module.exports = function h(sel, b, c) {
        var data = {},
            children,
            text,
            i;
        if (arguments.length === 3) {
            data = b;
            if (is.array(c)) {
                children = c;
            } else if (is.primitive(c)) {
                text = c;
            }
        } else if (arguments.length === 2) {
            if (is.array(b)) {
                children = b;
            } else if (is.primitive(b)) {
                text = b;
            } else {
                data = b;
            }
        }
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
            }
        }
        return VNode(sel, data, children, text, undefined);
    };

},{"./is":3,"./vnode":9}],3:[function(require,module,exports){
    'use strict';

    module.exports = {
        array: Array.isArray,
        primitive: function primitive(s) {
            return typeof s === 'string' || typeof s === 'number';
        } };

},{}],4:[function(require,module,exports){
    'use strict';

    function updateClass(oldVnode, vnode) {
        var cur,
            name,
            elm = vnode.elm,
            oldClass = oldVnode.data['class'] || {},
            klass = vnode.data['class'] || {};
        for (name in klass) {
            cur = klass[name];
            if (cur !== oldClass[name]) {
                elm.classList[cur ? 'add' : 'remove'](name);
            }
        }
    }

    module.exports = { create: updateClass, update: updateClass };

},{}],5:[function(require,module,exports){
    'use strict';

    var is = require('../is');

    function arrInvoker(arr) {
        return function () {
            arr[0](arr[1]);
        };
    }

    function updateEventListeners(oldVnode, vnode) {
        var name,
            cur,
            old,
            elm = vnode.elm,
            oldOn = oldVnode.data.on || {},
            on = vnode.data.on;
        if (!on) return;
        for (name in on) {
            cur = on[name];
            old = oldOn[name];
            if (old === undefined) {
                elm.addEventListener(name, is.array(cur) ? arrInvoker(cur) : cur);
            } else if (is.array(old)) {
                old[0] = cur[0]; // Deliberately modify old array since it's
                old[1] = cur[1]; // captured in closure created with `arrInvoker`
            }
        }
    }

    module.exports = { create: updateEventListeners, update: updateEventListeners };

},{"../is":3}],6:[function(require,module,exports){
    "use strict";

    function updateProps(oldVnode, vnode) {
        var key,
            cur,
            old,
            elm = vnode.elm,
            oldProps = oldVnode.data.props || {},
            props = vnode.data.props || {};
        for (key in props) {
            cur = props[key];
            old = oldProps[key];
            if (old !== cur) {
                elm[key] = cur;
            }
        }
    }

    module.exports = { create: updateProps, update: updateProps };

},{}],7:[function(require,module,exports){
    'use strict';

    var raf = requestAnimationFrame || setTimeout;
    var nextFrame = function nextFrame(fn) {
        raf(function () {
            raf(fn);
        });
    };

    function setNextFrame(obj, prop, val) {
        nextFrame(function () {
            obj[prop] = val;
        });
    }

    function updateStyle(oldVnode, vnode) {
        var cur,
            name,
            elm = vnode.elm,
            oldStyle = oldVnode.data.style || {},
            style = vnode.data.style || {},
            oldHasDel = ('delayed' in oldStyle);
        for (name in style) {
            cur = style[name];
            if (name === 'delayed') {
                for (name in style.delayed) {
                    cur = style.delayed[name];
                    if (!oldHasDel || cur !== oldStyle.delayed[name]) {
                        setNextFrame(elm.style, name, cur);
                    }
                }
            } else if (name !== 'remove' && cur !== oldStyle[name]) {
                elm.style[name] = cur;
            }
        }
    }

    function applyDestroyStyle(vnode) {
        var style,
            name,
            elm = vnode.elm,
            s = vnode.data.style;
        if (!s || !(style = s.destroy)) return;
        for (name in style) {
            elm.style[name] = style[name];
        }
    }

    function applyRemoveStyle(vnode, rm) {
        var s = vnode.data.style;
        if (!s || !s.remove) {
            rm();
            return;
        }
        var name,
            elm = vnode.elm,
            idx,
            i = 0,
            maxDur = 0,
            compStyle,
            style = s.remove,
            amount = 0;
        var applied = [];
        for (name in style) {
            applied.push(name);
            elm.style[name] = style[name];
        }
        compStyle = getComputedStyle(elm);
        var props = compStyle['transition-property'].split(', ');
        for (; i < props.length; ++i) {
            if (applied.indexOf(props[i]) !== -1) amount++;
        }
        elm.addEventListener('transitionend', function (ev) {
            if (ev.target === elm) --amount;
            if (amount === 0) rm();
        });
    }

    module.exports = { create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle };

},{}],8:[function(require,module,exports){
// jshint newcap: false
    'use strict';

    var VNode = require('./vnode');
    var is = require('./is');

    function isUndef(s) {
        return s === undefined;
    }

    function emptyNodeAt(elm) {
        return VNode(elm.tagName, {}, [], undefined, elm);
    }

    var emptyNode = VNode('', {}, [], undefined, undefined);

    var insertedVnodeQueue;

    function sameVnode(vnode1, vnode2) {
        return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
    }

    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i,
            map = {},
            key;
        for (i = beginIdx; i <= endIdx; ++i) {
            key = children[i].key;
            if (!isUndef(key)) map[key] = i;
        }
        return map;
    }

    function createRmCb(parentElm, childElm, listeners) {
        return function () {
            if (--listeners === 0) parentElm.removeChild(childElm);
        };
    }

    var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

    function init(modules) {
        var i,
            j,
            cbs = {};
        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = [];
            for (j = 0; j < modules.length; ++j) {
                if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }

        function createElm(vnode) {
            var i;
            if (!isUndef(i = vnode.data) && !isUndef(i = i.hook) && !isUndef(i = i.init)) {
                i(vnode);
            }
            if (!isUndef(i = vnode.data) && !isUndef(i = i.vnode)) vnode = i;
            var elm,
                children = vnode.children,
                sel = vnode.sel;
            if (!isUndef(sel)) {
                // Parse selector
                var hashIdx = sel.indexOf('#');
                var dotIdx = sel.indexOf('.', hashIdx);
                var hash = hashIdx > 0 ? hashIdx : sel.length;
                var dot = dotIdx > 0 ? dotIdx : sel.length;
                var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
                elm = vnode.elm = document.createElement(tag);
                if (hash < dot) elm.id = sel.slice(hash + 1, dot);
                if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
                if (is.array(children)) {
                    for (i = 0; i < children.length; ++i) {
                        elm.appendChild(createElm(children[i]));
                    }
                } else if (is.primitive(vnode.text)) {
                    elm.appendChild(document.createTextNode(vnode.text));
                }
                for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
                i = vnode.data.hook; // Reuse variable
                if (!isUndef(i)) {
                    if (i.create) i.create(vnode);
                    if (i.insert) insertedVnodeQueue.push(vnode);
                }
            } else {
                elm = vnode.elm = document.createTextNode(vnode.text);
            }
            return elm;
        }

        function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
            if (isUndef(before)) {
                for (; startIdx <= endIdx; ++startIdx) {
                    parentElm.appendChild(createElm(vnodes[startIdx]));
                }
            } else {
                var elm = before.elm;
                for (; startIdx <= endIdx; ++startIdx) {
                    parentElm.insertBefore(createElm(vnodes[startIdx]), elm);
                }
            }
        }

        function invokeDestroyHook(vnode) {
            var i = vnode.data.hook,
                j;
            if (!isUndef(i) && !isUndef(j = i.destroy)) j(vnode);
            for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
            if (!isUndef(vnode.children)) {
                for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j]);
                }
            }
        }

        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var i,
                    listeners,
                    rm,
                    ch = vnodes[startIdx];
                if (!isUndef(ch)) {
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(parentElm, ch.elm, listeners);
                    for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
                    invokeDestroyHook(ch);
                    if (ch.data.hook && ch.data.hook.remove) {
                        ch.data.hook.remove(ch, rm);
                    } else {
                        rm();
                    }
                }
            }
        }

        function updateChildren(parentElm, oldCh, newCh) {
            var oldStartIdx = 0,
                newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx, idxInOld, elmToMove;

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) {
                    // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode);
                    parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode);
                    parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    idxInOld = oldKeyToIdx[newStartVnode.key];
                    if (isUndef(idxInOld)) {
                        // New element
                        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        patchVnode(elmToMove, newStartVnode);
                        oldCh[idxInOld] = undefined;
                        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
                        newStartVnode = newCh[++newStartIdx];
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) addVnodes(parentElm, oldStartVnode, newCh, newStartIdx, newEndIdx);else if (newStartIdx > newEndIdx) removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }

        function patchVnode(oldVnode, vnode) {
            var i;
            if (!isUndef(i = vnode.data) && !isUndef(i = i.hook) && !isUndef(i = i.patch)) {
                i = i(oldVnode, vnode);
            }
            if (!isUndef(i = oldVnode.data) && !isUndef(i = i.vnode)) oldVnode = i;
            if (!isUndef(i = vnode.data) && !isUndef(i = i.vnode)) vnode = i;
            var elm = vnode.elm = oldVnode.elm,
                oldCh = oldVnode.children,
                ch = vnode.children;
            if (oldVnode === vnode) return;
            if (!isUndef(vnode.data)) {
                for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
                i = vnode.data.hook;
                if (!isUndef(i) && !isUndef(i = i.update)) i(vnode);
            }
            if (isUndef(vnode.text)) {
                if (!isUndef(oldCh) && !isUndef(ch)) {
                    if (oldCh !== ch) updateChildren(elm, oldCh, ch);
                } else if (!isUndef(ch)) {
                    addVnodes(elm, undefined, ch, 0, ch.length - 1);
                } else if (!isUndef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                }
            } else if (oldVnode.text !== vnode.text) {
                elm.childNodes[0].nodeValue = vnode.text;
            }
            return vnode;
        }

        return function (oldVnode, vnode) {
            var i;
            insertedVnodeQueue = [];
            if (oldVnode instanceof Element) {
                oldVnode = emptyNodeAt(oldVnode);
            }
            for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
            patchVnode(oldVnode, vnode);
            for (i = 0; i < insertedVnodeQueue.length; ++i) {
                insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
            }
            insertedVnodeQueue = undefined;
            for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
            return vnode;
        };
    }

    module.exports = { init: init };

},{"./is":3,"./vnode":9}],9:[function(require,module,exports){
    "use strict";

    module.exports = function (sel, data, children, text, elm) {
        var key = data === undefined ? undefined : data.key;
        return { sel: sel, data: data, children: children,
            text: text, elm: elm, key: key };
    };

},{}]},{},[1]);
