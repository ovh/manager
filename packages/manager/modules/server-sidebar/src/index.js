import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-sidebar-menu';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';
import 'ovh-api-services';

import sidebarComponent from './component';

import './index.less';

const moduleName = 'ovhManagerServerSidebar';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSidebarMenu',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'ovh-api-services',
    'oui',
  ])
  .component('ovhManagerServerSidebar', sidebarComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
