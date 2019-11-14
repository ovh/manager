import angular from 'angular';

import billingAccount from './billingAccount';
import carrierSip from './carrierSip';

import routing from './telephony.routing';

const moduleName = 'ovhManagerTelecomTelephony';

angular
  .module(moduleName, [
    billingAccount,
    carrierSip,
  ])
  .config(routing);

export default moduleName;
