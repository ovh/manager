import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './server-installation-progress.component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallationProgress';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
  ])
  .component('serverInstallationProgress', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
