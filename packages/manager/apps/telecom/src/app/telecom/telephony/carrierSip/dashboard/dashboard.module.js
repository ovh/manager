import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';

import cdr from './cdr';
import endpoints from './endpoints';

// Routing and configuration.
import routing from './dashboard.routing';

const moduleName = 'ovhManagerTelecomCarrierSipDashboard';

angular.module(moduleName, [cdr, endpoints, uiRouter]).config(routing);

export default moduleName;
