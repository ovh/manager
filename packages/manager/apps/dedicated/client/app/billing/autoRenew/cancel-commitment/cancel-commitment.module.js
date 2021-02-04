import angular from 'angular';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import uiRouter from '@uirouter/angularjs';

import routing from './cancel-commitment.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelCommitment';

angular
  .module(moduleName, [ngUiRouterLayout, ovhManagerBilling, uiRouter])
  .config(routing);

export default moduleName;
