import angular from 'angular';
import '@uirouter/angularjs';

import activate from './activate.module';

const moduleName = 'ovhManagerWebDomainZoneActivate';

angular.module(moduleName, ['ui.router', activate]);

export default moduleName;
