import angular from 'angular';

import controller from './kubernetes-service-update.modal.controller';

const moduleName = 'ovhManagerKubernetesServiceUpdate';

angular.module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube.service.update', {
        url: '/update',
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
