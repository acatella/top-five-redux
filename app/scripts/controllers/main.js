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

    $scope.refreshGifs = function(subreddit,range) {
      $scope.allposts = redditService.search({subreddit: subreddit,range: range}).$promise.then(function(data) {
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
  };

  // object contructor for dropdown menus
  function DropdownObject(displayText, queryValue) {
    this.text = displayText;
    this.value= queryValue;
  }

  // data model for subreddit dropdown
  var soccerSub = new DropdownObject('Soccer','soccer');
  var nbaSub = new DropdownObject('NBA Basketball','nba');

  $scope.subDropdown = {
    selected: soccerSub,
    options: [nbaSub],
    changeSub: function(sub,index) {
      this.options.push(this.selected);
      this.options.splice(index,1);
      this.selected = sub;
      $scope.refreshGifs(this.selected.value,$scope.rangeDropdown.selected.value);
    }
  };

  // data model for date range dropdown
  var todayRange = new DropdownObject('Today','today');
  var weekRange = new DropdownObject('Past Week','week');
  var monthRange =  new DropdownObject('Past Month','month');

  $scope.rangeDropdown = {
    selected: todayRange,
    options: [weekRange,monthRange],
    changeSub: function(range,index) {
      this.options.push(this.selected);
      this.options.splice(index,1);
      this.selected = range;
      $scope.refreshGifs($scope.subDropdown.selected.value,this.selected.value);
    }
  };


    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.reOrder = function(post, index) {
      var tmp = post;
      $scope.gifs.splice(index,1);
      $scope.gifs.unshift(tmp);
    };

  });
