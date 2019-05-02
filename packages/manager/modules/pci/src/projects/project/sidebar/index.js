import angular from 'angular';
import ngOvhSidebarMenu from '@ovh-ux/ng-ovh-sidebar-menu';

import template from './sidebar.html';
import controller from './sidebar.controller';

import cloudSidebarProjectList from './project-list/project-list.component';

const moduleName = 'ovh-manager-sidebar';

angular
  .module(moduleName, [
    ngOvhSidebarMenu,
  ])
  .component('cloudSidebar', {
    template,
    controller,
  })
  .component('cloudSidebarProjectList', cloudSidebarProjectList)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
