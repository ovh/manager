import angular from 'angular';

import { PAGINATION_PER_PAGE, TASK_STATUS } from './pack-task.constants';
import component from './pack-task-slot.component';

const moduleName = 'ovhManagerPackSlotsTask';

angular
  .module(moduleName, [])
  .component('packTaskSlot', component)
  .constant('PACK_SLOTS_TASK_PAGINATION_PER_PAGE', PAGINATION_PER_PAGE)
  .constant('PACK_SLOTS_TASK_STATUS', TASK_STATUS);

export default moduleName;
