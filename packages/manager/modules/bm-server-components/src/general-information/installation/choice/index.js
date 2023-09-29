import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './server-installation-choice.component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallationChoice';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
  ])
  .component('serverInstallationChoice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
