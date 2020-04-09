import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerDedicatedIpFirewallGameRuleAdd';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipFirewallGameRuleAdd', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../../translations */);

export default moduleName;
