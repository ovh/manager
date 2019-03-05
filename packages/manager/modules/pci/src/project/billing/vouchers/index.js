import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

import './index.less';

const moduleName = 'ovhManagerPciProjectBillingVouchers';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {

    $stateProvider.state('iaas.pci-project.billing.vouchers', {
      url: '/vouchers',
      views: {
        cloudProjectBilling: {
          template,
          controller,
          controllerAs: 'VouchersCtrl',
        },
      },
      translations: {
        value: ['.', './addCredit'],
        format: 'json',
      },
    });
  })
  .service('CloudVouchersService', service);

export default moduleName;
