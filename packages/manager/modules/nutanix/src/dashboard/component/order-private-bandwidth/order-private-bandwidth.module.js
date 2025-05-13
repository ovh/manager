import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';

import component from './order-private-bandwidth.component';
import service from './service';

const moduleName = 'ovhManagerNutanixClusterOrderPrivateBandwidth';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCatalogPrice',
    'pascalprecht.translate',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
  ])
  .component('nutanixClusterOrderPrivateBandwidth', component)
  .service('NutanixClusterOrderPrivateBandwidthService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
