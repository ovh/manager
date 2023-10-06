import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './server-installation-gabarit.component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallationGabarit';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'pascalprecht.translate'])
  .component('serverInstallationGabarit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
