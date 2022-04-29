import angular from 'angular';

import autocompleteModule from './autocomplete';
import editNameModule from './edit-name';
import metricsModule from './metrics';
import spaceMeterModule from './space-meter';

const moduleName = 'ovhManagerNashaComponents';

angular.module(moduleName, [
  autocompleteModule,
  editNameModule,
  spaceMeterModule,
  metricsModule,
]);

export default moduleName;
