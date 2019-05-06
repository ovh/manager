import angular from 'angular';
import '@uirouter/angularjs';

import component from './ng-ovh-uirouter-breadcrumb.component';
import service from './ng-ovh-uirouter-breadcrumb.service';

import './ng-ovh-uirouter-breadcrumb.less';

const moduleName = 'ngUirouterBreadcrumb';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('ngOvhUirouterBreadcrumb', component)
  .service('ngOvhUirouterBreadcrumbService', service)
  .run(/* @ngInject */($transitions, ngOvhUirouterBreadcrumbService) => {
    $transitions.onSuccess({}, (transition) => {
      ngOvhUirouterBreadcrumbService.buildBreadcrumb(transition);
    });
  });

export default moduleName;
