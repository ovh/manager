import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import DedicatedCloudDatacenterNetworkService from '../../network/dedicatedCloud-datacenter-network.service';

import component from './dedicatedCloud-datacenter-manage-nsx.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterManageNsxtEdgeComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    DedicatedCloudDatacenterNetworkService,
  ])
  .component('ovhManagerDedicatedCloudDatacenterManageNsxEdges', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
