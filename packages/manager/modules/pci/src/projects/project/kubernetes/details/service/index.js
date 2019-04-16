import angular from 'angular';

import resetService from './reset/index';
import terminateService from './terminate/index';
import updateService from './update/index';

import kubernetesServiceComponent from './component';

const moduleName = 'ovhManagerPciProjectKubernetesService';

angular.module(moduleName, [
  resetService,
  terminateService,
  updateService,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes.details.service', {
        url: '/service',
        views: {
          kubernetesView: 'ovhManagerPciProjectKubernetesServiceComponent',
        },
        resolve: {
          serviceName: $stateParams => $stateParams.serviceName,
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesServiceComponent', kubernetesServiceComponent);

export default moduleName;
