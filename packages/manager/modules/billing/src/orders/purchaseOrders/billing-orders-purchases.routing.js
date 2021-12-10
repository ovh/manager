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

      criteria: /* @ngInject */ ($log, filter) => {
        if (filter) {
          try {
            const criteria = JSON.parse(decodeURIComponent(filter));
            if (!Array.isArray(criteria)) {
              throw new Error('Invalid criteria');
            }
            return criteria;
          } catch (err) {
            $log.error(err);
          }
        }
        return undefined;
      },

      dateFormat: /* @ngInject */ ($locale) =>
        $locale.DATETIME_FORMATS.shortDate
          .replace('dd', 'd')
          .replace('MM', 'm')
          .replace('y', 'Y'),

      disableDate: /* @ngInject */ (purchases) =>
        purchases.flatMap((elm) => {
          const nbrDays =
            (new Date(elm.endDate).getTime() -
              new Date(elm.startDate).getTime()) /
            86400000;
          const array = [];
          for (let i = 0; i < nbrDays; i += 1) {
            const date = new Date(elm.startDate);
            date.setDate(date.getDate() + i);
            array.push(date);
          }
          return array;
        }),

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

      goToPurchaseOrder: /* @ngInject */ ($state, $timeout, Alerter) => (
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
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message)),
          );
        }
        return promise;
      },

      hideBreadcrumb: /* @ngInject */ () => false,

      minDate: /* @ngInject */ () => new Date(),

      minDateForEndDate: /* @ngInject */ () =>
        new Date(new Date().setDate(new Date().getDate() + 1)),

      purchases: /* @ngInject */ (iceberg, toDay) =>
        iceberg('/me/billing/purchaseOrder')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('reference', 'ASC')
          .limit(5000)
          .execute(null, true)
          .$promise.then(({ data }) =>
            data
              .filter((elm) => elm.status === 'CREATED')
              .map((elm) => {
                const newElm = { ...elm };
                if (
                  elm.active === true &&
                  toDay >= elm.startDate &&
                  toDay <= elm.endDate
                ) {
                  newElm.status = 'actif';
                } else if (
                  elm.active === true &&
                  !(toDay >= elm.startDate && toDay <= elm.endDate)
                ) {
                  newElm.status = 'inactif';
                } else {
                  newElm.status = 'desactivate';
                }
                return newElm;
              }),
          ),

      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,

      timeNow: /* @ngInject */ ($http) =>
        $http
          .get('/auth/time', { serviceType: 'apiv6' })
          .then((result) => parseInt(result.data, 10))
          .then((timestamp) => moment(timestamp)),

      toDay: /* @ngInject */ () =>
        new Date()
          .toISOString()
          .slice(0, new Date().toISOString().indexOf('T')),

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
  });
};
