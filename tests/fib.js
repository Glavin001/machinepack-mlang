/*
// From http://stackoverflow.com/a/1518740/2578205
int fib(int x) {
    if (x == 0)
        return 0;

    if (x == 1)
        return 1;

    return fib(x-1)+fib(x-2);
}
*/

module.exports = {
  "$IfThen.isEqual": {
    "a": "$x",
    "b": 0,
    "@success": 0,
    "@otherwise": {
      "$IfThen.isEqual": {
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
};