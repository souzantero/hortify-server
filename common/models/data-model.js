'use strict';

module.exports = function(Model) {

  // OPERATION HOOKS

  Model.observe('before save', function (context, next) {
    let now = Date.now();

    if (context.isNewInstance) {
      context.instance.createdAt = now;
    }

    if (context.instance) {
      context.instance.updatedAt = now;
    } else {
      context.data.updatedAt = now;
    }

    next();
  });
};
