import angular from 'angular';
import '@uirouter/angularjs';

import serviceAssistOrders from '../../../service/assist/orders';

import routing from './orders.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxAssistOrders';

angular.module(moduleName, ['ui.router', serviceAssistOrders]).config(routing);

export default moduleName;
