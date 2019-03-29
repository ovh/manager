import angular from 'angular';

import 'ovh-api-services';
import 'ovh-ui-angular';

import listComponent from './component';
import service from './service';

const moduleName = 'ovhManagerKubernetesListComponent';

angular.module(moduleName, [
  'oui',
  'ovh-api-services',
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube_list.list', {
        views: {
          kubernetesListView: 'ovhManagerKubernetesListComponent',
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerKubernetesListComponent', listComponent)
  .service('PublicCloudProjectKubernetes', service);


export default moduleName;
