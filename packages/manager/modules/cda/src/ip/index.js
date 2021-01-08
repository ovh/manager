import angular from 'angular';

import routing from './cda-ip';
import cdaUserList from './list';
import addController from './add/cda-ip-add.controller';
import deleteController from './delete/cda-ip-delete.controller';

const moduleName = 'ovhManagerCdaIp';

angular
  .module(moduleName, [cdaUserList])
  .config(routing)
  .controller('CdaIpAddCtrl', addController)
  .controller('CdaIpDeleteCtrl', deleteController)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
