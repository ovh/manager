import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import current from './current';
import estimate from './estimate';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectBillingConsumption';

angular
  .module(moduleName, [
    current,
    estimate,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
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
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
