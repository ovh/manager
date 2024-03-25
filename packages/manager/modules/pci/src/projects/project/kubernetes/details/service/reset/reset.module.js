import angular from 'angular';

import component from './reset.component';
import routing from './reset.routing';

import networkForm from '../../../components/network-form';
import proxyForm from '../../../components/proxy-form';

const moduleName = 'ovhManagerPciProjectKubernetesServiceReset';

angular
  .module(moduleName, [networkForm, proxyForm])
  .config(routing)
  .component('pciProjectKubernetesServiceReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
