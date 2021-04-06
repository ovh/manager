import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './upgrade-request.component';
import routing from './upgrade-request.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardUpgradeRequest';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('serverManualUpgrade', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
