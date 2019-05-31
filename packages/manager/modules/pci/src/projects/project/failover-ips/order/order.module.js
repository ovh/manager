import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';

import agoraOrder from './agora';
import legacyOrder from './legacy';
import routing from './order.routing';

const moduleName = 'ovhManagerPciProjectFailoverIpsOrder';

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
