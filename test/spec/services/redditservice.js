'use strict';

describe('Service: redditService', function () {

  // load the service's module
  beforeEach(module('topFiveReduxApp'));

  // instantiate service
  var redditService;
  beforeEach(inject(function (_redditService_) {
    redditService = _redditService_;
  }));

  it('should do something', function () {
    expect(!!redditService).toBe(true);
  });

});
