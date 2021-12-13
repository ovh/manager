import angular from 'angular';
import '@uirouter/angularjs';

import stopApp from '../components/stop-app';
import routing from './stop-app.routing';

const moduleName = 'ovhManagerPciAppsStop';

angular.module(moduleName, ['ui.router', stopApp]).config(routing);

export default moduleName;
