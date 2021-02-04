import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';

const moduleName = 'ovhManagerWebPaasDetailsServiceEditName';

angular
  .module(moduleName, [])
  .config(routing)
  .component('webPaasDetailsServiceEditName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
