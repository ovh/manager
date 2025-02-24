import angular from 'angular';

import component from './check-bgp-peering.component';
import routing from './check-bgp-peering.routing';

const moduleName = 'ovhCloudConnectCheckBgpPeering';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectCheckBgpPeering', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
