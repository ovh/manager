import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import resiliate from './resiliate.component';
import routing from './resiliate.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardResiliate';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('ovhManagerBillingResiliateModalWrapper', resiliate)
  .config(routing);

export default moduleName;
