import angular from 'angular';
import '@uirouter/angularjs';
import routing from './api-url.routing';
import component from './api-url.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryApiUrl';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('pciPrivateRegistryApiUrl', component);

export default moduleName;
