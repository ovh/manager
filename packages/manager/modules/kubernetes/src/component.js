import angular from 'angular';

// import 'script-loader!bootstrap/dist/js/bootstrap.js'; // eslint-disable-line

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-sidebar-menu';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-ui-bootstrap';

import '@ovh-ux/manager-cloud-styles';
import 'ovh-ui-kit/dist/oui.css';
import 'font-awesome/css/font-awesome.css';

import kubernetesComponent from './kubernetes.component';
import service from './service';

import containersComponent from './containers/index';
import nodesComponent from './nodes/index';
import serviceComponent from './service/index';

import './index.less';
import './index.scss';

const moduleName = 'ovhManagerKubernetesComponent';

angular.module(moduleName, [
  'ngOvhCloudUniverseComponents',
  'ngOvhSidebarMenu',
  'oui',
  'ovh-api-services',
  'ui.bootstrap',
  containersComponent,
  nodesComponent,
  serviceComponent,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube', {
        url: '/kube/:serviceName',
        component: 'ovhManagerKubernetesComponent',
        params: { serviceName: null },
        resolve: {
          serviceName: /* @ngInject */ $stateParams => $stateParams.serviceName,
        },
        redirectTo: 'kube.service',
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerKubernetesComponent', kubernetesComponent)
  .service('Kubernetes', service);


export default moduleName;
