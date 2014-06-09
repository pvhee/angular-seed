'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ProjectCtrl', ['projectService', '$scope', '$location', function(projectService, $scope, $location) {

    var initChoices = [
      'genomics'
    ];
    var idx = Math.floor(Math.random() * initChoices.length);

    // Initialize the scope defaults.
    $scope.projects = [];        // An array of project results to display
    $scope.page = 0;            // A counter to keep track of our current page
    $scope.allResults = false;  // Whether or not all results have been found.

    // Take the term from the URL or set the empty
    $scope.searchTerm = $location.search().q || '';

    /**
     * A fresh search. Reset the scope variables to their defaults, set
     * the q query parameter, and load more results.
     */
    $scope.search = function() {
      $scope.page = 0;
      $scope.projects = [];
      $scope.allResults = false;
      $location.search({'q': $scope.searchTerm});
      $scope.loadMore();
    };

    $scope.filter = function() {
      $scope.projects = [];

      projectService.filter('ES').then(function(results) {


        console.log(results);

        if(results.length !== 10){
          $scope.allResults = true;
        }
        var ii = 0;
        for(;ii < results.length; ii++){
          $scope.projects.push(results[ii]);
        }
      });
    }

    /**
     * Load the next page of results, incrementing the page counter.
     * When query is finished, push results onto $scope.recipes and decide
     * whether all results have been returned (i.e. were 10 results returned?)
     */
    $scope.loadMore = function() {
      projectService.search($scope.searchTerm, $scope.page++).then(function(results){
        if(results.length !== 10){
          $scope.allResults = true;
        }
        var ii = 0;
        for(;ii < results.length; ii++){
          $scope.projects.push(results[ii]);
        }
      });
    };

  }]);







