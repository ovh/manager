import angular from 'angular';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'adpServiceTerminate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('analyticsDataPlatformDetailsServiceTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
