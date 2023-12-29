import angular from 'angular';
import '@uirouter/angularjs';
import atInternet from '@ovh-ux/ng-at-internet';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import routing from './resiliation.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardResiliation';

angular
  .module(moduleName, [
    'ui.router',
    atInternet,
    ngUiRouterLayout,
    ovhManagerBillingComponents,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
