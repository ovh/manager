import angular from 'angular';

import template from './sidebar.html';
import controller from './sidebar.controller';

import cloudSidebarProjectList from './project-list/project-list.component';
import service from './sidebar.service';

const moduleName = 'ovh-manager-sidebar';

angular
  .module(moduleName, [
  ])
  .component('cloudSidebar', {
    template,
    controller,
  })
  .component('cloudSidebarProjectList', cloudSidebarProjectList)
  .service('CloudSidebar', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
