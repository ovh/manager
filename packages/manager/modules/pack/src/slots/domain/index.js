import angular from 'angular';

import { DOMAIN_URL } from './pack-domain.constants';
import component from './pack-domain-slot.component';

const moduleName = 'ovhManagerPackSlotsDomain';

angular
  .module(moduleName, [])
  .component('packDomainSlot', component)
  .constant('PACK_SLOTS_DOMAIN_URL', DOMAIN_URL);

export default moduleName;
