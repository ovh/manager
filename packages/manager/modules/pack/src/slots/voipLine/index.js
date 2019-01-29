import angular from 'angular';

import component from './pack-voipLine-slot.component';

const moduleName = 'ovhManagerPackSlotsVoipLine';

angular
  .module(moduleName, [])
  .component('packVoipLineSlot', component);

export default moduleName;
