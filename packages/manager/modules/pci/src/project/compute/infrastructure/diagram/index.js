import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureDiagram';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.infrastructure.diagram', {
      url: '/diagram',
      views: {
        cloudProjectComputeInfrastructure: {
          template,
          controller,
          controllerAs: 'ComputeInfrastructureDiagramCtrl',
          noTranslations: true,
        },
      },
      translations: {
        value: ['../../../billing/vouchers/addCredit'],
        format: 'json',
      },
    });
  });

export default moduleName;
