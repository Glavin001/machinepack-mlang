module.exports = {

  friendlyName: 'Extract Variables',

  description: 'Extract variables from machlang',

  extendedDescription: 'This example machine is part of machinepack-boilerplate, used to introduce everyone to machines.',

  inputs: {

    program: {

      example: {},

      description: 'The name of the person that will be sent the hello message.',

      required: true
    }

  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      example: ['username']
    }
  },

  fn: function(inputs, exits) {
    var meta = require('machine').build(require('./meta'));

    /**
     * Module Dependencies
     */

    var program = inputs.program;
    // Run
    return meta({
      program: program
    }, function(error, results) {
      if (error){
        return exits.error(error);
      }
      // Return an object containing myLength and the secretCode
      return exits.success(results.variables);
    });

  }

};