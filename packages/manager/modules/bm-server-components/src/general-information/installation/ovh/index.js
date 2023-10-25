import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './server-installation-ovh.component';

const moduleName = 'ovhManagerBmServerComponentsDashboardServerInstallationOvh';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'pascalprecht.translate'])
  .component('serverInstallationOvh', component);

export default moduleName;
