import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerLogToCustomer from '@ovh-ux/manager-log-to-customer';
import liveTail from './live-tail';
import dataStreams from './data-streams';

import routing from './logs.routing';
import ExchangeLogsService from './logs.service';

const moduleName = 'ovhManagerExchangeDashboardLogs';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerLogToCustomer,
    liveTail,
    dataStreams,
  ])
  .service('exchangeLogsService', ExchangeLogsService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
