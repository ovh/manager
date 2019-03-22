import angular from 'angular';

import resetService from './reset/index';
import terminateService from './terminate/index';
import updateService from './update/index';

import kubernetesServiceComponent from './component';

const moduleName = 'ovhManagerKubernetesService';

angular.module(moduleName, [
  resetService,
  terminateService,
  updateService,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube.service', {
        url: '/service',
        views: {
          kubernetesView: 'ovhManagerKubernetesServiceComponent',
        },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerKubernetesServiceComponent', kubernetesServiceComponent);

export default moduleName;
