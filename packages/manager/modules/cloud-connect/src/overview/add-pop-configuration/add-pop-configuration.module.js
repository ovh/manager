import angular from 'angular';

import component from './add-pop-configuration.component';
import routing from './add-pop-configuration.routing';

const moduleName = 'ovhCloudConnectAddPopConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectAddPopConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
