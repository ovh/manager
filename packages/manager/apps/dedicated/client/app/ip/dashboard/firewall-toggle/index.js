import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './firewall-toggle.component';
import routing from './firewall-toggle.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardFirewallToggle';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardFirewallToggle', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
