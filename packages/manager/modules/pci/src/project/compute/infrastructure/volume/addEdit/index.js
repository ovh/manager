import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVolumeAddEdit';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.infrastructure.volume-add-edit', {
        url: '/volume/addEdit',
        template,
        controller,
        controllerAs: 'CloudProjectComputeInfrastructureVolumeAddEditCtrl',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });

export default moduleName;
