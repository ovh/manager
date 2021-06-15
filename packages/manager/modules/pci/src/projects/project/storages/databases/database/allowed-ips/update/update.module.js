import angular from 'angular';
import '@uirouter/angularjs';

import allowedIp from '../../../components/allowed-ip';
import routing from './update.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseAllowedIpsUpdate';

angular
  .module(moduleName, ['oui', 'ui.router', allowedIp])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
