import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './general-information.component';

const moduleName = 'ovhManagerClusterComponentsDashboardGeneralInformation';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('clusterGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
