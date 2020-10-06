import angular from 'angular';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerPlatformShDetailsServiceTerminate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('platformShDetailsServiceTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
