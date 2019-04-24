import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeQuota';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.compute.quota', {
      url: '/quota',
      views: {
        cloudProjectCompute: {
          template,
          controller,
          controllerAs: 'CloudProjectComputeQuotaCtrl',
        },
      },
      resolve: {
        breadcrumb: $translate => $translate
          .refresh()
          .then(() => $translate.instant('cpb_quota_protect_title')),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
