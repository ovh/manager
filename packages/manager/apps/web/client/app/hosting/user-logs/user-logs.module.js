import angular from 'angular';
import 'angular-translate';

import routing from './user-logs.routing';

const moduleName = 'ovhManagerHostingUserLogs';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
