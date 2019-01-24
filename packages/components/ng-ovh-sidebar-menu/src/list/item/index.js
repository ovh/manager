import angular from 'angular';
import 'angular-vs-repeat';

import factory from './factory';
import directive from './directive';

const moduleName = 'ngOvhSidebarMenuListItem';

angular
  .module(moduleName, ['vs-repeat'])
  .factory('SidebarMenuListItem', factory)
  .directive('sidebarMenuListItem', directive);

export default moduleName;
