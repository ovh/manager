import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import {
  serverNetwork,
  serverBandwidthDashboard,
} from '@ovh-ux/manager-bm-server-components';
import { serverBandwidth } from '@ovh-ux/manager-components';

import component from './network-tile.component';

const moduleName = 'ovhManagerNutanixNetworkTile';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngUiRouterBreadcrumb',
    'ui.router',
    serverBandwidth,
    serverBandwidthDashboard,
    serverNetwork,
  ])
  .component('nutanixNetworkTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
