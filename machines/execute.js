module.exports = {

  friendlyName: 'Execute Program',

  description: 'Execute machlang program',

  extendedDescription: 'This example machine is part of machinepack-boilerplate, used to introduce everyone to machines.',

  inputs: {

    program: {
      example: {},
      description: 'The name of the person that will be sent the hello message.',
      required: true
    },

    inputs: {
      example: {},
      required: false
    }

  },

  defaultExit: 'success',

  exits: {
    error: {
      description: 'An unexpected error occurred.'
    },
    success: {
    }
  },

  fn: function(inputs, exits) {
    var Promise = require('bluebird');
    var _ = require('lodash');
    var meta = require('machine').build(require('./meta'));
    // Promisify the methods

    /**
     * Module Dependencies
     */

    var program = inputs.program;
    var data = inputs.inputs;

    // Run
    return meta({
      program: program
    }, function(error, results) {
      if (error){
        return exits.error(error);
      }

      // Build dependencies
      var depNames = results.dependencies;
      var deps = {};
      _.forEach(depNames, function(depName) {
        var fullDepName = 'machinepack-'+depName.toLowerCase();
        var dep = require(fullDepName);
        _.set(deps, depName, dep);
      });

      /*
      "$Math.add": {
        "a": 2,
        "b": 2
      }
      */
      function getMachineMethod(program) {
        var keys = _.keys(program);
        if (keys.length !== 1) {
          return null; // Not a machine method
        }
        var method = keys[0];
        if (method.length > 1 && method[0] === '$') {
          return method.substr(1);
        }
        return null;
      }
      function isMethodExit(key) {
        if (key.length > 1 && key[0] === "@") {
          return true;
        }
        return false;
      }
      function isMethodInput(key) {
        return !isMethodExit(key);
      }
      function getMethodInputs(program, method) {
        var data = _.get(program, '$'+method);
        // TODO: Check if single value
          // TODO: And check if only 1 required input
        // console.log('data', data, program, method);
        var keys = _.keys(data);
        // console.log('input keys before', keys);
        keys = _.filter(keys, isMethodInput);
        // console.log('input keys after', keys);
        return _.pick(data, keys);
      }
      function getMethodExits(program, method) {
        var data = _.get(program, method);
        var keys = _.keys(data);
        keys = _.filter(keys, isMethodExit);
        return _.pick(data, keys);
      }
      function isVariable(program) {
        if (typeof program === 'string') {
          if (program.length > 1 && program[0] === '$') {
            return true;
          }
        }
        return false;
      }
      var promisifyProgram = function(program) {
        // console.log('promisifyProgram', typeof program, program);
        if (!_.isPlainObject(program)) {
          // Check if variable
          if (isVariable(program)) {
            var varName = program.substr(1); // remove "$" prefix
            // Extract variable from input data
            return _.get(data, varName);
          }
          // simple value
          return program;
        }
        // Check if machine call
        var method = getMachineMethod(program);
        var isMachineCall = method === null ? false : true;
        // Process machine call
        if (isMachineCall) {
          // Inputs
          var inputs = getMethodInputs(program, method);
          // console.log('inputs before', inputs);
          // Promisify inputs
          inputs = _.mapValues(inputs, promisifyProgram);
          // console.log('inputs after', inputs);
          // Exits
          var exits = getMethodExits(program, method);
          // Promisify exits
          exits = _.mapValues(exits, promisifyProgram);

          // Wait for Inputs to resolve
          return Promise.props(inputs)
          .then(function(inputs) {
            // Call machine method with resolved inputs
            var methodFn = _.get(deps, method);
            return new Promise(function (resolve, reject) {
              // FIXME: exits
              var exits = {
                error: reject,
                success: resolve
              };
              return methodFn(inputs).exec(exits);
            });
          });
        } else {
          console.warn('What is this?', program);
          return;
        }
      };

      // Return an object containing myLength and the secretCode
      // return exits.success();
      var promise = promisifyProgram(program);
      promise.then(exits.success);
      promise.catch(exits.error);
    });

  }

};