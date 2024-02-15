import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './instances-table.component';
import service from './instances-table.service';

import './instances-table.less';

const moduleName = 'ovhManagerInstancesTable';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('octaviaLoadBalancerInstancesTable', component)
  .service('OctaviaLoadBalancerInstanceService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
