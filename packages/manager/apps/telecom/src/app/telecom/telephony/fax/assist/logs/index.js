import angular from 'angular';
import '@uirouter/angularjs';

import serviceAssistLogs from '../../../service/assist/logs';

import routing from './logs.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxAssistLogs';

angular
  .module(moduleName, ['ui.router', serviceAssistLogs])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
