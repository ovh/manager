import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import sgx from './sgx';

import component from './advanced-features.component';

const moduleName = 'ovhManagerDedicatedServerDashboardAdvancedFeatures';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    sgx,
    'ui.router',
  ])
  .component('dedicatedServerDashboardAdvancedFeatures', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
