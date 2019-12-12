import angular from 'angular';
import component from './deskaas-confirm-terminate.component';
import routing from './deskaas-confirm-terminate.routing';

const moduleName = 'managerApp';

angular
  .module(moduleName)
  .config(routing)
  .component('deskaasConfirmTerminateComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
