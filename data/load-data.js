// A nodejs script to load data into elasticsearch
// Based on tutorial from http://www.sitepoint.com/building-recipe-search-site-angular-elasticsearch/

// var projects = 'projects.json';
var projects = 'projects_all_27_03_14.json';
var index = 'cordis';


var fs = require('fs');
var es = require('elasticsearch');
var client = new es.Client({
  // host: '188.226.211.223:9200'
  host: 'localhost:9200'
});
var sliceSize = 1000;

fs.readFile(projects, {encoding: 'utf-8'}, function(err, data) {
  if (err) { throw err; }

  bulk_request = JSON.parse(data).reduce(function(bulk_request, obj) {

    // Rework the data slightly
    item = {
      id: obj.id,
      name: obj.title,
      // source: obj.source,
      url: obj.url,
      // recipeYield: obj.recipeYield,
      // ingredients: obj.ingredients.split('\n'),
      funding: obj.funding,
      cost: obj.cost,
      rcn: obj.rcn,
      acronym: obj.project_acronym,
      start_date: obj.start_date,
      end_date: obj.end_date,
      participants: obj.participants
    };

    bulk_request.push({index: {_index: index, _type: 'project', _id: item.id}});
    bulk_request.push(item);
    return bulk_request;

  }, []);

  // A little voodoo to simulate synchronous insert
  var busy = false;
  var callback = function(err, resp) {
    if (err) { console.log(err); }

    busy = false;
  };

  // Recursively whittle away at bulk_request, 1000 at a time.
  var perhaps_insert = function(){
    if (!busy) {
      busy = true;
      client.bulk({
        body: bulk_request.slice(0, sliceSize)
      }, callback);
      bulk_request = bulk_request.slice(sliceSize);
      console.log(bulk_request.length);
    }

    if (bulk_request.length > 0) {
      setTimeout(perhaps_insert, 10);
    } else {
      console.log('Inserted all records.');
    }
  };

  perhaps_insert();
});
