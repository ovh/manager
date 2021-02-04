import angular from 'angular';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import uiRouter from '@uirouter/angularjs';

import routing from './resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewResiliation';

angular
  .module(moduleName, [ngUiRouterLayout, ovhManagerBilling, uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
