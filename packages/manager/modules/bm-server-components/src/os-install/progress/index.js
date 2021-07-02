import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';

import component from './component';
import service from './service';
import pollingService from '../../polling/polling.service';

const moduleName = 'ovhManagerBmServerComponentsOsInstallProgressComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
  ])
  .component('serverOsInstallProgress', component)
  .service('osInstallProgressService', service)
  .service('Polling', pollingService)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
