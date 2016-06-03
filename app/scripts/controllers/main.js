'use strict';
/*global $ */
/**
 * @ngdoc function
 * @name topFiveReduxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the topFiveReduxApp
 */

 //TODO: add a favorite view and favorite button that stores vids in angular local storgae
 //TODO: add a pause button overlay and full screen button overlay
 //TODO: add functionality to close dropdown when user clicks anywhere
 //TODO: add favicon and page title
 //TODO: add footer w/ link to my portfolio page and github for app
 
angular.module('topFiveReduxApp')
  .controller('MainCtrl', function ($scope,$sce, redditService) {

  // populates gifs for given subreddit and date range
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

            // converts epoch time into date opbject
            var postDate = new Date(post.data.created * 1000);
            post.postDay = postDate.getDate();
            post.postMonth = postDate.getMonth() + 1;
            post.postYear = postDate.getFullYear();

          }
        }
        $scope.gifs = gifs;
      });
  };

  // object contructor for dropdown menus
  function DropdownObject(displayText, queryValue, iconClass) {
    this.text = displayText;
    this.value = queryValue;
    this.icon = iconClass;
  }

  // data model for subreddit dropdown
  var soccerSub = new DropdownObject('Soccer','soccer','soccerIcon');
  var nbaSub = new DropdownObject('NBA Basketball','nba','basketballIcon');

  $scope.subDropdown = {
    selected: soccerSub,
    options: [nbaSub],
    visibility: 'hidden',
    toggleVis: function() {
      if (this.visibility === 'hidden') {
        this.visibility =  'visible';
      }
      else {this.visibility = 'hidden';}
    },
    changeSub: function(sub,index) {
      this.options.push(this.selected);
      this.options.splice(index,1);
      this.selected = sub;
      $scope.refreshGifs(this.selected.value,$scope.rangeDropdown.selected.value);
      this.toggleVis();
    }
  };

  // data model for date range dropdown
  var todayRange = new DropdownObject('Past 24 Hours','today','clockIcon');
  var weekRange = new DropdownObject('Past Week','week','clockIcon');
  var monthRange =  new DropdownObject('Past Month','month','clockIcon');

  $scope.rangeDropdown = {
    selected: todayRange,
    options: [weekRange,monthRange],
    visibility: 'hidden',
    toggleVis: function() {
      if (this.visibility === 'hidden') {
        this.visibility =  'visible';
      }
      else {this.visibility = 'hidden';}
    },
    changeSub: function(range,index) {
      this.options.push(this.selected);
      this.options.splice(index,1);
      this.selected = range;
      $scope.refreshGifs($scope.subDropdown.selected.value,this.selected.value);
      this.toggleVis();
    }
  };

  // Video playback controls to use custom button
  $scope.togglePlay = function($index) {
    var $video = $('video')[$index];
    var $mask = $('#mask' + $index);

    if ($video.paused) {
      $mask.addClass('mask-off');
      $video.play();
    }

    else {
      $video.pause();
      $mask.removeClass('mask-off');
    }
  };


    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

  });
