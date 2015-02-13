/**
 * Created by admin on 2/13/15.
 */

angular.module('MyApp').
    filter('fromNow',function(){
        return function(date){
            return moment(date).fromNow();
        }
    });
