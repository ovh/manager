import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';
import ovhManagerLogToCustomer from '@ovh-ux/manager-log-to-customer';

import routing from './logs.routing';
import service from './logs.service';
import liveTail from './live-tail';
import dataStreams from './data-streams';

const moduleName = 'ovhManagerCloudConnectLogs';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerLogToCustomer,
    liveTail,
    dataStreams,
  ])
  .service('cloudConnectLogsService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
