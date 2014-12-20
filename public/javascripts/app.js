/**
 * Created by atabaksahraei on 13/12/14.
 */
var app = angular.module('thmmovies', []);

app.config(function ( $httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";

});

app.controller('test', function ($scope, $http) {


    $http.post('/graph',{"cmd": "g.V('Seven').In('name').All()"}).
        success(function(data) {
            $scope.result = data;
        }).error(function(data){
            $scope.result = "Falsch";
        });
});