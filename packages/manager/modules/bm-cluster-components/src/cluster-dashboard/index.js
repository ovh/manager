import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './dashboard.component';

const moduleName = 'ovhManagerBmClusterComponentsClusterDashboard';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('clusterDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
