/**
 *  @ngdoc directive
 *  @name sidebarMenu.directive:sidebarMenuList
 *
 *  @restrict A
 *
 *  @description
 *  <p>This directive fill manager sidebar ```<ul></ul>``` html element with given items.</p>
 *  <p>This shouln't be used outside the sidebarMenu module scope.</p>
 *
 *  @param {Array<SidebarMenuListItem>} sidebar-menu-list-items The items to be filled into list
 *  element of manager sidebar.
 */

import angular from 'angular';
import template from './template.html';

export default function() {
  return {
    template,
    restrict: 'AE',
    scope: {
      items: '=sidebarMenuListItems',
      namespace: '=sidebarMenuListNamespace',
      level: '=sidebarMenuListLevel',
    },
    require: ['^sidebarMenu', '^?sidebarMenuListItem'],
    bindToController: true,
    controllerAs: 'ListCtrl',
    controller: angular.noop,
  };
}
