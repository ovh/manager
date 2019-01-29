import angular from 'angular';
import ngOvhSidebarMenu from '@ovh-ux/ng-ovh-sidebar-menu';

import { SIDEBAR_CONFIG, STATE_MAPPING_SERVICE } from './sidebar.constants';

import template from './sidebar.html';
import controller from './sidebar.controller';

import './sidebar.less';

const moduleName = 'ovh-manager-sidebar';

angular
  .module(moduleName, [ngOvhSidebarMenu])
  .component('ovhManagerSidebar', {
    template,
    controller,
  })
  .constant('SIDEBAR_CONFIG', SIDEBAR_CONFIG)
  .constant('SIDEBAR_STATE_MAPPING_SERVICE', STATE_MAPPING_SERVICE)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
