import angular from 'angular';
import component from './deskaas-get-console-access.component';
import routing from './deskaas-get-console-access.routing';

const moduleName = 'managerApp';

angular
  .module(moduleName)
  .config(routing)
  .component('deskaasGetConsoleAccessComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
