import angular from 'angular';

import '@uirouter/angularjs';

import image from './image';

const moduleName = 'ovhManagerBmServerComponentsDashboardServerInstall';

angular.module(moduleName, ['ui.router', image]);

export default moduleName;
