import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import serverBandwidthDashboard from '../bandwidth-dashboard';
import component from './component';
import olaActivation from './ola-activation/ola-activation.module';
import olaReset from './ola-reset/ola-reset.module';
import olaConfiguration from './ola-configuration/ola-configuration.module';
import olaPendingTask from './ola-pending-task/ola-pending-task.module';
import olaStepCheckerComponent from './ola-step-checker/ola-step-checker.component';

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
    olaActivation,
    olaReset,
    olaConfiguration,
    olaPendingTask,
  ])
  .component('serverOla', component)
  .component('olaStepChecker', olaStepCheckerComponent)
  .constant('olaConstants', constants)
  .service('olaService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
