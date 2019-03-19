import angular from 'angular';

// import '@ovh-ux/ng-ovh-sidebar-menu';
import 'ovh-api-services';

import controller from './kubernetes.controller';
import template from './kubernetes.html';
import service from './kubernetes.service';

import { KUBERNETES } from './kubernetes.constants';

const moduleName = 'OvhManagerKubernetesComponent';

angular.module(moduleName, [
  // '@ovh-ux/ng-ovh-sidebar-menu',
  'ovh-api-services',
])
  .config(($stateProvider) => {
    $stateProvider
      .state('kubernetes', {
        url: '/kube/:serviceName',
        component: 'ovhManagerKubernetesComponent',
        params: { serviceName: null },
        resolve: {
          serviceName: /* @ngInject */ $stateParams => $stateParams.serviceName,
        },
        // redirectTo: 'kube.service',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  })
  .component('ovhManagerKubernetesComponent', {
    bindings: {
      serviceName: '@',
    },
    template,
    controller,
  })
  .constant('KUBERNETES', KUBERNETES)
  .service('Kubernetes', service);


export default moduleName;
