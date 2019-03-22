import angular from 'angular';

import filter from './filter';

const moduleName = 'ovhManagerPciComponentsRunaboveShowByte';

angular
  .module(moduleName, [])
  .filter('showByte', filter);

export default moduleName;
