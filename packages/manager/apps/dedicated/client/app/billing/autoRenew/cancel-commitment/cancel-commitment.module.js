import angular from 'angular';
import '@uirouter/angularjs';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBilling from '@ovh-ux/manager-billing';

import routing from './cancel-commitment.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelCommitment';

angular
  .module(moduleName, ['ui.router', ngUiRouterLayout, ovhManagerBilling])
  .config(routing);

export default moduleName;
