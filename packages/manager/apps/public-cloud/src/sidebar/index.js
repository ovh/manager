import angular from 'angular';
import ngOvhSidebarMenu from '@ovh-ux/ng-ovh-sidebar-menu';

import template from './sidebar.html';
import controller from './sidebar.controller';

import '@fortawesome/fontawesome-free/css/all.min.css';

import cloudSidebarProjectList from './project-list/project-list.component';

import './sidebar.less';

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
