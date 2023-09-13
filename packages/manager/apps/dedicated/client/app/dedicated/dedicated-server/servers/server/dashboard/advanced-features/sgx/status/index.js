import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './status.component';
import service from './status.service';

const moduleName =
  'ovhManagerDedicatedServerDashboardAdvancedFeaturesSgxStatus';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('dedicatedServerDashboardAdvancedFeaturesSgxStatus', component)
  .service('DedicatedServerDashboardAdvancedFeaturesSgxStatus', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
