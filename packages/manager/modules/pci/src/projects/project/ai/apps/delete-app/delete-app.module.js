import angular from 'angular';
import '@uirouter/angularjs';

import deleteDatabase from '../components/delete-app';
import routing from './delete-app.routing';

const moduleName = 'ovhManagerPciAppsDelete';

angular.module(moduleName, ['ui.router', deleteDatabase]).config(routing);

export default moduleName;
