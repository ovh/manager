import angular from 'angular';
import '@uirouter/angularjs';

import component from './component';
import tabDirective from './tab/directive';
import service from './service';

import './index.less';

const moduleName = 'cuiTabs';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('cuiTabs', component)
  .directive('cuiTab', tabDirective)
  .service('CuiTabsService', service);

export default moduleName;
