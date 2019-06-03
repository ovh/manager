import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';

import agoraOrder from '../../order/agora';
import legacyOrder from '../../order/legacy';
import routing from './order.routing';

const moduleName = 'ovhManagerPciProjectFailoverIpsOnboardingOrder';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
    'ovhManagerCore',
    agoraOrder,
    legacyOrder,
  ])
  .config(routing);

export default moduleName;
