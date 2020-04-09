import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import antispam from './antispam';
import filterAvailableIpText from './filters/availableIpText';
import filterIpFilterByService from './filters/ipFilterByService';
import filterIpFirewallRulePort from './filters/ipFirewallRulePort';
import filterIpPunycode from './filters/ipPunycode';
import firewall from './firewall';

import component from './ip.component';
import ipExpandIpv6 from './ip-expand-ipv6.service';
import ipFeatureAvailability from './ip-feature-availability.service';
import ipRange from './ip-range.service';
import routing from './ip.routing';

const moduleName = 'ovhManagerDedicatedIp';

angular
  .module(moduleName, [
    antispam,
    firewall,
    'ngOvhUtils',
    'ngRoute',
    'ngSanitize',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .filter('availableIpText', filterAvailableIpText)
  .filter('ipFilterByService', filterIpFilterByService)
  .filter('ipFirewallRulePort', filterIpFirewallRulePort)
  .filter('ipPunycode', filterIpPunycode)
  .component('ip', component)
  .config(routing)
  .service('IpExpandIpv6', ipExpandIpv6)
  .service('ipFeatureAvailability', ipFeatureAvailability)
  .service('IpRange', ipRange)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
