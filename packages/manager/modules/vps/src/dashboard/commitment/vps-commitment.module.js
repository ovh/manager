import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import routing from './vps-commitment.routing';

const moduleName = 'ovhManagerVpsCommitment';

angular
  .module(moduleName, ['ui.router', ovhManagerBillingComponents])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
