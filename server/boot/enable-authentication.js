'use strict';

module.exports = function(app) {
  app.enableAuth({datasource: 'local'});
};
