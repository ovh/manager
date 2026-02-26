import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerLogToCustomer from '@ovh-ux/manager-log-to-customer';

import routing from './logs.routing';
import service from './logs.service';
import controller from './logs.controller';
import dataStreams from './data-streams';

const moduleName = 'hostingCdnLogs';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    ovhManagerLogToCustomer,
    dataStreams,
  ])
  .controller('HostingCdnLogsController', controller)
  .service('hostingCdnLogsService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
