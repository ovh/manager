import angular from 'angular';
import '@uirouter/angularjs';

import cuiTabs from '../cui/tabs';
import service from './service';

const moduleName = 'cucNavigation';

angular
  .module(moduleName, [cuiTabs, 'ui.router'])
  .service('CucCloudNavigation', service);

export default moduleName;
