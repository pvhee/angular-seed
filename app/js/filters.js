'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('camelCase', function() {
    return function(input) {
      return input.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
      });
    };
  })
  .filter('formatEuro', function() {
    return function(input) {
      if (input) {
      // We use d3 for formatting
        var si = d3.format(".2s");
        return si(input).replace(/G/, 'B');
      }
    };
  });




