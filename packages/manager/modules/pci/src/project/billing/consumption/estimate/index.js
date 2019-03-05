import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectBillingConsumptionCurrent';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.billing.consumption.estimate', {
      url: '/estimate',
      views: {
        cloudProjectBillingConsumption: {
          template,
          controller,
          controllerAs: 'BillingConsumptionEstimateCtrl',
        },
      },
      translations: {
        value: ['.', './alert/add'],
        format: 'json',
      },
    });
  });

export default moduleName;
