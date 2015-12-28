/**
 * Created by Lenovo1 on 17/12/15.
 */


var users = require('../../src/js/users.js');
var build = require('../../src/js/build.js');


var errors = (function(){


    var index = 0;

    var errors =[];

    function increaseIndex(){
        index++;
    }

    function remove(error) {  //not delete the last error
            errors = errors.filter(function (m) {
                return m !== error } );
        build.render();
    }

    function error(){
        errors[index] = {username : users.username , elmHeight:20+"px" , index : index};
        increaseIndex();
    }

    return {
        error : error,

        errorArray : errors,

        remove : remove
    }
}());

module.export = errors;