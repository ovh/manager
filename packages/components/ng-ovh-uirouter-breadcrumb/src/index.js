import angular from 'angular';
import '@uirouter/angularjs';

import component from './ng-ovh-uirouter-breadcrumb.component';

import './ng-ovh-uirouter-breadcrumb.less';

const moduleName = 'ngUirouterBreadcrumb';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('ngOvhUirouterBreadcrumb', component);

export default moduleName;
