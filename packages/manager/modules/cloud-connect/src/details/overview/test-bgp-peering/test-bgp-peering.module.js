import angular from 'angular';

import component from './test-bgp-peering.component';
import routing from './test-bgp-peering.routing';

const moduleName = 'ovhCloudConnectTestBgpPeering';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectTestBgpPeering', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
