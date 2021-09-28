import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './time-range.component';

const moduleName = 'ovhManagerPciStoragesDatabasesTimeRange';

angular
  .module(moduleName, ['oui'])
  .component('timeRange', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
