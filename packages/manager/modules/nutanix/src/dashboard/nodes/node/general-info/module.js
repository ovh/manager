import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import {
  serverSupport,
  serverNetwork,
  serverBandwidthDashboard,
  serverTechnicalDetails,
} from '@ovh-ux/manager-bm-server-components';

import component from './component';
import routing from './routing';
import netboot from './netboot';
import reboot from './reboot';
import bandwidthPrivateOrder from './bandwidth-private-order';
import datacenterName from '../../../component/datacenter-name/module';

const moduleName = 'ovhManagerNutanixNodeGeneralInfo';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngUiRouterBreadcrumb',
    'ui.router',
    netboot,
    ngOvhUtils,
    serverNetwork,
    serverSupport,
    serverTechnicalDetails,
    serverBandwidthDashboard,
    bandwidthPrivateOrder,
    reboot,
    datacenterName,
  ])
  .config(routing)
  .component('nutanixNodeGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
