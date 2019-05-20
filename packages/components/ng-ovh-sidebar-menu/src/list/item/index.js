import angular from 'angular';
import 'ng-slide-down';

import factory from './factory';
import directive from './directive';

const moduleName = 'ngOvhSidebarMenuListItem';

angular
  .module(moduleName, ['ng-slide-down'])
  .factory('SidebarMenuListItem', factory)
  .directive('sidebarMenuListItem', directive);

export default moduleName;
