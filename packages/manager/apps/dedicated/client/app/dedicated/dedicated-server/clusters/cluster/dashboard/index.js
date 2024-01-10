import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import {
  clusterDashboard,
  clusterGeneralInformation,
} from '@ovh-ux/manager-bm-cluster-components';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import { serverSupport } from '@ovh-ux/manager-bm-server-components';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerDedicatedClusterDashboard';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerBillingComponents,
    serverSupport,
    clusterDashboard,
    clusterGeneralInformation,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
