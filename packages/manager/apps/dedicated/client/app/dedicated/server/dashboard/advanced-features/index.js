import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import sgx from './sgx';

import component from './advanced-features.component';

const moduleName = 'ovhManagerDedicatedServerDashboardAdvancedFeatures';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', sgx, 'ui.router'])
  .component('dedicatedServerDashboardAdvancedFeatures', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
