import angular from 'angular';

import routing from './routing';
import addController from './add/cda-ip-add.controller';
import deleteController from './delete/cda-ip-delete.controller';

const moduleName = 'ovhManagerCdaIp';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('CdaIpAddCtrl', addController)
  .controller('CdaIpDeleteCtrl', deleteController)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
