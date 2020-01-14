import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-farm-probe.routing';
import probeComponent from './iplb-server-farm-probe.component';

const moduleName = 'ovhManagerIplbServerFarmProbeModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerFarmProbe', probeComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
