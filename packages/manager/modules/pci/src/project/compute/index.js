import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-otrs';
import 'angular-translate';
import 'ovh-api-services';

import infrastructure from './infrastructure';
import loadbalancer from './loadbalancer';
import quota from './quota';
import regions from './regions';
import snapshot from './snapshot';
import ssh from './ssh';
import volume from './volume';

import componentsProject from '../../components/project';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectCompute';

angular
  .module(moduleName, [
    componentsProject,
    infrastructure,
    loadbalancer,
    'ngOvhOtrs',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    quota,
    regions,
    snapshot,
    ssh,
    'ui.router',
    volume,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute', {
        url: '/compute',
        // abstract : true,
        views: {
          cloudProject: { //= cloudProject@cloud-project.cloud-project-compute
            template,
            controller,
            controllerAs: 'CloudProjectComputeCtrl',
          },
        },
        atInternet: { ignore: true },
        params: {
          // Force the small display for large projects
          forceLargeProjectDisplay: false,
          createNewVm: false,
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
