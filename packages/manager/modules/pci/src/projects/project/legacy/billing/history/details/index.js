import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectBillingHistoryDetails';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.billing.history.details', {
      url: '',
      views: {
        cloudProjectHistory: {
          template,
          controller,
          controllerAs: 'BillingHistoryDetailsCtrl',
        },
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
