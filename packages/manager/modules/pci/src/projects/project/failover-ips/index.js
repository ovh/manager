import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import failoverIp from './failover-ip';
import imports from './imports';
import routing from './failover-ips.routing';

const moduleName = 'ovhManagerPciProjectFailoverIps';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
    failoverIp,
    imports,
  ])
  .config(routing);

export default moduleName;
