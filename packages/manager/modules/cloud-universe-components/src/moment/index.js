import angular from 'angular';

import filter from './moment.filter';

const moduleName = 'cucMomentFormat';

angular.module(moduleName, []).filter('cucMomentFormat', filter);

export default moduleName;
