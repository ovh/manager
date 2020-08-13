import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-sidebar-menu';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';
import 'ovh-api-services';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import { ORDER_URLS } from './order.constants';

import sidebarComponent from './component';

import './index.less';

export { ORDER_URLS };

const moduleName = 'ovhManagerServerSidebar';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSidebarMenu',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'ovh-api-services',
    'oui',
    ngOvhFeatureFlipping,
  ])
  .component('ovhManagerServerSidebar', sidebarComponent)
  .provider(
    'OVH_ORDER_URLS',
    /* @ngInject */ (coreConfigProvider) => ({
      $get: () => ORDER_URLS[coreConfigProvider.getRegion()],
    }),
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
