import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-manage-nsx.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterManageNsxEdgeComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterManageNsxEdges', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
