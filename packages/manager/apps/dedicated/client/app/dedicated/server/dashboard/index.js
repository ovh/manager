import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import ovhManagerBilling from '@ovh-ux/manager-billing';
import advancedFeatures from './advanced-features';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerDedicatedServerDashboard';

angular
  .module(moduleName, [
    advancedFeatures,
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerBilling,
  ])
  .component('dedicatedServerDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
