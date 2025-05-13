import angular from 'angular';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import uiRouter from '@uirouter/angularjs';

import routing from './cancel-commitment.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelCommitment';

angular
  .module(moduleName, [ngUiRouterLayout, ovhManagerBillingComponents, uiRouter])
  .config(routing);

export default moduleName;
