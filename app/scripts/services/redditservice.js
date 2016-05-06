'use strict';

/**
 * @ngdoc service
 * @name topFiveReduxApp.redditService
 * @description
 * # redditService
 * Factory in the topFiveReduxApp.
 */
angular.module('topFiveReduxApp')
  .factory('redditService', function ($resource) {

    // Public API here
    return $resource('https://www.reddit.com/r/:subreddit/top/.json?sort=top&t=:range', {}, {
      search: {
        method: 'GET',
        params: {
          subreddit: 'soccer',
          range: 'today',
        },
        isArray:false
      }
    });
  });
