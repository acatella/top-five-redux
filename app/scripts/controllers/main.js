'use strict';

/**
 * @ngdoc function
 * @name topFiveReduxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the topFiveReduxApp
 */
angular.module('topFiveReduxApp')
  .controller('MainCtrl', function ($scope,$sce, redditService) {

    //right now this executes on load
    //wrap it in a function to have it trigged on click
    $scope.allposts = redditService.search().$promise.then(function(data) {
      var gifs = [];
      var posts = data.data.children;
      var counter = 0;
      for (var i = 0; i < posts.length; i++) {
        if (!posts[i].data.domain.search('streamable')) {
          counter++;
          var post = posts[i];
          gifs.push(post);

          // gets unique ID for each streamable link
          var urlArray = post.data.url.split('/');
          var uniqueID = urlArray[urlArray.length-1];

          // add property for comments href to posts[i].data
          post.commentLink = 'https://www.reddit.com' + post.data.permalink;

          // add property for cdn link to thumbnail to posts[i].data
          post.thumbnail = 'https://cdn.streamable.com/image/' + uniqueID + '.jpg';

          // add property for cdn link to thumbnail to posts[i].data
          post.videoSource = 'https://cdn.streamable.com/video/mp4/' + uniqueID + '.mp4';

          // add counter property to post opbject
          post.counter = counter;

          //TODO convert post.data.created to a date object to show in view
        }
      }
      $scope.gifs = gifs;

    });

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.reOrder = function(post, index) {
      var tmp = post;
      $scope.gifs.splice(index,1);
      $scope.gifs.unshift(tmp);
    };

  });
