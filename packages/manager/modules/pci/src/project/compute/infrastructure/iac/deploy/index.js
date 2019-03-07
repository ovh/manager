import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureIacDeploy';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.infrastructure.iac-deploy', {
      url: '/iac/{stackId}/deploy',
      views: {
        cloudProjectComputeInfrastructure: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      params: {
        hTerm: {
          session: null,
          actions: [],
          regions: null,
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;
