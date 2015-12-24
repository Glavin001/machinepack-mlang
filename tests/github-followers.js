var Promise = require('bluebird');
var Github = require('machinepack-github');

var program = {
  "$Objects.get": {
    "$Github.listRepos": {
      "owner": "$username"
    }
  }
};

function countFollowers(input) {
  return new Promise(function (resolve, reject) {
    // Get the GitHub profile data for a user.
    Github.getUserDetails({
      user: input.username,
    }).exec({
      // An unexpected error occurred.
      error: reject,
      // OK.
      success: function (result) {
        return resolve(result.numFollowers);
      },
    });
  });
}

countFollowers({
  username: 'Glavin001'
}).then(function(numFollowers) {
  console.log(numFollowers);
});

