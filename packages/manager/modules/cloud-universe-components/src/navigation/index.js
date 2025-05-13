import angular from 'angular';
import '@uirouter/angularjs';

import service from './service';

const moduleName = 'cucNavigation';

angular
  .module(moduleName, ['ui.router'])
  .service('CucCloudNavigation', service);

export default moduleName;
