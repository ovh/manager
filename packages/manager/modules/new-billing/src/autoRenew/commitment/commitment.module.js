import angular from 'angular';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import uiRouter from '@uirouter/angularjs';

import routing from './commitment.routing';

const moduleName = 'ovhManagerBillingAutorenewCommitment';

angular
  .module(moduleName, [ovhManagerBillingComponents, uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
