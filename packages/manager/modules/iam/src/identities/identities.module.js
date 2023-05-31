import angular from 'angular';

import deleteModule from './delete';

import component from './identities.component';
import routing from './identities.routing';

const moduleName = 'ovhManagerIAMIdentities';

angular
  .module(moduleName, [deleteModule])
  .component('iamIdentities', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
