import angular from 'angular';
import '@uirouter/angularjs';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerIplbChangeOfferModule';

angular
  .module(moduleName, ['ui.router'])
  .component('iplbChangeOffer', component)
  .service('IpLoadBalancerChangeOfferService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
