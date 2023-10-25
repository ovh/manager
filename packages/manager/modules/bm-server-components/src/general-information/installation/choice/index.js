import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './server-installation-choice.component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallationChoice';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'pascalprecht.translate'])
  .component('serverInstallationChoice', component);

export default moduleName;
