import angular from 'angular';

import controller from './modal-controller';

const moduleName = 'ovhManagerPciProjectKubernetesServiceTerminate';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes.details.service.terminate', {
        url: '/terminate',
        views: {
          kubernetesPopUpView: {
            controller,
            controllerAs: '$ctrl',
          },
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
