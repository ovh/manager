import angular from 'angular';

import { BANK_HOLIDAYS } from './bank-holidays.constant';

import TucBankHolidays from './bank-holidays.service';

const moduleName = 'tucBankHolidays';

angular
  .module(moduleName, [])
  .constant('BANK_HOLIDAYS', BANK_HOLIDAYS)
  .service('TucBankHolidays', TucBankHolidays);

export default moduleName;
