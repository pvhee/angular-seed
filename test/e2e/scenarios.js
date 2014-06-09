'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {


  it('a search snippet is shown when user types in search box', function() {

    browser.get('index.html');

    // Find the element with ng-model matching 'searchTerm' - this will
    // find the <input type="text" ng-model="searchTerm"/> element - and then
    // type 'systemage' into it.
    element(by.model('searchTerm')).sendKeys('systemage');
    var firstMatch = element(by.repeater('project in projects').row(0).column('{{project.acronym}}'));
    expect(firstMatch.getText()).toEqual('SYSTEMAGE');

    // firstMatch.getText().then(function(text) {
    //   console.log(text);
    // });

  });


});
