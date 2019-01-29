import angular from 'angular';
import 'ovh-angular-q-allsettled';
import 'ovh-api-services';
import { HUBIC_LOGIN_URL, HUBIC_VOUCHER_URL } from './pack-hubic-slot.constants';
import component from './pack-hubic-slot.component';

const moduleName = 'ovhManagerPackSlotsHubic';

angular
  .module(moduleName, [
    'ovh-angular-q-allSettled',
    'ovh-api-services',
  ])
  .constant('PACK_SLOTS_HUBIC_LOGIN_URL', HUBIC_LOGIN_URL)
  .constant('PACK_SLOTS_HUBIC_VOUCHER_URL', HUBIC_VOUCHER_URL)
  .component('packHubicSlot', component);

export default moduleName;
