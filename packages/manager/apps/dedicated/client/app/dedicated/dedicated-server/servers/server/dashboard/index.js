import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import {
  serverTechnicalDetails,
  serverGeneralInformation,
  serverServiceStatus,
  serverBandwidthDashboard,
  serverNetwork,
  serverConsumptionTile,
  serverAdvancedFeatures,
  serverProfessionalUse,
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

import component from './dashboard.component';
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
    serverProfessionalUse,
    installationChoice,
    installationGabarit,
    installationOvh,
    installationProgress,
  ])
  .component('dedicatedServerDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
