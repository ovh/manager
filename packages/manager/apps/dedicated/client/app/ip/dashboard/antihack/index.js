import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './antihack.component';
import routing from './antihack.routing';
import service from './antihack.service';

const moduleName = 'ovhManagerDedicatedIpDashboardAntihack';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardAntihack', component)
  .service('IpDashboardAntihack', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
