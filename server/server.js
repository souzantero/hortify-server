'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

app.start = function() {
  return app.listen(function() {
    app.emit('started');
    console.log(app.get('url').replace(/\/$/, ''));
  });
};

boot(app, __dirname, function(err) {
  if (err) throw err;
  if (require.main === module)
    app.start();
});
