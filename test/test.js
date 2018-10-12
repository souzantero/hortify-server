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
  dataSource.connector.connect(function(err, db) {
    if (err) done(err);
    else db.dropDatabase(done);
  });
});

after(function() {
  httpServer.close();
});

describe('/api/user-accounts', function() {
  describe('POST', function() {
    describe('create', function() {
      it('should be success', function() {
        return httpClient
          .post('/api/user-accounts')
          .type('json')
          .send({
            email: 'user@email.com',
            password: 'userpass',
          })
          .should.eventually.be.have.status(200);
      });
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
