import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import current from './current';
import estimate from './estimate';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectBillingConsumption';

angular
  .module(moduleName, [
    current,
    estimate,
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.billing.consumption', {
      url: '/consumption',
      views: {
        cloudProjectBilling: {
          template,
          controller,
          controllerAs: 'BillingConsumptionCtrl',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;
