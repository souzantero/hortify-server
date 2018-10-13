const ejs = require('ejs');

// FUNCTIONS

const loadView = function(data, path) {
  return new Promise((resolve, reject) => {
    if (!data || !path) return reject();

    ejs.renderFile(path, data, function (err, html) {
      if (err) reject(err);
      else resolve(html);
    });
  });
};

const loadVerifyUserAccountView = function(url) {
  return loadView({ url: url }, `server/views/user-account-verify.ejs`);
};

const loadResetUserAccountView = function(url) {
  return loadView({ url: url }, `server/views/user-account-reset.ejs`);
};

module.exports.loadVerifyUserAccountView = loadVerifyUserAccountView;
module.exports.loadResetUserAccountView = loadResetUserAccountView;
