import angular from 'angular';

import controller from './modal-controller';

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
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
