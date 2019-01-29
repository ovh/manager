import angular from 'angular';

import { EXCHANGE_ACCOUNT_URL } from './pack-exchangeAccount.constants';
import component from './pack-exchangeAccount-slot.component';

const moduleName = 'ovhManagerPackSlotsExchangeAccount';

angular
  .module(moduleName, [])
  .constant('PACK_SLOTS_EXCHANGE_ACCOUNT_URL', EXCHANGE_ACCOUNT_URL)
  .component('packExchangeAccountSlot', component);

export default moduleName;
