import angular from 'angular';

import component from './reset.component';
import routing from './reset.routing';

import gatewayManagement from '../../../components/gateway-management';

const moduleName = 'ovhManagerPciProjectKubernetesServiceReset';

angular
  .module(moduleName, [gatewayManagement])
  .config(routing)
  .component('pciProjectKubernetesServiceReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
