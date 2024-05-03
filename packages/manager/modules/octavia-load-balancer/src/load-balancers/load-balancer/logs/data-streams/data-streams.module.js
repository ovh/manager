import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './data-streams.component';
import routing from './data-streams.routing';

const moduleName = 'ovhManagerPciProjectKubernetesDetailsAuditLogsDataStreams';
angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('octaviaLoadBalancerLogsDataStreams', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
