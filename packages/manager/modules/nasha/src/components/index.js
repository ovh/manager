import angular from 'angular';

import autocompleteModule from './autocomplete';
import editNameModule from './edit-name';
import metricsModule from './metrics';
import spaceMeterModule from './space-meter';
import partitionModule from './partition';
import taskTrackerModule from './task-tracker';

const moduleName = 'ovhManagerNashaComponents';

angular.module(moduleName, [
  autocompleteModule,
  editNameModule,
  spaceMeterModule,
  metricsModule,
  partitionModule,
  taskTrackerModule,
]);

export default moduleName;
