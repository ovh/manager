import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './arp.component';
import routing from './arp.routing';
import service from './arp.service';

const moduleName = 'ovhManagerDedicatedIpDashboardArp';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardArp', component)
  .service('IpDashboardArp', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
