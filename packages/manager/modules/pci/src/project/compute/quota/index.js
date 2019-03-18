import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeQuota';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.quota', {
      url: '/quota',
      views: {
        cloudProjectCompute: {
          template,
          controller,
          controllerAs: 'CloudProjectComputeQuotaCtrl',
        },
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
