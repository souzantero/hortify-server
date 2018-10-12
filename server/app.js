'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

module.exports = function(done) {
  boot(app, __dirname, function(err) {
    if (err) throw err;
    const server = app.listen(function() {
      app.emit('started');
      console.log(app.get('url').replace(/\/$/, ''));
      done(server);
    });
  });
};
