import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerBilling from '@ovh-ux/manager-billing';

import billingAutorenewService from '../../../../billing/autoRenew/autorenew.service';
import routing from './cancel-resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelResiliation';

angular
  .module(moduleName, ['ui.router', ovhManagerBilling])
  .config(routing)
  .service('BillingAutoRenewService', billingAutorenewService);

export default moduleName;
