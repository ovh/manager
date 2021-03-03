import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-monitoring.component';
import routing from './vps-monitoring.routing';

const moduleName = 'ovhManagerVpsMonitoring';

angular
  .module(moduleName, ['ui.router'])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
