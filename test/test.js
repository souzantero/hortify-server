'use strict';

const chai = require('chai');

chai.should();
chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));

const app = require('../server/app');

// Vars

let httpServer = undefined;
let httpClient = undefined;
let dataSource = undefined;

before(function(done) {
  app(function(server) {
    httpServer = server;
    httpClient = chai.request(app).keepOpen();
    dataSource = app.dataSources.local;

    done();
  });
});

beforeEach(function(done) {
  dataSource.connector.db.dropDatabase(done);
});

after(function() {
  httpServer.close();
});

describe('/api/user-accounts', function() {

});
