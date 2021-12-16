import angular from 'angular';
import '@uirouter/angularjs';

import startComponent from '../../../components/start';
import routing from './start.routing';

const moduleName = 'ovhManagerPciAppsAppDashboardAppStart';

angular.module(moduleName, ['ui.router', startComponent]).config(routing);

export default moduleName;
