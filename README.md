# auto-pack
> Generate code from JSON, representing complex tasks and their requirements using Machinepacks

---

## About

Inspired by:
- Node Machine: http://node-machine.org/
- MongoDB's Aggregation Pipeline: https://docs.mongodb.org/manual/core/aggregation-pipeline/
- async's auto: https://github.com/caolan/async#autotasks-concurrency-callback

### Features

- Machine readable and writable
  - It is written in JSON!
- All functions are Node Machines
- Generates the dependencies automatically
  - Syntax clearly shows which functions are called and which Machinepacks are required
- Generates API documentation automatially
  - Node Machines have expected inputs and this can be used to infer the expected inputs for this machine

## Example

### How many GitHub repositories do I have?

#### Query

````javascript
{
  Repos: {
    “$Github.listRepos”: {
      owner: “$context.username”
    }
  },
  Count: {
		“$Arrays.length”: {
			array: “$Repos”
		}
	},
  Results: {
	  count: “$Count”
  }
}
```

#### Code

```javascript
async.auto({
    __context: function(cb) {
        return cb(null, {
            username: "Glavin001"
        });
    },
    __packs: function(cb) {
        var packNames = [‘arrays’, ‘github’]
        var packs = {};
        _.each(packNames, function(name) {
            packs[name] = require(‘machinepack - ’ +name);
        });
        return cb(null, packs);
    },
    Followers: [‘__context’, ‘__packs’, function(context, packs, cb) {
        // Get context variables
        var username = context.username;
        // Get pack
        var Github = packs[‘github’];
        var data = {
            owner: username
        };
        Github.listRepos(data).exec({
            error: function(error) {
                cb(error);
            },
            success: function(repos) {
                cb(null, repos);
            }
        });
    }],
    Count: [‘__packs’, ‘Followers’, function(packs, followers, cb) {
        // Get pack
        var Arrays = packs[‘arrays’];
        Arrays.length({
            array: followers
        }).exec({
            error: function(error) {
                cb(error);
            },
            success: function(count) {
                cb(null, count);
            }
        });
    }]
}, function(error, results) {
    if (error) {
        reject(error);
    } else {
        resolve(results.Count);
    }
});
```
