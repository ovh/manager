import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-force-outperform-2020.component';
import routing from './vps-force-outperform-2020.routing';

const moduleName = 'ovhManagerVpsForceOutperform2020';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsForceOutperform2020Component', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
