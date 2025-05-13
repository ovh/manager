import angular from 'angular';
import '@uirouter/angularjs';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import routing from './cancel-commitment.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardCancelCommitment';

angular
  .module(moduleName, [
    'ui.router',
    ngUiRouterLayout,
    ovhManagerBillingComponents,
  ])
  .config(routing);

export default moduleName;
