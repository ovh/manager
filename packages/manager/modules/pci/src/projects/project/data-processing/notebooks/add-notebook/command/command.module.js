import angular from 'angular';

import component from './command.component';
import routing from './command.routing';

const moduleName = 'ovhManagerPciProjectDataProcessingAddNotebookCommand';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciProjectDataProcessingAddNotebookCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
