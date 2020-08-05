import angular from 'angular';

import billingAccount from './account/billingAccount';
import carrierSip from './account/carrierSip';
import linePhoneOrder from './account/line/phone/order/order.module';
import linePhoneAccessories from './account/line/phone/accessories/accessories.module';
import attachLine from './account/line/phone/attachLine/attach.module';

import component from './telephony.component';
import routing from './telephony.routing';

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
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
