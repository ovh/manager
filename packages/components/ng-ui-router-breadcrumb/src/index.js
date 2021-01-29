import angular from 'angular';
import '@uirouter/angularjs';

import '@ovh-ux/ng-breadcrumb';

import component from './ng-ui-router-breadcrumb.component';
import service from './ng-ui-router-breadcrumb.service';

const moduleName = 'ngUiRouterBreadcrumb';

angular
  .module(moduleName, ['ui.router', 'ngBreadcrumb'])
  .component('uiRouterBreadcrumb', component)
  .service('uiRouterBreadcrumbService', service)
  .run(
    /* @ngInject */ ($transitions, uiRouterBreadcrumbService) => {
      $transitions.onSuccess({}, (transition) => {
        uiRouterBreadcrumbService.buildBreadcrumb(transition);
      });
    },
  );

export default moduleName;
