import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './ip.component';
import ipExpandIpv6 from './ip-expand-ipv6.service';
import ipFeatureAvailability from './ip-feature-availability.service';
import ipRange from './ip-range.service';
import routing from './ip.routing';

const moduleName = 'ovhManagerDedicatedIp';

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ngRoute',
    'ngSanitize',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('ip', component)
  .config(routing)
  .service('IpExpandIpv6', ipExpandIpv6)
  .service('ipFeatureAvailability', ipFeatureAvailability)
  .service('IpRange', ipRange)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
