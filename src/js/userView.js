/**
 * Created by Lenovo1 on 19/12/15.
 */
var users = require('../../src/js/users.js');
//var build = require('../../src/js/build.js');

var userView = (function(user){

        var myUesrs = users.getUsers();

        return h('div.row', {
            key: user.id,
            style: {
                opacity: '0', transform: 'translate(-200px)',
                delayed: {transform: 'translateY(' + user.offset + 'px)', opacity: '1'},
                remove: {opacity: '0', transform: 'translateY(' + user.offset + 'px) translateX(200px)'}
            },
            hook: {
                insert: function insert(vnode) {
                    user.elmHeight = vnode.elm.offsetHeight;
                }
            }
        }, [h('img', {props: {src: user.img, width: 100, height: 100},
            style: {float: 'left', marginRight: 8 + "px"}}),
            h('div', {style: {fontWeight: 'bold', float: 'left'}}, "Name : " + user.username),
            h('div', {style: {fontWeight: 'bold', float: 'left'}}, "Id: " + user.id),
            h('div' ,{style: {fontWeight: 'bold', position: 'absolute', bottom:60+"px" , left:123+"px"}}, "Followers: " + user.userFollowers),
            h('a', {
                props: {href: user.site, target: "_blank"},
                style: {position: 'absolute', bottom: 16 + "px", left: 123 + "px"}
            }, user.site),
            h('img#like', { // the click buttom not change at the second time - maybe to use btn instead ?
                props: {src: ("../../img/face.png"), width: 40, height: 40},
                style: {position: 'absolute', bottom: 10 + "px", right: 10 + "px", cursor: 'pointer'} ,on: {click: likeUser }}),
            h('div.btn.rm-btn', {on: {click: [users.remove, user]}}, 'x')]);

}());

