import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureIacView';

angular
  .module(moduleName, [])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.infrastructure.iac-view', {
      url: '/iac/view',
      views: {
        cloudProjectComputeInfrastructure: {
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
  });

export default moduleName;
