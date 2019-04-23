import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

import addCreditAgoraController from './addCredit/agora.controller';
import addCreditAgoraTemplate from './addCredit/agora.template.html';

const moduleName = 'ovhManagerPciProjectBillingVouchers';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.billing.vouchers', {
      url: '/vouchers',
      views: {
        cloudProjectBilling: {
          template,
          controller,
          controllerAs: 'VouchersCtrl',
        },
      },
    });
  })
  .controller('CloudProjectBillingVouchersAddcreditAgoraCtrl', addCreditAgoraController)
  .service('CloudVouchersService', service)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/billing/vouchers/addCredit/agora.template.html', addCreditAgoraTemplate);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
