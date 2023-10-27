import angular from 'angular';
import '@uirouter/angularjs';

import history from './history.module';

const moduleName = 'ovhManagerWebDomainZoneHistory';

angular.module(moduleName, ['ui.router', history]);

export default moduleName;
