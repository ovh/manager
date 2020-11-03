import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import routing from './search.routing';

import telecomSearchResults from './results/results.component';
import ovhManagerTelecomTelephonyBillingAccount from '../telecom/telephony/billingAccount';

const moduleName = 'ovhManagerTelecomSearch';

angular
  .module(moduleName, [
    ngOvhApiWrappers,
    ovhManagerTelecomTelephonyBillingAccount,
  ])
  .config(routing)
  .component('telecomSearchResults', telecomSearchResults);

export default moduleName;
