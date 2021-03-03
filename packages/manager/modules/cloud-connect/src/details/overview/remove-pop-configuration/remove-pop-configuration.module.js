import angular from 'angular';

import component from './remove-pop-configuration.component';
import routing from './remove-pop-configuration.routing';

const moduleName = 'ovhCloudConnectDetailsRemovePopConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsRemovePopConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
