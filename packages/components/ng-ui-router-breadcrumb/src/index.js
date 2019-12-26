import angular from 'angular';
import '@uirouter/angularjs';

import component from './ng-ui-router-breadcrumb.component';
import service from './ng-ui-router-breadcrumb.service';

import './ng-ui-router-breadcrumb.less';

const moduleName = 'ngUiRouterBreadcrumb';

angular
  .module(moduleName, ['ui.router'])
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
