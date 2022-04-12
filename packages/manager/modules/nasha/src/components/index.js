import angular from 'angular';

import autocompleteModule from './autocomplete';
import metricsModule from './metrics';
import spaceMeterModule from './space-meter';

const moduleName = 'ovhManagerNashaComponents';

angular.module(moduleName, [
  autocompleteModule,
  spaceMeterModule,
  metricsModule,
]);

export default moduleName;
