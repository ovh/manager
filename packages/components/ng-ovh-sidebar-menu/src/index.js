/**
 *  @ngdoc overview
 *  @name sidebarMenu
 *  @description
 *  # Sidebar Menu
 *
 *  Manage and display a left menu tree. This is the main module which holds everything together!
 *  See README for more informations.
 */

import angular from 'angular';

import '@ovh-ux/ng-ovh-actions-menu';
import '@uirouter/angularjs';
import 'angular-translate';

import ngOvhSidebarMenuList from './list';

import directive from './directive';
import provider from './provider';

import './index.less';

const moduleName = 'ngOvhSidebarMenu';

angular
  .module(moduleName, [
    'ngOvhActionsMenu',
    ngOvhSidebarMenuList,
    'pascalprecht.translate',
    'ui.router',
  ])
  .provider('SidebarMenu', provider)
  .directive('sidebarMenu', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
