import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import advancedFeatures from './advanced-features';
import commitment from './commitment';
import cancelCommitment from './cancel-commitment';
import cancelResiliation from './cancel-resiliation';
import resiliation from './resiliation';
import professionalUse from './professional-use';
import technicalDetails from './technical-details';
import terminate from '../terminate/terminate.module';
import upgradeRequest from './upgrade-request';

import component from './dashboard.component';
import routing from './dashboard.routing';

import {
  serverGeneralInfo,
  serverNetwork,
} from '@ovh-ux/manager-bm-server-components';

const moduleName = 'ovhManagerDedicatedServerDashboard';

angular
  .module(moduleName, [
    advancedFeatures,
    commitment,
    cancelCommitment,
    cancelResiliation,
    atInternet,
    'oui',
    'pascalprecht.translate',
    professionalUse,
    technicalDetails,
    upgradeRequest,
    'ui.router',
    ovhManagerBillingComponents,
    resiliation,
    ovhManagerAdvices,
    terminate,
    serverGeneralInfo,
    serverNetwork,
  ])
  .component('dedicatedServerDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
