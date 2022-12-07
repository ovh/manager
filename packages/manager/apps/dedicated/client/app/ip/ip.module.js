import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';
import translate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import ipModule from './ip/ip.module';

import dedicatedCloud from '../components/dedicated-cloud';

import availableTextFilter from './filters/ip/availableIpText/availableIpTextFilter';
import ipFilterByService from './filters/ip/ipFilterByService/ipServiceCollapsed';
import ipFirewallRulePort from './filters/ip/ipFirewallRulePort/ipFirewallRulePort';
import ipPunycode from './filters/ip/ipPunycode/ipPunycode';
import byoip from './byoip';

import routing from './ip.routing';

const moduleName = 'Ip';

angular
  .module(moduleName, [
    dedicatedCloud,
    ipModule,
    'ngOvhUtils',
    'ngRoute',
    'ngSanitize',
    ngTranslateAsyncLoader,
    ovhManagerCore,
    translate,
    uiRouter,
    'ui.bootstrap',
    byoip,
  ])
  .config(routing)
  .filter('availableIpText', availableTextFilter)
  .filter('ipFilterByService', ipFilterByService)
  .filter('ipFirewallRulePort', ipFirewallRulePort)
  .filter('ipPunycode', ipPunycode)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
