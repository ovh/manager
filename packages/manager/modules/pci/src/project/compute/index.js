import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import infrastructure from './infrastructure';
import loadbalancer from './loadbalancer';
import quota from './quota';
import regions from './regions';
import snapshot from './snapshot';
import ssh from './ssh';
import volume from './volume';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectCompute';

angular
  .module(moduleName, [
    infrastructure,
    loadbalancer,
    'ovh-api-services',
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
        translations: {
          value: ['.'],
          format: 'json',
        },
        atInternet: { ignore: true },
        params: {
          // Force the small display for large projects
          forceLargeProjectDisplay: false,
          createNewVm: false,
        },
      });
  });

export default moduleName;
