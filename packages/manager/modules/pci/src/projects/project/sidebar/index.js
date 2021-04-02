import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-feature-flipping';

import component from './sidebar.component';
import cloudSidebarProjectList from './project-list/project-list.component';

const moduleName = 'ovh-manager-sidebar';

angular
  .module(moduleName, ['ngAtInternet', 'ngOvhFeatureFlipping'])
  .component('cloudSidebar', component)
  .component('cloudSidebarProjectList', cloudSidebarProjectList)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
