import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import DedicatedCloudDatacenterNetworkService from '../../network/dedicatedCloud-datacenter-network.service';

import component from './dedicatedCloud-datacenter-add-nsx.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterAddNsxtEdgeComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    DedicatedCloudDatacenterNetworkService,
  ])
  .component('ovhManagerDedicatedCloudDatacenterAddNsx', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
