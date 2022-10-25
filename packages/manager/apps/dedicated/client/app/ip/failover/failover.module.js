import angular from 'angular';

import ipList from '../components/list';
import ipAlerts from '../components/alerts';

import component from './failover.component';
import routing from './failover.routing';

const moduleName = 'ovhManagerIpFailover';

angular
  .module(moduleName, [ipAlerts, ipList])
  .config(routing)
  .component('ipFailover', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
