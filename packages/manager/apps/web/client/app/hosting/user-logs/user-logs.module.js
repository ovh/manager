import angular from 'angular';
import 'angular-translate';

import controller from './hosting-user-logs.controller';

const moduleName = 'ovhManagerHostingUserLogs';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .controller('HostingTabUserLogsCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
