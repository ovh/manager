import angular from 'angular';

import controller from './kubernetes-service-reset.modal.controller';

const moduleName = 'ovhManagerKubernetesServiceReset';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube.service.reset', {
        url: '/reset',
        views: {
          kubernetesPopUpView: {
            controller,
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['..'],
          format: 'json',
        },
      });
  });

export default moduleName;
