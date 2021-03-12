import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import migration from './migration';
import status from './status';

import routing from './routing';

const moduleName = 'ovhManagerHubIncident';

angular.module(moduleName, [uiRouter, migration, status]).config(routing);

export default moduleName;
