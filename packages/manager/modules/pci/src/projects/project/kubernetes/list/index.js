import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './list.component';
import service from './service';

import './index.scss';

const moduleName = 'ovhManagerPciProjectKubernetesList';

angular.module(moduleName, [
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes', {
        url: '/kubernetes',
        component: 'ovhManagerPciProjectKubernetesList',
      });
  })
  .component('ovhManagerPciProjectKubernetesList', component)
  .service('PublicCloudProjectKubernetes', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
