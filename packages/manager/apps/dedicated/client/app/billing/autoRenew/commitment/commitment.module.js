import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBilling from '@ovh-ux/manager-billing';

import routing from './commitment.routing';

const moduleName = 'ovhManagerBillingAutorenewCommitment';

angular
  .module(moduleName, ['ui.router', ovhManagerBilling])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
