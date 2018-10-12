'use strict';

const chai = require('chai');

chai.should();
chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));

// Vars

let httpServer = undefined;
let httpClient = undefined;
let dataSource = undefined;

before(function(done) {
  require('../server/app')(function(app, server) {
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
  describe('POST', function() {
    describe('create', function() {
      it('should be success');
    });

    describe('login', function() {
      it('should be success');
    });

    describe('logout', function() {
      it('should be success');
    });
  });

  describe('PUT', function() {
    describe('update', function() {
      it('should be success');
    });
  });
});
