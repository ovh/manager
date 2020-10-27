import angular from 'angular';

import billingAccount from '../billingAccount';
import carrierSip from '../carrierSip';
import linePhoneOrder from '../line/phone/order';
import linePhoneAccessories from '../line/phone/accessories';
import attachLine from '../line/phone/attachLine';

const moduleName = 'ovhManagerTelecomTelephonyDashboard';

angular.module(moduleName, [
  attachLine,
  billingAccount,
  carrierSip,
  linePhoneOrder,
  linePhoneAccessories,
]);

export default moduleName;
