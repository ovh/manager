import angular from 'angular';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciProjectKubernetesNodesAdd';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodesAddComponent', component);

export default moduleName;
