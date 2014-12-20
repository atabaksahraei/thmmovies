/**
 * Created by atabaksahraei on 13/12/14.
 */
var app = angular.module('thmmovies', []);

app.config(function ( $httpProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";

});

app.controller('test',['$scope', '$http', function ($scope, $http) {
    $scope.keyword_visibility = 'hidden';
    $scope.keywordPicture_visibility = 'hidden';
    $scope.thmlocation_visibility = 'hidden';

    $scope.newKeyWord=function(item)
    {
        console.info(item);
        $scope.keyword = item.name;
        $scope.runQuery();
    }

    $scope.runQuery=function()
    {
        //Get Type of the item
        $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('type').All()"}).
            success(function (data) {
                $scope.subscription = "";
                if (data != null && data.result != null && data.result.length > 0) {
                    $scope.keyword_visibility = 'visible';
                    $scope.type = data.result[0].id;
                    $scope.keywordType =  $scope.type;
                    if ( $scope.type == '/people/person') {
                        $scope.keywordType = "is a Person";
                    } else if ( $scope.type == '/film/film') {
                        $scope.keywordType = "is a Film";
                        $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('/film/film/directed_by').Out('name').All()"}).
                            success(function (data) {
                                if (data != null && data.result != null && data.result.length > 0) {
                                    $scope.subscription = "created by " + data.result[0].id;
                                }
                            });
                    }else{
                        $scope.keywordType = "";
                        $scope.type = "";
                        $scope.subscription = "";
                    }
                }else{
                    $scope.keywordType = "";
                    $scope.subscription = "";
                    $scope.keyword_visibility = 'hidden';

                }
            });


        //Get Picture of The Item
        $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('hasPicture').All()"}).
            success(function (data) {
                if (data != null && data.result != null && data.result.length > 0) {
                   $scope.keywordPicture = data.result[0].id;
                    $scope.keywordPicture_visibility = 'visible';
                }else{
                    $scope.keywordPicture = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjE4OS42NTYyNSIgeT0iMjUwIiBzdHlsZT0iZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjIzcHQ7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+NTAweDUwMDwvdGV4dD48L2c+PC9zdmc+";
                    $scope.keywordPicture_visibility = 'hidden';

                }
            });

        //Get THm Libary information
        $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('/thmlib/film/').Out('name').All()"}).
            success(function (data) {
                if (data != null && data.result != null && data.result.length > 0) {
                    $scope.thmlocation_visibility = 'visible';
                    $scope.thmlocation_shelf = data.result[0].id;

                    $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('/thmlib/film/').Out('/thm/structure/room').Out('name').All()"}).
                        success(function (data) {
                            if (data != null && data.result != null && data.result.length > 0) {
                                $scope.thmlocation_room = data.result[0].id;
                            } else {
                                $scope.thmlocation_room = "";

                            }
                        });

                    $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('/thmlib/film/').Out('/thm/structure/room').Out('/thm/structure/').Out('name').All()"}).
                        success(function (data) {
                            if (data != null && data.result != null && data.result.length > 0) {
                                $scope.thmlocation_location = data.result[0].id;
                            } else {
                                $scope.thmlocation_location = "";

                            }
                        });

                }else{
                    $scope.thmlocation_visibility = 'hidden';
                    $scope.thmlocation_shelf ="";

                }
            });

            //Get All Stars in The Film
            $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').Out('/film/film/starring').Out('/film/performance/actor').Out('name').All()"}).
                success(function (data) {
                    if (data != null && data.result != null && data.result.length > 0) {
                        var filmstarts_ = new Array();
                        angular.forEach(data.result, function(value, key) {
                            var filmstar = {};
                            filmstar.name = value.id;
                            $http.post('/graph', {"cmd": "g.V('" + filmstar.name + "').In('name').Out('hasPicture').All()"}).
                                success(function (data) {
                                    if (data != null && data.result != null && data.result.length > 0) {
                                        filmstar.picture = data.result[0].id;
                                    }else{
                                        filmstar.picture = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjA0Njg3NSIgeT0iNzAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTBwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xNDB4MTQwPC90ZXh0PjwvZz48L3N2Zz4=";
                                    }
                                });

                            this.push(filmstar);
                        }, filmstarts_);

                        $scope.filmstarts = filmstarts_;
                        $scope.subtitel = "stars";

                    } else {
                        $scope.filmstarts = null;
                        $scope.subtitel = "";
                    }
                });


        //Get All Films From the Stars
        $http.post('/graph', {"cmd": "g.V('" + $scope.keyword + "').In('name').In('/film/performance/actor').In('/film/film/starring').Out('name').All()"}).
            success(function (data) {

                if (data != null && data.result != null && data.result.length > 0) {
                    var films_ = new Array();

                    angular.forEach(data.result, function(value, key) {
                        var film = {};
                        film.name = value.id;
                        $http.post('/graph', {"cmd": "g.V('" + film.name + "').In('name').Out('hasPicture').All()"}).
                            success(function (data) {
                                if (data != null && data.result != null && data.result.length > 0) {
                                    film.picture = data.result[0].id;
                                }else{
                                    film.picture = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjA0Njg3NSIgeT0iNzAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTBwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xNDB4MTQwPC90ZXh0PjwvZz48L3N2Zz4=";
                                }
                            });

                        this.push(film);
                    }, films_);

                    $scope.films = films_;
                    $scope.subtitel = "films";

                } else {
                    $scope.films = null;
                    $scope.subtitel = "";
                }
            });
    }
}]);