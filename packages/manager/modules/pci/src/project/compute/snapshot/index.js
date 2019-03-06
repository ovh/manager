import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

import './index.less';

const moduleName = 'ovhManagerPciProjectComputeSnapshot';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.snapshot', {
        url: '/snapshot',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'CloudProjectComputeSnapshotCtrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  })
  .service('CloudProjectComputeSnapshotPriceService', service);;

export default moduleName;
