import angular from 'angular';

import controller from './modal-controller';

const moduleName = 'ovhManagerPciProjectKubernetesServiceReset';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes.details.service.reset', {
        url: '/reset',
        views: {
          kubernetesPopUpView: {
            controller,
            controllerAs: 'ctrl',
          },
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
