import ovhManagerCore from '@ovh-ux/manager-core';
import config from '../../config/config';

angular
  .module('Billing', [
    ovhManagerCore,
    'Billing.constants',
    'Billing.controllers',
    'Billing.directives',
    'Billing.filters',
    'Billing.services',
    'ngRoute',
    'ngSanitize',
    'ovh-angular-export-csv',
    'ovh-utils-angular',
    'ui.bootstrap',
    'ui.router',
  ])
  .constant('BILLING_BASE_URL', 'account/billing/')
  .constant('Billing.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    paymentMeans: ['bankAccount', 'paypal', 'creditCard', 'deferredPaymentAccount'],
    target: config.target,
  })
  .constant('LANGUAGES', config.constants.LANGUAGES)
  .constant('Billing.URLS', {
    renew: config.constants.billingRenew,
  })
  .config([
    '$stateProvider',
    '$urlServiceProvider',
    'BILLING_BASE_URL',
    ($stateProvider, $urlServiceProvider, BILLING_BASE_URL) => {
      $stateProvider.state('app.account.billing', {
        url: '/billing',
        controller: 'BillingCtrl',
        templateUrl: `${BILLING_BASE_URL}/billing.html`,
        abstract: true,
        translations: { value: ['../billing'], format: 'json' },
        resolve: {
          denyEnterprise: ($q, currentUser) => {
            if (currentUser.isEnterprise) {
              return $q.reject({
                status: 403,
                message: 'Access forbidden for enterprise accounts',
                code: 'FORBIDDEN_BILLING_ACCESS',
              });
            }

            return true;
          },
        },
      });

      $stateProvider.state('app.account.billing.service', {
        url: '',
        abstract: true,
      });

      /**
       * ROUTE: Orders
       */
      $stateProvider.state('app.account.billing.orders', {
        url: '/orders',
        templateUrl: `${BILLING_BASE_URL}orders/billing-orders.html`,
        controller: 'Billing.controllers.Orders',
      });

      $stateProvider.state('app.account.billing.orders.retract', {
        url: '/orders/retract/:id',
        templateUrl: `${BILLING_BASE_URL}orders/retraction/billing-orders-retraction.html`,
        controller: 'Billing.controllers.OrderRetractionCtrl',
        controllerAs: 'ctrl',
      });

      $urlServiceProvider.rules.when('/billing/orders/:id/retract', '/billing/orders/retract/:id');

      /**
       * ROUTE: sla
       */
      $stateProvider.state('app.account.billing.sla', {
        url: '/sla',
        templateUrl: `${BILLING_BASE_URL}sla/billing-sla.html`,
        controller: 'Billing.controllers.Sla',
      });

      /**
       * ROUTE: Auto renew
       */
      $stateProvider.state('app.account.billing.service.autoRenew', {
        url: '/autoRenew',
        templateUrl: `${BILLING_BASE_URL}autoRenew/billing-autoRenew.html`,
        controller: 'Billing.controllers.AutoRenew',
      });

      /**
       * ROUTE: Service termination
       */
      $stateProvider.state('app.account.billing.confirmTerminate', {
        url: '/confirmTerminate?id&token',
        templateUrl: `${BILLING_BASE_URL}confirmTerminate/billing-confirmTerminate.html`,
        controller: 'Billing.controllers.TerminateServiceCtrl',
        controllerAs: 'TerminateServiceCtrl',
      });
    },
  ])
  .run(($rootScope, coreConfig) => {
    _.set($rootScope, 'worldPart', coreConfig.getRegion());
  });
