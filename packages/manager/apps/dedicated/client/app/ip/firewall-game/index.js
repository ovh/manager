import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import rule from './rule';
import toggle from './toggle';

import component from './firewall-game.component';
import routing from './firewall-game.routing';
import service from './firewall-game.service';

const moduleName = 'ovhManagerDedicatedIpFirewallGame';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    rule,
    toggle,
    'ui.router',
  ])
  .component('ipFirewallGame', component)
  .service('IpGameFirewall', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
