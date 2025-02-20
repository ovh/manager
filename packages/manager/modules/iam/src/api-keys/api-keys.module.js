import angular from 'angular';

import component from './api-keys.component';
import routing from './api-keys.routing';

const moduleName = 'ovhManagerIAMApiKeys';

angular
  .module(moduleName, [])
  .component('iamApiKeys', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
