import angular from 'angular';

import controller from './kubernetes-service-terminate.modal.controller';

const moduleName = 'ovhManagerKubernetesServiceTerminate';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube.service.terminate', {
        url: '/terminate',
        views: {
          kubernetesPopUpView: {
            controller,
            controllerAs: '$ctrl',
          },
        },
        translations: {
          value: ['..'],
          format: 'json',
        },
      });
  });

export default moduleName;
