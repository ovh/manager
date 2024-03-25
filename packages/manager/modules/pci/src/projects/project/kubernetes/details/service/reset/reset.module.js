import angular from 'angular';

import component from './reset.component';
import routing from './reset.routing';

import networkForm from '../../../components/network-form';

const moduleName = 'ovhManagerPciProjectKubernetesServiceReset';

angular
  .module(moduleName, [networkForm])
  .config(routing)
  .component('pciProjectKubernetesServiceReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
