import angular from 'angular';

import component from './reset.component';
import routing from './reset.routing';

import gatewayManagement from '../../../components/gateway-management';
import proxyForm from '../../../components/proxy-form';

const moduleName = 'ovhManagerPciProjectKubernetesServiceReset';

angular
  .module(moduleName, [gatewayManagement, proxyForm])
  .config(routing)
  .component('pciProjectKubernetesServiceReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
