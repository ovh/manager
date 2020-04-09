import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './order.component';
import controller from './order.controller';
import routing from './order.routing';
import service from './order.service';

const moduleName = 'ovhManagerDedicatedIpDashboardOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardOrder', component)
  .controller('ipDashboardOrderController', controller)
  .service('IpDashboardOrder', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
