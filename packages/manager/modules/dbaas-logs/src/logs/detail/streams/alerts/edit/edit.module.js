import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import add from '../add/add.module';
import routing from './edit.routing';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsAlertsEdit';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router', add])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
