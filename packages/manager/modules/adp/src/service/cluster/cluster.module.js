import angular from 'angular';
import '@uirouter/angularjs';

import clusterComponent from './cluster.component';

const moduleName = 'ovhManagerAdpClusterComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.service.cluster', {
      url: '/cluster',
      component: 'clusterComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('clusterComponent', clusterComponent);

export default moduleName;
