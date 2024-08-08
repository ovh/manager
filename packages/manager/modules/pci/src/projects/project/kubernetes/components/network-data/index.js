import angular from 'angular';
import 'angular-translate';

import component from './network-data.component';

const moduleName = 'ovhManagerPCIKubernetesNetworkData';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('pciKubernetesNetworkData', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
