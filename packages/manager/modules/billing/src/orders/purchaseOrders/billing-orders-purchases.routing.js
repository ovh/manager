import moment from 'moment';

import { DATE_FORMAT_MOMENT } from './billing-orders-purchases.constant';

export default /* @ngInject */ ($stateProvider) => {
  const stateParent = 'app.account.billing.orders.purchases';

  $stateProvider.state(stateParent, {
    url: '/purchases?filter',
    params: {
      filter: {
        dynamic: true,
      },
    },
    component: 'billingOrdersPurchasesComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_page_title'),

      criteria: /* @ngInject */ (billingOrdersPurchasesService, filter) =>
        billingOrdersPurchasesService.criteria(filter),

      dateFormat: /* @ngInject */ (billingOrdersPurchasesService) =>
        billingOrdersPurchasesService.getDateFormat(),

      disableDate: /* @ngInject */ (billingOrdersPurchasesService, purchases) =>
        billingOrdersPurchasesService.getDisableDate(purchases),

      maxDate: /* @ngInject */ (billingOrdersPurchasesService, purchases) =>
        billingOrdersPurchasesService.getMaxDate(purchases),

      filter: /* @ngInject */ ($transition$) => $transition$.params().filter,

      goToEditPurchase: /* @ngInject */ ($state) => (purchase) => {
        $state.go(`${stateParent}.edit-purchase`, {
          purchase,
        });
      },

      goToNewPurchase: /* @ngInject */ ($state) => () => {
        $state.go(`${stateParent}.new-purchase`);
      },

      goToModalDesactivatePurchase: /* @ngInject */ ($state) => (purchase) => {
        $state.go(`${stateParent}.update-purchase-status`, { purchase });
      },

      goToPurchaseOrder: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          stateParent,
          {},
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => Alerter.set(`alert-${type}`, message));
        }
        return promise;
      },

      hideBreadcrumb: /* @ngInject */ () => false,

      minDate: /* @ngInject */ () => moment().format(DATE_FORMAT_MOMENT),

      minDateForEndDate: /* @ngInject */ (billingOrdersPurchasesService) =>
        billingOrdersPurchasesService.minDateForEndDate(),

      purchases: /* @ngInject */ (billingOrdersPurchasesService) =>
        billingOrdersPurchasesService.getPurchasesOrder(),

      trackClick: /* @ngInject */ (atInternet) => (nameClick) =>
        atInternet.trackClick({
          name: `dedicated::account::billing::${nameClick}`,
          type: 'action',
        }),

      trackPage: /* @ngInject */ (atInternet) => (namePage) =>
        atInternet.trackPage({
          name: `dedicated::account::billing::${namePage}`,
        }),

      updateFilterParam: /* @ngInject */ ($state) => (filter) =>
        $state.go(
          'app.account.billing.orders.purchases',
          {
            filter,
          },
          {
            reload: false,
          },
        ),
    },
    atInternet: {
      rename: 'dedicated::account::billing::orders-internal-ref',
    },
  });
};
