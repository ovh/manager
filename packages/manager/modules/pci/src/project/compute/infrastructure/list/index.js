import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureList';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.infrastructure.list', {
      url: '/list',
      views: {
        cloudProjectComputeInfrastructure: {
          template,
          controller,
          controllerAs: 'ComputeInfrastructureListCtrl',
        },
      },
      translations: {
        value: ['../../../billing/vouchers/addCredit'],
        format: 'json',
      },
    });
  });

export default moduleName;
