import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceAssistOrders from '../../../service/assist/orders';

import routing from './orders.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineAssistOrders';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceAssistOrders,
  ])
  .config(routing);

export default moduleName;
