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
  serverConsumptionTile,
  serverAdvancedFeatures,
} from '@ovh-ux/manager-bm-server-components';
import commitment from './commitment';
import cancelCommitment from './cancel-commitment';
import cancelResiliation from './cancel-resiliation';
import resiliation from './resiliation';
import terminate from '../terminate';
import upgrade from './upgrade';

import installationChoice from './installation/choice';
import installationGabarit from './installation/gabarit';
import installationOvh from './installation/ovh';
import installationProgress from './installation/progress';
import install from '../install';

import routing from './dashboard.routing';

const moduleName = 'ovhManagerDedicatedServerDashboard';

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
    serverConsumptionTile,
    serverAdvancedFeatures,
    installationChoice,
    installationGabarit,
    installationOvh,
    installationProgress,
    install,
    serverDashboard,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
