import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';

const moduleName = 'ovhManagerPlatformShDetailsServiceEditName';

angular
  .module(moduleName, [])
  .config(routing)
  .component('platformShDetailsServiceEditName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
