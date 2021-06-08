import { Bill, DebtAccount } from '@ovh-ux/manager-models';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import get from 'lodash/get';
import omit from 'lodash/omit';
import partition from 'lodash/partition';

const mapDateFilter = (comparator, value) => {
  switch (comparator) {
    case 'isAfter':
      return { 'date.from': value };
    case 'isBefore':
      return { 'date.to': value };
    case 'is':
      return {
        'date.from': value,
        'date.to': moment(value)
          .add(1, 'day')
          .format('YYYY-MM-DD'),
      };
    default:
      return {};
  }
};

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.account.billing.main.history', {
      url: `/history?filter`,
      params: {
        filter: {
          value: '[]',
          squash: true,
        },
      },
      component: 'billingLegacyHistory',
      translations: {
        value: ['./postalMailOptions'],
        format: 'json',
      },
      resolve: {
        filters: /* @ngInject */ ($transition$) => $transition$.params().filter,
        onListParamsChange: /* @ngInject */ ($state) => (params) =>
          $state.go('app.account.billing.main.history', params),
        breadcrumb: () => null,
        hideBreadcrumb: () => true,
      },
    });
  } else {
    $stateProvider.state('app.account.billing.main.history', {
      url: `/history?${ListLayoutHelper.urlQueryParams}`,
      params: {
        ...ListLayoutHelper.stateParams,
        sort: {
          value: 'date',
          squash: true,
        },
        sortOrder: {
          value: 'DESC',
          squash: true,
        },
      },
      component: 'billingHistory',
      resolve: {
        ...omit(ListLayoutHelper.stateResolves, [
          'resources',
          'columns',
          'formatters',
          'mappings',
          'schema',
          'apiModel',
          'configuration',
          'displayedColumns',
        ]),
        bills: /* @ngInject */ (OvhApiMe) =>
          OvhApiMe.Bill()
            .v6()
            .query().$promise,
        // Override ListLayoutHelper resources to use native filters for date
        resources: /* @ngInject */ ($transition$, iceberg) => {
          const { filter, pageSize, sort, sortOrder } = $transition$.params();
          let { page } = $transition$.params();
          const filters = JSON.parse(filter);
          const [dateFilter, parsedFilters] = partition(filters, {
            field: 'date',
          });

          const queryParams = dateFilter.reduce(
            (params, date) => ({
              ...params,
              ...mapDateFilter(date.comparator, date.reference[0]),
            }),
            {},
          );

          const updatedParams = $transition$.paramsChanged();

          // If we've updated the filters but not the page,
          // it means we've only updated the filter in the url then reset page
          // If the page is also updated, this means it comes from a direct url update
          if (updatedParams.filter && !updatedParams.page) {
            page = 1;
          }

          const apiPath = '/me/bill';

          let request = iceberg(apiPath)
            .query()
            .expand('CachedObjectList-Pages')
            .limit(pageSize)
            .offset(page)
            .sort(sort, sortOrder);

          parsedFilters.forEach(({ field, comparator, reference }) => {
            request = request.addFilter(
              field,
              get(ListLayoutHelper.FILTER_OPERATORS, comparator),
              ListLayoutHelper.mapFilterForIceberg(comparator, reference),
            );
          });

          return request.execute(queryParams).$promise.then((bills) => ({
            ...bills,
            data: bills.data.map((bill) => new Bill(bill)),
          }));
        },
        defaultFilterColumn: () => 'billId',
        getDebt: /* @ngInject */ ($http, $q) => (bill) =>
          $http
            .get(`/me/bill/${bill.billId}/debt`)
            .then(({ data: debt }) => new Bill({ ...bill, debt }))
            .catch((error) =>
              error.status === 404 ? new Bill(bill) : $q.reject(error),
            ),
        debtAccount: /* @ngInject */ ($q, OvhApiMe) =>
          OvhApiMe.DebtAccount()
            .v6()
            .get()
            .$promise.then((debtAccount) => new DebtAccount(debtAccount))
            .catch((error) => {
              if (error.status === 404) {
                return new DebtAccount({
                  active: false,
                });
              }

              return $q.reject(error);
            }),
        exportBills: /* @ngInject */ ($http) => (archiveType, bills) =>
          $http.post('/me/bill/export', {
            archiveType,
            ids: bills,
          }),

        invoicesByPostalMail: /* @ngInject */ (
          $q,
          coreConfig,
          currentUser,
          OvhApiMe,
        ) =>
          coreConfig.isRegion('EU') && currentUser.canHaveInvoicesByPostalMail()
            ? OvhApiMe.Billing()
                .InvoicesByPostalMail()
                .v6()
                .get().$promise
            : $q.when(null),

        hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
          ovhPaymentMethod.hasDefaultPaymentMethod(),
        payDebt: /* @ngInject */ ($state) => (debtId) =>
          $state.go('app.account.billing.main.history.pay-debt', {
            debtId,
          }),
        seeDebt: /* @ngInject */ ($state) => (billId, debtId) =>
          $state.go('app.account.billing.main.history.details.debt.details', {
            billId,
            debtId,
          }),
        breadcrumb: () => null,
        hideBreadcrumb: () => true,
      },
    });
  }

  $stateProvider.state('app.account.billing.main.history.details', {
    url: `/:billId`,
    redirectTo: 'app.account.billing.main.history',
    resolve: {
      billId: /* @ngInject */ ($transition$) => $transition$.params().billId,
      breadcrumb: /* @ngInject */ (billId) => billId,
    },
  });
};
