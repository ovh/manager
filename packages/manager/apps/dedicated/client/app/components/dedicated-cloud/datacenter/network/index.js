import 'angular-translate';
import '@ovh-ux/ui-kit';

import './dedicatedCloud-datacenter.less';

import component from './dedicatedCloud-datacenter-network.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerDedicatedCloudDatacenterNetwork', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
