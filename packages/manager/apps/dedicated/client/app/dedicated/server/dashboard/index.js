import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import advancedFeatures from './advanced-features';
import subscriptions from './subscriptions';
import technicalDetails from './technical-details';
import upgradeRequest from './upgrade-request';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerDedicatedServerDashboard';

angular
  .module(moduleName, [
    advancedFeatures,
    atInternet,
    'oui',
    'pascalprecht.translate',
    subscriptions,
    technicalDetails,
    upgradeRequest,
    'ui.router',
  ])
  .component('dedicatedServerDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
