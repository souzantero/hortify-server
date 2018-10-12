'use strict';

module.exports = function(app) {
  const passport = require('loopback-component-passport');
  const configurator = new passport.PassportConfigurator(app);

  let config = { };

  try {
    config = require('../../providers.json');
  } catch (err) {
    console.trace(err);
    process.exit(1);
  }

  configurator.init();
  configurator.setupModels({
    userModel: app.models.UserAccount,
    userIdentityModel: app.models.ThirdPartyIdentity,
    userCredentialModel: app.models.ThirdPartyCredential,
  });

  for (let item in config) {
    let provider = config[item];

    provider.session = provider.session !== false;
    configurator.configureProvider(item, provider);
  }
};
