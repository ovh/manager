import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

import './index.less';

const moduleName = 'ovhManagerPciProjectComputeSsh';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.ssh', {
        url: '/ssh',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: '$ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  })
  .service('CloudProjectSSHKeyService', service);

export default moduleName;
