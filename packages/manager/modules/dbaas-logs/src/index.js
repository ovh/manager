import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import logs from './logs/logs.module';

const moduleName = 'ovhManagerDbaasLogs';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    logs,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
