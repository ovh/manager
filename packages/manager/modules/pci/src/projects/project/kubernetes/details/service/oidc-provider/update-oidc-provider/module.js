import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceUpdateOidcProvider';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceUpdateOidcProvider', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
