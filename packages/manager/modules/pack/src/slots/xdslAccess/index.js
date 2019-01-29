import angular from 'angular';

import component from './pack-xdslAccess.component';

const moduleName = 'ovhManagerPackSlotsXdslAccess';

angular
  .module(moduleName, [])
  .component('packXdslAccessSlot', component);

export default moduleName;
