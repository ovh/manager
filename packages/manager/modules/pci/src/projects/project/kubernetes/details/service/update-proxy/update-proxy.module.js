import angular from 'angular';

import component from './update-proxy.component';
import routing from './update-proxy.routing';
import proxyForm from '../../../components/proxy-form';

const moduleName = 'ovhManagerPciProjectKubernetesServiceUpdateProxy';

angular
  .module(moduleName, [proxyForm])
  .config(routing)
  .component('pciProjectKubernetesServiceUpdateProxy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
