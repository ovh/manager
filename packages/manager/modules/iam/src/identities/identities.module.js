import angular from 'angular';

import component from './identities.component';
import routing from './identities.routing';

const moduleName = 'ovhManagerIAMIdentities';

angular
  .module(moduleName, [])
  .component('iamIdentities', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
