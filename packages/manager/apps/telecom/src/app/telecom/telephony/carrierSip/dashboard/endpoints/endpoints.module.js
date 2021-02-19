import angular from 'angular';

// Module dependencies.
import uiRouter from '@uirouter/angularjs';
import ovhManagerCarrierSip from '@ovh-ux/manager-carrier-sip';

// Routing and configuration.
import routing from './endpoints.routing';

const moduleName = 'ovhManagerTelecomCarrierSipDashboardEndpoints';

angular
  .module(moduleName, [ovhManagerCarrierSip, uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
