import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import {
  serverSupport,
  serverTechnicalDetails,
  serverBandwidthTile,
} from '@ovh-ux/manager-bm-server-components';
import { region, iamProtectedData } from '@ovh-ux/manager-components';
import nutanixNetworkTile from '../component/network-tile/network-tile.module';
import privateBandwidthUpgrade from './private-bandwidth-upgrade';
import routing from './routing';
import component from './component';
import editName from './edit-display-name';
import licenceTile from '../component/licence-tile/module';
import redeploy from './redeploy';
import datacenterName from '../component/datacenter-name/module';
import resiliate from './resiliate';
import addNodes from './add-nodes';

const moduleName = 'ovhManagerNutanixGeneralInfo';
angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    iamProtectedData,
    ovhManagerBillingComponents,
    serverSupport,
    serverTechnicalDetails,
    serverBandwidthTile,
    nutanixNetworkTile,
    privateBandwidthUpgrade,
    region,
    editName,
    licenceTile,
    redeploy,
    datacenterName,
    resiliate,
    addNodes,
  ])
  .config(routing)
  .component('nutanixGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
