import angular from 'angular';

import filter from './bits/filter';

const moduleName = 'ovhManagerPciComponentsRunaboveUnits';

angular.module(moduleName, []).filter('RAUnitsBits', filter);

export default moduleName;
