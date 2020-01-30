import angular from 'angular';
import component from './create.component';
import routing from './create.routing';

const moduleName = 'pciProjectPrivateRegistryCreateComponent';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectPrivateRegistryCreate', component);

export default moduleName;
