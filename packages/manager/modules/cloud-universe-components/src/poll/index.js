import angular from 'angular';
import '@uirouter/angularjs';

import service from './service';
import ovhService from './ovh/service';

const moduleName = 'cucCommon';

angular
  .module(moduleName, ['ui.router'])
  .service('CucCloudPoll', service)
  .service('CucOvhPoll', ovhService);

export default moduleName;
