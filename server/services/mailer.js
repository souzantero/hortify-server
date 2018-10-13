const viewer = require('./viewer');
const SparkPost = require('sparkpost');
const sparky = new SparkPost('6750ec8e9aafb7e9a670a8f5e1e5a878d1064da7');

// FUNCTIONS

const send = function(to, subject, body) {
  return sparky.transmissions.send({
    options: { transactional: true },
    content: {
      from: '"Hortify" <no-reply@mail.hortify.com>',
      subject: subject,
      html: body
    },
    recipients: [ { address: to } ]
  });
};

const sendUserAccountVerificationEmail = function(to, url) {
  return viewer.loadVerifyUserAccountView(url)
    .then((html) => {
      return send(to, `Welcome to Hortify`, html);
    });
};

const sendUserAccountResetPasswordEmail = function(to, url) {
  return viewer.loadResetUserAccountView(url)
    .then((html) => {
      return send(to, 'Reset Password Request', html);
    });
};

module.exports.sendUserAccountVerificationEmail = sendUserAccountVerificationEmail;
module.exports.sendUserAccountResetPasswordEmail = sendUserAccountResetPasswordEmail;
