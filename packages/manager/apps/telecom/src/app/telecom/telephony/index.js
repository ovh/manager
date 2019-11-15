import angular from 'angular';

import billingAccount from './billingAccount';
import carrierSip from './carrierSip';

import component from './telephony.component';
import routing from './telephony.routing';
import service from './telephony.service';

const moduleName = 'ovhManagerTelecomTelephony';

angular
  .module(moduleName, [
    billingAccount,
    carrierSip,
  ])
  .config(routing)
  .component('telecomTelephony', component)
  .service('TelecomTelephonyService', service);

export default moduleName;
