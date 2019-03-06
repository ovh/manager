import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import components from './components';
import offer from './offer';
import project from './project';

import './index.less';

const moduleName = 'ovhManagerPci';

angular
  .module(moduleName, [
    components,
    offer,
    project,
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas', {
        url: '/iaas',
        abstract: true,
        template: '<ui-view/>',
        translations: {
          format: 'json',
          value: ['../common', '.'],
        },
      })
      .state('paas', {
        url: '/paas',
        abstract: true,
        template: '<ui-view/>',
        translations: {
          value: ['../common', '.'],
          format: 'json',
        },
      });
  })
  .run(($transitions, $state, $stateParams) => {
    $transitions.onSuccess({}, (transition) => {
      const state = transition.to();
      if (state && state.url === '/compute') {
        if ($state.includes('iaas.pci-project')) {
          if ($stateParams.createNewVm) {
            $state.go('iaas.pci-project.compute.infrastructure', {
              createNewVm: true,
            });
          } else {
            $state.go('iaas.pci-project.compute.infrastructure');
          }
        }
      } else if (state && state.url === '/billing') {
        $state.go('iaas.pci-project.billing.consumption');
      }
    });
  });

export default moduleName;
