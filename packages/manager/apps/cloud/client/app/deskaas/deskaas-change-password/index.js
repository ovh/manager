import angular from 'angular';
import component from './deskaas-change-password.component';
import routing from './deskaas-change-password.routing';

const moduleName = 'managerApp';

angular
  .module(moduleName)
  .config(routing)
  .component('deskaasChangePasswordComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
