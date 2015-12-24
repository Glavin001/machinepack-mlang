var Promise = require('bluebird');
var _ = require('lodash');

// Dependencies
var Github = require('machinepack-github');
var Arrays = require('machinepack-arrays');

// Promisify all methods
var promiseMethods = {};
_.set(promiseMethods, 'Github.listRepos', Promise.promisify(Github.listRepos));
_.set(promiseMethods, 'Arrays.length', Promise.promisify(Arrays.length));

function countRepos(inputs) {
  // Extract inputs
  var data = {
    owner: inputs.username,
  };
  // Get the GitHub profile data for a user.
  return _.get(promiseMethods, 'Github.listRepos')(data)
  .then(function (results) {
    var data = {
      array: results
    };
    return _.get(promiseMethods, 'Arrays.length')(data);
  });
}

countRepos({
  username: 'Glavin001'
}).then(function(results) {
  console.log(results);
});

