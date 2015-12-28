/**
 * Created by Lenovo1 on 17/12/15.
 */
var error = require('../../src/js/errors.js');
var build = require('../../src/js/build.js');

var users = (function(){

        var users = [] ,

        index = 0 ,

        userInfo  = {
            findUser: false ,
            name :  document.getElementsByTagName('input')[0].value,
            followers: 0
        } ;


    var addUser = function() {
        var url = "https://api.github.com/users/" +userInfo.name+ "/followers";
        var result = fetch(url);
        result.then(function (response) {
            return response.text()
        }).then(function (text) {
            searchUser(text);
            if(user.findUser === true){
                var url = "https://api.github.com/users/"+userInfo.name+"/followers";
                getFollowers(url);
            }
            else{
                    error.error();
            }
        }).catch(function (ex) {
            console.log('failed', ex)
        });
        return result;
    };


    function searchUser(json){
        userInfo.findUser = false;
        var data = JSON.parse(json).items;
        for (var i=0 ; i<data.length ; i++){
            if(data[i].login === userInfo.name){
                userInfo.findUser = true;
                user[index++]  = {id : data[i].id , username: data[i].login, img: data[i].avatar_url , site : data[i].html_url ,
                    userFollowers: userInfo.followers ,  elmHeight:30+"px"  };
                build.render();
                break;
            }
        }

    }

    function getFollowers(url){

        var result = fetch(url);

        result.then(function(response) {
            return response.text()

        }).then(function(text) {
            userInfo.followers = JSON.parse(text).length;
            console.log("Followers:"+userInfo.followers);

        }).catch(function(ex) {
            console.log('failed', ex)
        });

    }


    var enterUser = function (e)  {
        var username = e.target.value;
        var name = document.getElementsByClassName('name')[0];
        name.innerHTML  = "We're about to fetch: " +'"'+username+'"';
    };

    function remove(user) {  //not delete the last user
            users = users.filter(function (m) {
                return m !== user});
        build.render();
    }


    function likeUser(e){
        console.log("CHANGE SMILE!!!");
        e.target.src = "../../img/face.png" ? ("../../img/smiling.png") : ("../../img/face.png") ;
    }



    return {
        getUsers : users,

        enterUser : enterUser ,

        addUer: addUser,

        remove : remove ,

        likeUser : likeUser,

        findUser : userInfo.findUser,

        username : userInfo.name


    };
}());

module.export =  users;

