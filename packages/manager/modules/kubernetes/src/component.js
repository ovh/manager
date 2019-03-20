import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-sidebar-menu';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-ui-bootstrap';

import 'ovh-ui-kit/dist/oui.css';

import controller from './controller';
import template from './template.html';
import service from './service';

import { KUBERNETES } from './constants';

import containersComponent from './containers/index';
import nodesComponent from './nodes/index';
import serviceComponent from './service/index';

import './kubernetes.scss';

const moduleName = 'OvhManagerKubernetesComponent';

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
