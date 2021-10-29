import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceAddOidcProvider';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceAddOidcProvider', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
