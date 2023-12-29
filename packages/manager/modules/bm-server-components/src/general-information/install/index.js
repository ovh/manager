import angular from 'angular';

import '@uirouter/angularjs';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import image from './image';

const moduleName = 'ovhManagerBmServerComponentsDashboardServerInstall';

angular.module(moduleName, ['ui.router', ngUiRouterBreadcrumb, image]);

export default moduleName;
