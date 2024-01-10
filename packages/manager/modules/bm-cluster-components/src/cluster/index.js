import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './cluster.component';
import service from './cluster.service';

const moduleName = 'ovhManagerBmClusterComponentsCluster';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('clusterMainPage', component)
  .service('Cluster', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
