import angular from 'angular';
import '@uirouter/angularjs';

import component from './ng-uirouter-breadcrumb.component';
import service from './ng-uirouter-breadcrumb.service';

import './ng-uirouter-breadcrumb.less';

const moduleName = 'ngUirouterBreadcrumb';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('uirouterBreadcrumb', component)
  .service('uirouterBreadcrumbService', service)
  .run(/* @ngInject */($transitions, uirouterBreadcrumbService) => {
    $transitions.onSuccess({}, (transition) => {
      uirouterBreadcrumbService.buildBreadcrumb(transition);
    });
  });

export default moduleName;
