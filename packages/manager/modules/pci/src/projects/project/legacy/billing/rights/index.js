import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectBillingRights';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.billing.rights', {
      url: '/rights',
      views: {
        cloudProjectBilling: {
          template,
          controller,
          controllerAs: 'BillingRightsCtrl',
        },
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
