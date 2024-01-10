import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import ngAtInternet from '@ovh-ux/ng-at-internet';
import component from './general-information.component';

const moduleName = 'ovhManagerBmClusterComponentsDashboardGeneralInformation';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'pascalprecht.translate'])
  .component('clusterGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
