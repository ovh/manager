import angular from 'angular';

import 'ovh-ui-angular';

import listComponent from './component/index';

import { component } from './component';

import './index.scss';

const moduleName = 'ovhManagerKubernetesList';

angular.module(moduleName, [
  'oui',
  listComponent,
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('kube_list', {
        url: '/kube/list?projectId',
        component: 'ovhManagerKubernetesList',
        params: { projectId: null },
        resolve: {
          projectId: /* @ngInject */ $transition$ => $transition$.params().projectId,
        },
        redirectTo: 'kube_list.list',
      });
  })
  .component('ovhManagerKubernetesList', component);

export default moduleName;
