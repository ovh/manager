import angular from 'angular';

import resetService from './reset/index';
import updateService from './update/index';

import kubernetesServiceComponent from './kubernetes-service.component';

const moduleName = 'ovhManagerKubernetesService';

angular.module(moduleName, [
  resetService,
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
        translations: {
          value: ['..'],
          format: 'json',
        },
      });
  })
  .component('ovhManagerKubernetesServiceComponent', kubernetesServiceComponent);

export default moduleName;
