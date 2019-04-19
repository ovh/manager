import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectBillingConsumptionEstimate';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.billing.estimate', {
      url: '/estimate',
      template,
      controller,
      controllerAs: 'BillingConsumptionEstimateCtrl',
      resolve: {
        breadcrumb: $translate => $translate
          .refresh()
          .then(() => $translate.instant('cpbc_tab_forecast')),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
