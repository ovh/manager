import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';

import component from './component';
import service from '../service';
import installationOptions from '../installation-options';

const moduleName = 'ovhManagerBmServerComponentsOsInstallGabaritComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    installationOptions,
  ])
  .component('serverOsInstallGabarit', component)
  .service('osInstallService', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
