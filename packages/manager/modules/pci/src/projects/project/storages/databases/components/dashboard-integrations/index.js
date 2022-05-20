import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './dashboard-integrations.component';

const moduleName = 'ovhManagerPciStoragesDatabasesDashboardIntegrations';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('dashboardIntegration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
