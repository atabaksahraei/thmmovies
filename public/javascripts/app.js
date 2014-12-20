/**
 * Created by atabaksahraei on 13/12/14.
 */
var app = angular.module('thmmovies', []);

app.config(function ( $httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";

});

app.controller('test', function ($scope, $http) {

var query = "g.V('Brad Pitt').In('name').In('/film/performance/actor').In('/film/film/starring').Out('name').All()"
    $http.post('/graph',{"cmd": query}).
        success(function(data) {
            $scope.results = data.result;
        }).error(function(data){
            $scope.results = "Falsch";
        });
});