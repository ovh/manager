import angular from 'angular';

import { TELEPHONY_NUMBER_PLANS } from './number-plans.constant';
import TucNumberPlans from './number-plans.service';

const moduleName = 'tucTelecomTelephonyNumberPlans';

angular
  .module(moduleName, [])
  .constant('TUC_TELEPHONY_NUMBER_PLANS', TELEPHONY_NUMBER_PLANS)
  .service('TucNumberPlans', TucNumberPlans);

export default moduleName;
