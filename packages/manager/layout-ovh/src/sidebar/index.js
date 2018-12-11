import angular from 'angular';
import sidebarMenu from 'ovh-angular-sidebar-menu';

import { SIDEBAR_CONFIG, STATE_MAPPING_SERVICE } from './sidebar.constants';

import template from './sidebar.html';
import controller from './sidebar.controller';

const moduleName = 'ovh-manager-sidebar';

angular
  .module(moduleName, [sidebarMenu])
  .component('ovhManagerSidebar', {
    template,
    controller,
  })
  .constant('SIDEBAR_CONFIG', SIDEBAR_CONFIG)
  .constant('SIDEBAR_STATE_MAPPING_SERVICE', STATE_MAPPING_SERVICE)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
