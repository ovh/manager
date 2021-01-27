import angular from 'angular';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import uiRouter from '@uirouter/angularjs';

import routing from './commitment.routing';

const moduleName = 'ovhManagerBillingAutorenewCommitment';

angular
  .module(moduleName, [ovhManagerBilling, uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
