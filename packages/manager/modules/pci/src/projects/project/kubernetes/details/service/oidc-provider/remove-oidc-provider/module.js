import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceRemoveOidcProvider';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceRemoveOidcProvider', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
