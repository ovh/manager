import angular from 'angular';
import '@uirouter/angularjs';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerNutanixNodeReboot';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('nutanixNodeReboot', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
