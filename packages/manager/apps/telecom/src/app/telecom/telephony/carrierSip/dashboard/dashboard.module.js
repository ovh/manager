import angular from 'angular';
import ovhManagerCarrierSip from '@ovh-ux/manager-carrier-sip';

import uiRouter from '@uirouter/angularjs';

import cdr from './cdr';
import endpoints from './endpoints';

import routing from './dashboard.routing';

const moduleName = 'ovhManagerTelecomCarrierSipDashboard';

angular
  .module(moduleName, [ovhManagerCarrierSip, cdr, endpoints, uiRouter])
  .config(routing);

export default moduleName;
