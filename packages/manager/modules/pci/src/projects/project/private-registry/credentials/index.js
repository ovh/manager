import angular from 'angular';
import credentialsComponent from './credentials.component';
import routing from './credentials.routing';

const moduleName = 'ovhManagerPciProjectPrivateRegistryGenerateCredentials';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciPrivateRegistryCredentials', credentialsComponent);

export default moduleName;
