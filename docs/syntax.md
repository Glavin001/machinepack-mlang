# MLang Syntax

## Calling a Machine

Calling a machine is indicated by the key starting with a `$` followed by the machine path.

The key `$Math.add` implies:
- The machinepack is `machinepack-math`, thus
  `var Math = require('machinepack-math')`
- `Math.add` is the machine to be executed

The value is the inputs to the machine.

Let's say we want something like this:

```javascript
var Math = require('machinepack-math');
Math.add({
  a: 2,
  b: 2
}).exec({
  success: function(result) {
    console.log(result); // result = 4
  }
});
```

Our MLang program would be:

```json
{
  "$Math.add": {
    "a": 2,
    "b": 2
  }
}
```

Or more completely:

```javascript
var mlang = require('machinepack-mlang');
mlang.execute({
  program: {
    "$Math.add": {
      "a": 2,
      "b": 2
    }
  }
}).exec({
  success: function(result) {
    console.log(result); // result = 4
  }
});
```

## Using Input Variables

Using an input variable is indicated by a prefix `$` followed by the input variable name.

The following MLang program has the variable `x`:

```json
{
  "$Math.add": {
    "a": "$x",
    "b": 1
  }
}
```

A complete example:

```javascript
var mlang = require('machinepack-mlang');
mlang.execute({
  program: {
    "$Math.add": {
      "a": "$x",
      "b": 1
    }
  },
  inputs: {
    x: 2
  }
}).exec({
  success: function(result) {
    console.log(result); // result = 3
  }
});
```

## Nested Machine Calls

Here's a basic MLang program which results in `5`:

```json
{
  "$Arrays.length": {
    "array": [1, 2, 3, 4, 5]
  }
}
```

Instead of using `Arrays.length` to count the length of a predefined array we can calculate the length of an array that is the result of another machine call, which can be asynchonous!

Let's try counting the number of GitHub repositories we have:

```javascript
var mlang = require('machinepack-mlang');
mlang.execute({
  "program": {
    "$Arrays.length": {
      "array": {
        "$Github.listRepos": {
          "owner": "$username"
        }
      }
    }
  },
  "inputs": {
    "username": "Glavin001"
  }
}).exec({
  success: function(result) {
    console.log(result); // result = 30
  }
});
```

Another example:

```javascript
var mlang = require('machinepack-mlang');
mlang.execute({
  "program": {
    "$Dictionaries.dot": {
      "dictionary": {
        "$Github.getUserDetails": {
          "user": "$username"
        }
      },
      "keypath": "numFollowers"
    }
  },
  "inputs": {
    "username": "Glavin001"
  }
}).exec({
  success: function(result) {
    console.log(result); // result = 160
  }
});
```

## Advanced Features

### Recursion

A machine call with key `$this` will be recursive.

```json
{
  "$this": {
    "x": 1
  }
}
```

### Exits

Machine inputs with keys starting with `@` are exits.

```javascript
if (x === 0) {
  return true;
} else {
  return false;
}
```

Is equivalent to the following MLang program:

```json
{
  "$IfThen.ifEqual": {
      "a": "$x",
      "b": 0,
      "@success": true,
      "@otherwise": false
  }
}
```

### Example

Here is an example [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number) program in MLang.

```javascript
var mlang = require('machinepack-mlang');
mlang.execute({
  "program": {
    "$IfThen.ifEqual": {
      "a": "$x",
      "b": 0,
      "@success": 0,
      "@otherwise": {
        "$IfThen.ifEqual": {
          "a": "$x",
          "b": 1,
          "@success": 1,
          "@otherwise": {
            "$Math.add": {
              "a": {
                "$this": {
                  "x": {
                    "$Math.subtract": {
                      "a": "$x",
                      "b": 1
                    }
                  }
                }
              },
              "b": {
                "$this": {
                  "x": {
                    "$Math.subtract": {
                      "a": "$x",
                      "b": 2
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "inputs": {
    "x": "6"
  }
}).exec({
  success: function(result) {
    console.log(result); // result = 8
  }
});
```
