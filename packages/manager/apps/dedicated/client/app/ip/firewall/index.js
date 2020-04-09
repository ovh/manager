import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import rule from './rule';

import component from './firewall.component';
import routing from './firewall.routing';
import service from './firewall.service';

const moduleName = 'ovhManagerDedicatedIpFirewall';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', rule, 'ui.router'])
  .component('ipFirewall', component)
  .service('IpFirewall', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
