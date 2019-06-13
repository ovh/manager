import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';

import order from './order';
import legacyOrder from './legacy';
import routing from './order.routing';

const moduleName = 'ovhManagerPciProjectFailoverIpsOrder';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
    'ovhManagerCore',
    order,
    legacyOrder,
  ])
  .config(routing);

export default moduleName;
