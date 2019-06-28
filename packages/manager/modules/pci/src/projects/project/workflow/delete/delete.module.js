import angular from 'angular';

import routing from './delete.routing';
import component from './delete.component';

const moduleName = 'ovhManagerPciProjectWorkflowDelete';

angular.module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectWorkflowDeleteComponent', component);

export default moduleName;
