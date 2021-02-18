import angular from 'angular';
import '@uirouter/angularjs';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBilling from '@ovh-ux/manager-billing';

import routing from './resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewResiliation';

angular
  .module(moduleName, ['ui.router', ngUiRouterLayout, ovhManagerBilling])
  .config(routing);

export default moduleName;
