import angular from 'angular';

import routing from './add.routing';
import component from './add.component';

const moduleName = 'ovhManagerPciProjectKubernetesNodesAdd';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodesAddComponent', component);

export default moduleName;
