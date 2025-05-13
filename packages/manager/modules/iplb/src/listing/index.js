import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';

import IpLoadBalancerTerminateCtrl from '../modal/terminate/terminate.controller';
import iplbListing from './listing.component';
import route from './listing.route';

const moduleName = 'iplbListing';

angular
  .module(moduleName, ['oui', 'ui.router', 'ovhManagerCore'])
  .controller('IpLoadBalancerTerminateCtrl', IpLoadBalancerTerminateCtrl)
  .component('iplbListing', iplbListing)
  .config(route)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
