import angular from 'angular';
import '@uirouter/angularjs';

import service from './service';

const moduleName = 'cucMessage';

angular.module(moduleName, ['ui.router']).service('CucCloudMessage', service);

export default moduleName;
