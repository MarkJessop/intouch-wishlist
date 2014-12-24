'use strict';

var app = angular.module('wishlist',['ui.bootstrap', 'ngRoute', 'angular-flash.service', 'angular-flash.flash-alert-directive']);


app.controller('UserProfileController', function($http, $scope, $routeParams, flash){
    $scope.user = {};
    $scope.card = {};

    $http({
       method: 'GET',
        url: 'http://localhost:3000/user/' + $routeParams.user_id
    })
        .success(function(data){
           $scope.user = data;
            $scope.card = data.card[0];
        });

    $scope.updateUser = function(user){
        $http({
            method: 'PUT',
            url: 'http://localhost:3000/user/' + $routeParams.user_id,
            data: $.param({
                user: user
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        })
            .success(function(data){
                $scope.user = data;
                $scope.userForm.$setPristine();
                flash.success = "User information has been updated"
            })
            .error(function(data){
                flash.error = "There was a problem updating user information"
            })
    }

    $scope.updateCard = function(user, card) {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/user/' + $routeParams.user_id + '/card',
            data: $.param({
                number: card.number,
                exp_month: card.exp_month,
                exp_year: card.exp_year,
                cvc: card.cvc,
                name: card.name
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        }).success(function(data){
            $scope.card = data;
            $scope.cardForm.$setPristine();
            flash.success = "CC information has been updated"
        })

            .error(function(err){
                flash.error = err.error
            })
    }
});


app.controller('WishlistController', function($http, $scope, flash,  $routeParams){
    $scope.items = [];
    $scope.partitionedItems = [];


    $http({
        method: 'GET',
        url: 'http://localhost:3000/user/markj/items'
    })
    .success(function(data){
        $scope.items = data
        $scope.partitionedItems = partition($scope.items, 4);
    });

    $scope.addItemToWishlist = function (item) {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/user/markj/items',
            data: $.param({
                price: item.price,
                amazon_id: item.amazon_id
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        })
            .success(function(data){
                $scope.items.push(data);
                $scope.partitionedItems = partition($scope.items, 4);
                $scope.itemForm.$setPristine();
                $scope.item.price = 0.00;
                $scope.item.amazon_id = "";
            })
    };

    $scope.buyItem = function(item, index) {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/user/markj/items/' + item._id + '/buy'
        })
            .success(function(data){
                flash.success = "Item has been purchased.  Your CC has been charged for $" + item.current_price

                //Remove item after purchase
                $http({
                    method: 'DELETE',
                    url: 'http://localhost:3000/user/markj/items/' + item._id
                })
                    .success(function(data){
                        $scope.items.splice(index, 1);
                        $scope.partitionedItems = partition($scope.items, 4);
                    })

            })
            .error(function(err){
                flash.error = err.error;
            })

    };
});


app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/wishlist', {
                templateUrl: 'partials/wishlist.html',
                controller: 'WishlistController'
            })
            .when('/:user_id/profile', {
                templateUrl: 'partials/user-profile.html',
                controller: 'UserProfileController'
            })
            .otherwise({
                redirectTo: '/wishlist'
            });
    }
]);


