import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import status from './status';

import routing from './routing';

const moduleName = 'ovhManagerHubIncident';

angular.module(moduleName, [uiRouter, status]).config(routing);

export default moduleName;
