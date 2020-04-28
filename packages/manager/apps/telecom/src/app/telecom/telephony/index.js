import angular from 'angular';

import billingAccount from './billingAccount';
import carrierSip from './carrierSip';
import linePhoneOrder from './line/phone/order/order.module';
import linePhoneAccessories from './line/phone/accessories/accessories.module';
import attachLine from './line/phone/attachLine/attach.module';

import component from './telephony.component';
import routing from './telephony.routing';
import service from './telephony.service';

const moduleName = 'ovhManagerTelecomTelephony';

angular
  .module(moduleName, [
    attachLine,
    billingAccount,
    carrierSip,
    linePhoneOrder,
    linePhoneAccessories,
  ])
  .config(routing)
  .component('telecomTelephony', component)
  .service('TelecomTelephonyService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
