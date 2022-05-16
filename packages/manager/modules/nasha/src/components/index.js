import angular from 'angular';

import autocompleteModule from './autocomplete';
import editNameModule from './edit-name';
import metricsModule from './metrics';
import spaceMeterModule from './space-meter';
import partitionModule from './partition';
import tasksPollerModule from './tasks-poller';

const moduleName = 'ovhManagerNashaComponents';

angular.module(moduleName, [
  autocompleteModule,
  editNameModule,
  spaceMeterModule,
  metricsModule,
  partitionModule,
  tasksPollerModule,
]);

export default moduleName;
