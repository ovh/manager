import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerLogToCustomer from '@ovh-ux/manager-log-to-customer';

import routing from './data-streams.routing';
import controller from './data-streams.controller';

const moduleName = 'hostingCdnLogsDataStreams';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    ovhManagerLogToCustomer,
  ])
  .controller('HostingCdnLogsDataStreamsController', controller)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
