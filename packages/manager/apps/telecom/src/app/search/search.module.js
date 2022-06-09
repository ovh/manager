import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import routing from './search.routing';

import telecomSearchResults from './results/results.component';
import ovhManagerTelecomTelephonyBillingAccount from '../telecom/telephony/billingAccount';

import telecomSearchResultsService from './search.service';

const moduleName = 'ovhManagerTelecomSearch';

angular
  .module(moduleName, [
    ngOvhApiWrappers,
    ovhManagerTelecomTelephonyBillingAccount,
  ])
  .config(routing)
  .component('telecomSearchResults', telecomSearchResults)
  .service('telecomSearchResultsService', telecomSearchResultsService);

export default moduleName;
