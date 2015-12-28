/**
 * Created by Lenovo1 on 19/12/15.
 */

var errors = require('../../src/js/errors.js');


var errorView = (function(error){
    return h('div.row', {
        key: error.index,
        style: {
            opacity: '0', transform: 'translate(-200px)',
            delayed: {transform: 'translateY(' + error.offset + 'px)', opacity: '1'},
            remove: {opacity: '0', transform: 'translateY(' + error.offset + 'px) translateX(200px)'}
        },
        hook: {
            insert: function insert(vnode) {
                error.elmHeight = vnode.elm.offsetHeight;
            }
        }
    }, [ h('img' ,{props: {src: ("../../img/warning.png"), width: 40, height: 40},
        style: {float: 'left' , marginRight: 8+"px"}} ),
        h('p' ,  "Error Fetching " +'"'+error.username+'"'+" from Github - User Not Found! "),
        h('img#remove', {
                props: {src: ("../../img/delete.png"), width: 30, height: 30},
                style: {position: 'absolute', top: 25 + "px", right: 20 + "px", cursor: 'pointer'} ,
                on: {click: [errors.remove(), error] }}
        )
    ])
}());

module.export =  errorView;

