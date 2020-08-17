import angular from 'angular';

import billingAccount from '../billingAccount';
import carrierSip from '../carrierSip';
import linePhoneOrder from '../line/phone/order/order.module';
import linePhoneAccessories from '../line/phone/accessories/accessories.module';
import attachLine from '../line/phone/attachLine/attach.module';

const moduleName = 'ovhManagerTelecomTelephonyDashboard';

angular.module(moduleName, [
  attachLine,
  billingAccount,
  carrierSip,
  linePhoneOrder,
  linePhoneAccessories,
]);

export default moduleName;
