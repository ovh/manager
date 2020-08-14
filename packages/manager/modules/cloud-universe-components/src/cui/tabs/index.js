import angular from 'angular';
import '@uirouter/angularjs';

import service from './service';

const moduleName = 'cuiTabs';

angular.module(moduleName, ['ui.router']).service('CuiTabsService', service);

export default moduleName;
