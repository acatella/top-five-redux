'use strict';

/**
 * @ngdoc function
 * @name topFiveReduxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the topFiveReduxApp
 */
angular.module('topFiveReduxApp')
  .controller('MainCtrl', function ($scope, redditService) {

    //right now this executes on load
    //wrap it in a function to have it trigged on click
    $scope.allposts = redditService.search().$promise.then(function(data) {
      var gifs = [];
      console.log(data);
      var posts = data.data.children;
      for (var i = 0; i < posts.length; i++) {
        if (!posts[i].data.domain.search('streamable')) {
          gifs.push(posts[i]);
        }
      }
      $scope.gifs = gifs;
      console.log($scope.gifs);
    });

    $scope.reOrder = function(post, index) {
      var tmp = post;
      $scope.gifs.splice(index,1);
      $scope.gifs.unshift(tmp);
    };

  });
