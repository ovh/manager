import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-ui-bootstrap';
import kubernetesComponent from './component';
import service from './service';

import containersComponent from './containers/index';
import nodesComponent from './nodes/index';
import serviceComponent from './service/index';

import './index.scss';

const moduleName = 'ovhManagerPciProjectKubernetesDetailComponent';

angular.module(moduleName, [
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
  'ui.bootstrap',
  containersComponent,
  nodesComponent,
  serviceComponent,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.kubernetes.details', {
        url: '/:serviceName',
        component: 'ovhManagerPciProjectKubernetesDetailComponent',
        resolve: {
          serviceName: /* @ngInject */ $stateParams => $stateParams.serviceName,
          cluster: /* @ngInject */ (
            Kubernetes,
            serviceName,
          ) => Kubernetes.getKubernetesCluster(serviceName),
          breadcrumb: /* @ngInject */ cluster => cluster.name,
        },
        redirectTo: 'pci.projects.project.kubernetes.details.service',
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesDetailComponent', kubernetesComponent)
  .service('Kubernetes', service);


export default moduleName;
