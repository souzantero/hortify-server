'use strict';

module.exports = function(Model) {

  // VALIDATIONS

  Model.validate('email', function(err) {
    if (!this.getProfileEmail()) {
      err();
    }
  }, { message: 'the email can\'t be blank ' });

  // INSTANCE METHODS

  Model.prototype.getProfileEmail = function() {
    return this.profile && this.profile.emails && this.profile.emails.length > 0
      ? this.profile.emails[0].value
      : null;
  };

  Model.prototype.useExistedUser = function(user) {
    const UserAccount = Model.app.models.UserAccount;

    return new Promise((resolve, reject) => {
      UserAccount.destroyById(this.userId, (err) => {
        if (err) reject(err);
        else this.updateAttribute('userId', user.id, (err) => {
          if (err) reject(err);
          else user.updateAttribute('isThirdParty', true)
            .then(() => user.forceVerifyAccount())
            .then(() => resolve())
            .catch((err) => reject(err));
        })
      });
    });
  };

  Model.prototype.setThirdPartyDataOnUser = function() {
    const UserAccount = Model.app.models.UserAccount;

    return new Promise((resolve, reject) => {
      UserAccount.findById(this.userId, (err, user) => {
        if (err) reject(err);
        else {
          let profile = this.profile;
          if (profile) {
            if (profile.emails && profile.emails.length > 0) {
              let email = profile.emails[0].value;
              if (email && email.trim() !== '') {
                user.email = email;
              }
            }

            if (profile.displayName) {
              user.name = profile.displayName;
            }

            if (profile.photos && profile.photos.length > 0) {
              user.pictureUrl = profile.photos[0].value;
            }

            user.save((err, saved) => {
              if (err) reject(err);
              else saved.forceVerifyAccount()
                .then(() => resolve())
                .catch((err) => reject(err));
            });
          } else {
            resolve();
          }
        }
      });
    });
  };

  // CUSTOM METHODS

  Model.onAfterCreated = function(instance) {
    const UserAccount = Model.app.models.UserAccount;
    return UserAccount.findOne({ where: { email: instance.getProfileEmail() }})
      .then(user => user
        ? instance.useExistedUser(user)
        : instance.setThirdPartyDataOnUser());
  };

  // OPERATION HOOKS

  Model.observe('after save', function(context, next) {
    if (context.isNewInstance) {
      Model.onAfterCreated(context.instance)
        .then(() => next())
        .catch((err) => next(err));
    } else {
      next();
    }
  });
};
