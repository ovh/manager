import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import routing from './commitment.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardCommitment';

angular
  .module(moduleName, ['ui.router', ovhManagerBillingComponents])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
