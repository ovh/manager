import angular from 'angular';

import routing from './routing';
import addController from './add/cda-pool-add.controller';
import deleteController from './delete/cda-pool-delete.controller';

const moduleName = 'ovhManagerCdaPool';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('CdaPoolAddCtrl', addController)
  .controller('CdaPoolDeleteCtrl', deleteController)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
