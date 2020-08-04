import angular from 'angular';
import '@uirouter/angularjs';

import component from './edit-description.component';
import routing from './edit-description.routing';

const moduleName = 'ovhCloudConnectEditDescription';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('cloudConnectEditDescription', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
