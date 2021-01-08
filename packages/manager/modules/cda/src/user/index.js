import angular from 'angular';

import routing from './cda-user';
import userList from './list';
import userDetails from './details';
import addController from './add/cda-user-add.controller';
import deleteController from './delete/cda-user-delete.controller';

const moduleName = 'ovhManagerCdaUser';

angular
  .module(moduleName, [userDetails, userList])
  .config(routing)
  .controller('CdaUserAddCtrl', addController)
  .controller('CdaUserDeleteCtrl', deleteController)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
