module.exports = {

  friendlyName: 'Extract Dependencies',

  description: 'Extract dependencies from MLang program',

  extendedDescription: 'Extract dependencies from MLang program.',

  inputs: {

    program: {
      example: {},
      description: 'The MLang program',
      required: true
    }

  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      example: ['Arrays', 'GitHub'],
      description: 'The dependencies of the MLang program.'
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
      return exits.success(results.dependencies);
    });

  }

};