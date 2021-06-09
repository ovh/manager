import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';

import billingAutorenewService from '../../../../billing/autoRenew/autorenew.service';
import routing from './cancel-resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelResiliation';

angular
  .module(moduleName, ['ui.router', ovhManagerBillingComponents])
  .config(routing)
  .service('BillingAutoRenewService', billingAutorenewService);

export default moduleName;
