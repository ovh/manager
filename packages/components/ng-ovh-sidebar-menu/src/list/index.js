import angular from 'angular';

import ngOvhSidebarMenuListItem from './item';
import directive from './directive';

const moduleName = 'ngOvhSidebarMenuList';

angular
  .module(moduleName, [ngOvhSidebarMenuListItem])
  .directive('sidebarMenuList', directive);

export default moduleName;
