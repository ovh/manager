import angular from 'angular';
import '@ovh-ux/ng-pagination-front';
import component from './pack-informations-slot.component';

const moduleName = 'ovhManagerPackSlotsInformations';

angular
  .module(moduleName, [
    'ngPaginationFront',
  ])
  .component('packInformationsSlot', component);

export default moduleName;
