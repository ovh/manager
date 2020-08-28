import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';
import ovhManagerCarrierSip from '@ovh-ux/manager-carrier-sip';

// Routing and configuration.
import routing from './cdr.routing';

const moduleName = 'ovhManagerTelecomCarrierSipDashboardCdr';

angular
  .module(moduleName, [ovhManagerCarrierSip, uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
