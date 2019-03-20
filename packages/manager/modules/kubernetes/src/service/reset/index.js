import angular from 'angular';

import controller from './modal-controller';

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
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
