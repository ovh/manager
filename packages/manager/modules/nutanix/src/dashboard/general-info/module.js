import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import {
  serverSupport,
  serverTechnicalDetails,
} from '@ovh-ux/manager-bm-server-components';
import { region } from '@ovh-ux/manager-components';
import nutanixNetworkTile from '../component/network-tile/network-tile.module';
import routing from './routing';
import component from './component';
import editName from './edit-display-name';

const moduleName = 'ovhManagerNutanixGeneralInfo';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerBillingComponents,
    serverSupport,
    serverTechnicalDetails,
    nutanixNetworkTile,
    region,
    editName,
  ])
  .config(routing)
  .component('nutanixGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
