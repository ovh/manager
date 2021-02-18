import angular from 'angular';

import filter from './filter';

const moduleName = 'cucSshKeyMin';

angular.module(moduleName, []).filter('cucSshKeyMin', filter);

export default moduleName;
