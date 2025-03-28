import 'angular-translate';
import '@ovh-ux/ui-kit';

import './dedicatedCloud-datacenter.less';
import capitalizeFilter from './dedicatedCloud-datacenter-network.filter';
import DedicatedCloudDatacenterNetworkService from './dedicatedCloud-datacenter-network.service';

import component from './dedicatedCloud-datacenter-network.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    capitalizeFilter,
    DedicatedCloudDatacenterNetworkService,
  ])
  .component('ovhManagerDedicatedCloudDatacenterNetwork', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
