import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './order-legacy.component';
import controller from './order-legacy.controller';
import routing from './order-legacy.routing';
import service from './order-legacy.service';

const moduleName = 'ovhManagerDedicatedIpDashboardOrderLegacy';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardOrderLegacy', component)
  .controller('ipDashboardOrderLegacyController', controller)
  .service('IpDashboardOrderLegacy', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
