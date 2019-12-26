import angular from 'angular';

import tucTelecomTelephonyAbbreviatedNumbers from './abbreviatedNumbers';
import tucTelecomTelephonyAccessories from './accessories';
import tucTelecomTelephonyBulkAction from './bulkAction';
import tucTelecomTelephonyCallsFiltering from './callsFiltering';
import tucTelecomTelephonyNumberPlans from './number-plans';
import tucTelecomTelephonyPhonebookcontact from './phonebookcontact';
import tucTelecomTelephonyScreen from './screen';
import tucTelecomTelephonyService from './service';

const moduleName = 'tucTelecomTelephony';

angular.module(moduleName, [
  tucTelecomTelephonyAbbreviatedNumbers,
  tucTelecomTelephonyAccessories,
  tucTelecomTelephonyBulkAction,
  tucTelecomTelephonyCallsFiltering,
  tucTelecomTelephonyNumberPlans,
  tucTelecomTelephonyPhonebookcontact,
  tucTelecomTelephonyScreen,
  tucTelecomTelephonyService,
]);

export default moduleName;
