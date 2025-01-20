import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import {
  serverDashboard,
  serverTechnicalDetails,
  serverGeneralInformation,
  serverServiceStatus,
  serverBandwidthDashboard,
  serverNetwork,
  serverTagsTile,
  serverConsumptionTile,
  serverAdvancedFeatures,
} from '@ovh-ux/manager-bm-server-components';
import commitment from './commitment';
import cancelCommitment from './cancel-commitment';
import cancelResiliation from './cancel-resiliation';
import resiliation from './resiliation';
import terminate from '../terminate';
import upgrade from './upgrade';

import installationGabarit from './installation/gabarit';
import installationOvh from './installation/ovh';
import installationProgress from './installation/progress';

import routing from './dashboard.routing';
import {
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
} from './dashboard.constants';

const moduleName = 'ovhManagerDedicatedClusterNodeDashboard';

angular
  .module(moduleName, [
    commitment,
    cancelCommitment,
    cancelResiliation,
    atInternet,
    'oui',
    'pascalprecht.translate',
    upgrade,
    'ui.router',
    ovhManagerBillingComponents,
    resiliation,
    ovhManagerAdvices,
    terminate,
    serverGeneralInformation,
    serverTechnicalDetails,
    serverServiceStatus,
    serverBandwidthDashboard,
    serverNetwork,
    serverTagsTile,
    serverConsumptionTile,
    serverAdvancedFeatures,
    installationGabarit,
    installationOvh,
    installationProgress,
    serverDashboard,
  ])
  .config(routing)
  .constant('IMPRESSION_TRACKING_DATA', {
    COMMIT_IMPRESSION_TRACKING_DATA,
    RECOMMIT_IMPRESSION_TRACKING_DATA,
  })
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
