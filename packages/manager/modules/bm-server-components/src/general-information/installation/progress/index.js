import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './server-installation-progress.component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallationProgress';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'pascalprecht.translate'])
  .component('serverInstallationProgress', component);

export default moduleName;
