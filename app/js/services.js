'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1').

  // A factory to power calls to Elastic Search.
  factory('projectService', ['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {

    var client = elasticsearch({
      host: $location.host() + ":9200"
    });

    /**
     * Given a term and an offset, load another round of 10 projects.
     *
     * Returns a promise.
     */
    var search = function(term, offset) {
      var deferred = $q.defer();

      client.search({
      	index: 'cordis',
        type: 'project',
        body: {
        	size: 10,
          from: (offset || 0) * 10,
          query: {
            match: {
              _all: term
            }
          }
        }
      }).then(function(result) {
	      var ii = 0, hits_in, hits_out = [];
	      hits_in = (result.hits || {}).hits || [];
	      for(;ii < hits_in.length; ii++){
	      	hits_out.push(hits_in[ii]._source);
	      }
	      deferred.resolve(hits_out);
      }, deferred.reject);

      return deferred.promise;
    };

    var filter = function(term) {
      var deferred = $q.defer();
      client.search({
        index: 'cordis',
        type: 'project',
        body: {
          query: {
            match: {
              _all: 'spain'
            }
          },
          facets: {
            country: {
              terms: {
                field: "country"
              }
            }
          }
        },
      }).then(function(result) {
        var ii = 0, hits_in, hits_out = [];
        hits_in = (result.hits || {}).hits || [];
        for(;ii < hits_in.length; ii++){
          hits_out.push(hits_in[ii]._source);
        }
        deferred.resolve(hits_out);
      }, deferred.reject);

      return deferred.promise;
    };

    return {
      "search": search,
      "filter": filter
    };
  }]);
