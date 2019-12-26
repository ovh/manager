import angular from 'angular';
import 'ovh-api-services';

import { TELEPHONY_LINE_PHONE_ACCESSORIES } from './telephony-accessories.constant';
import TucTelephonyAccessoriesOrderProcess from './telephony-accessories-order-process.service';

const moduleName = 'tucTelecomTelephonyAccessories';

angular
  .module(moduleName, ['ovh-api-services'])
  .constant(
    'TUC_TELEPHONY_LINE_PHONE_ACCESSORIES',
    TELEPHONY_LINE_PHONE_ACCESSORIES,
  )
  .service(
    'TucTelephonyAccessoriesOrderProcess',
    TucTelephonyAccessoriesOrderProcess,
  );

export default moduleName;
