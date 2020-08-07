import angular from 'angular';
import 'angular-translate';

import routing from './user-logs.routing';

const moduleName = 'ovhManagerHostingUserLogs';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .config(routing);

export default moduleName;
