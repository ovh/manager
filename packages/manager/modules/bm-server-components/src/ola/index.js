import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import serverBandwidthDashboard from '../bandwidth-dashboard';
import component from './component';
import olaReset from './ola-reset/ola-reset.module';
import olaConfiguration from './ola-configuration/ola-configuration.module';
import olaPendingTask from './ola-pending-task/ola-pending-task.module';

import constants from './ola.constants';
import service from './service';

const moduleName = 'ovhManagerBmServerComponentsOlaComponent';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    serverBandwidthDashboard,
    olaReset,
    olaConfiguration,
    olaPendingTask,
  ])
  .component('serverOla', component)
  .constant('olaConstants', constants)
  .service('olaService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
