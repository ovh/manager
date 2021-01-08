import angular from 'angular';

import routing from './cda-pool-list';

import addController from '../add/cda-pool-add.controller';
import deleteController from '../delete/cda-pool-delete.controller';

const moduleName = 'ovhManagerCdaPoolList';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('CdaPoolAddCtrl', addController)
  .controller('CdaPoolDeleteCtrl', deleteController)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
