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
};
