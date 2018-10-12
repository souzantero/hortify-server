'use strict';

module.exports = function(Model) {
  // SETTINGS

  Model.disableRemoteMethodByName('prototype.__count__accessTokens');
  Model.disableRemoteMethodByName('prototype.__create__accessTokens');
  Model.disableRemoteMethodByName('prototype.__delete__accessTokens');
  Model.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
  Model.disableRemoteMethodByName('prototype.__findById__accessTokens');
  Model.disableRemoteMethodByName('prototype.__get__accessTokens');
  Model.disableRemoteMethodByName('prototype.__updateById__accessTokens');

  Model.disableRemoteMethodByName('prototype.__count__identities');
  Model.disableRemoteMethodByName('prototype.__create__identities');
  Model.disableRemoteMethodByName('prototype.__delete__identities');
  Model.disableRemoteMethodByName('prototype.__destroyById__identities');
  Model.disableRemoteMethodByName('prototype.__findById__identities');
  Model.disableRemoteMethodByName('prototype.__get__identities');
  Model.disableRemoteMethodByName('prototype.__updateById__identities');

  // INSTANCE METHODS

  Model.prototype.generateVerificationTokenAndSave = function () {
    return new Promise((resolve, reject) => {
      Model.generateVerificationToken(this, null, (err, token) => {
        if (err) reject(err);
        else {
          this.verificationToken = token;
          this.save((err, saved) => {
            if (err) reject(err);
            else resolve(saved);
          });
        }
      });
    });
  };

  Model.prototype.sendUserAccountVerificationEmail = function () {
    return Promise.resolve();
  };

  Model.prototype.sendUserAccountResetPasswordEmail = function (accessToken) {
    return Promise.resolve();
  };

  Model.prototype.verifyAccount = function () {
    return this.generateVerificationTokenAndSave()
      .then(() => {
        return this.sendUserAccountVerificationEmail();
      })
      .catch(() => this.destroy());
  };

  Model.prototype.forceVerifyAccount = function () {
    this.verificationToken = null;
    this.emailVerified = true;
    return this.save();
  };

  Model.prototype.handleCreatedByThirdParty = function () {
    if (this.username && this.username.startsWith('facebook-token')) {
      delete this.__data.username;
      this.isThirdParty = true;
    }
  };

  // HELPER METHODS

  Model.validatePasswordLength = function (password, next) {
    if (!password || password.length < 6) {
      const err = new Error('The password should be less than 6 characters');
      err.statusCode = 422;
      err.details = {
        context: 'UserAccount',
        codes: {
          password: [
            'length.min'
          ]
        }
      };

      next(err);
      return false;
    }

    return true;
  };

  // OPERATION HOOKS

  Model.observe('before save', function(context, next) {
    if (context.isNewInstance) {
      context.instance.handleCreatedByThirdParty();
    }

    next();
  });

  Model.observe('after save', function(context, next) {
    if (context.isNewInstance) {
      if (context.instance.isThirdParty) next();
      else context.instance.verifyAccount()
        .then(() => next())
        .catch((err) => next(err));
    } else {
      next();
    }
  });

  // REMOTE HOOKS

  Model.beforeRemote('setPassword', function(context, instance, next) {
    if (Model.validatePasswordLength(context.args.newPassword, next)) {
      next();
    }
  });

  Model.afterRemote('resetPassword', function(context, instance, next) {
    context.res.json({
      title: 'Password reset requested',
      content: 'Check your email for further instructions'
    });

    next();
  });

  // ON

  Model.on('resetPasswordRequest', function(info) {
    info.user
      .sendUserAccountResetPasswordEmail(info.accessToken)
      .catch((err) => console.log(err));
  });
};
