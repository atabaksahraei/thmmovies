/**
 * Created by atabaksahraei on 13/12/14.
 */
var app = angular.module('thmmovies', []);

app.config(function ( $httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

});

app.controller('test', function ($scope, $http) {

    $http.post('http://127.0.0.1:64210/api/v1/query/gremlin','g.V("Seven").In("name").All()').
        success(function(data) {
            $scope.result = data;
        }).error(function(data){
            $scope.result = "Falsch";
        });
});