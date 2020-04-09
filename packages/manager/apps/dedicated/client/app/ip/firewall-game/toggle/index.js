import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './toggle.component';
import routing from './toggle.routing';

const moduleName = 'ovhManagerDedicatedIpFirewallGameToggle';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipFirewallGameToggle', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
