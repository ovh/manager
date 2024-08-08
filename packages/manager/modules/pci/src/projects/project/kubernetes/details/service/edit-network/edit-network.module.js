import angular from 'angular';

import component from './edit-network.component';
import routing from './edit-network.routing';

import networkForm from '../../../components/network-form';

const moduleName = 'ovhManagerPciKubernetesEditNetwork';

angular
  .module(moduleName, [networkForm])
  .config(routing)
  .component('pciKubernetesEditNetwork', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
