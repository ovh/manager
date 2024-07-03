import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/manager-log-to-customer';

import component from './logs.component';
import routing from './logs.routing';
import service from './logs.service';

import dataStreams from './data-streams';

const moduleName = 'ovhManagerOctaviaLoadBalancerLogs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerLogToCustomer',
    dataStreams,
  ])
  .config(routing)
  .component('octaviaLoadBalancerLogs', component)
  .service('logsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
