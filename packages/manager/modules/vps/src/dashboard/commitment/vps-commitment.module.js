import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBilling from '@ovh-ux/manager-billing';

import routing from './vps-commitment.routing';

const moduleName = 'ovhManagerVpsCommitment';

angular
  .module(moduleName, ['ui.router', ovhManagerBilling])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
