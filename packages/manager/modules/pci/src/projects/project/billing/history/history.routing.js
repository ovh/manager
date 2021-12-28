import { groupBy } from 'lodash';
import 'moment';
import { formatPrice, formatBillingDetails, getURL } from '../billing.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.billing.history', {
    url: '/history/:year/:month',
    componentProvider: /* @ngInject */ (isLegacyProject) =>
      isLegacyProject
        ? 'pciProjectBillingHistoryLegacy'
        : 'pciProjectBillingHistory',
    params: {
      year: {
        value: moment.utc().year(),
        type: 'int',
      },
      month: {
        value: moment.utc().month(),
        type: 'int',
      },
    },
    onExit: /* @ngInject */ (Poller) =>
      Poller.kill({ namespace: 'pci.billing.history' }),
    resolve: {
      exportToCSV: /* @ngInject */ ($window, Poller) => (orderId) =>
        Poller.poll(
          `/me/order/${orderId}/consumption/details?fileFormat=csv`,
          {},
          {
            method: 'get',
            namespace: 'pci.billing.history',
            successRule: ({ taskStatus }) => taskStatus === 'DONE',
          },
        ).then(({ fileURL }) => {
          $window.open(fileURL);
          return fileURL;
        }),
      period: /* @ngInject */ (goToMonth, month, year) => {
        const validYear = year;
        const validMonth = month - 1;
        const period = moment({
          year,
          month: validMonth,
        });
        if (
          !period.isValid() ||
          period.isAfter(moment.utc()) ||
          validYear < 1990 ||
          validMonth < 0 ||
          validMonth > 11
        ) {
          return goToMonth();
        }

        return moment()
          .utc()
          .year(validYear)
          .month(validMonth)
          .toDate();
      },
      validParams: /* @ngInject */ (month, year) => {
        const period = moment({
          year,
          month: month - 1, // because moment indexes month from 0 to 11
        });
        let validYear = year;
        let validMonth = month;
        if (!period.isValid() || period.isAfter(moment.utc())) {
          validYear = moment.utc().year();
          validMonth = moment.utc().month() + 1; // because moment indexes month from 0 to 11
        }

        if (year < 1990) {
          validYear = moment.utc().year();
        }
        if (month < 1 || month > 12) {
          validMonth = moment.utc().month() + 1; // because moment indexes month from 0 to 11
        }

        return {
          year: validYear,
          month: validMonth,
        };
      },
      year: /* @ngInject */ ($transition$) => $transition$.params().year,
      month: /* @ngInject */ ($transition$) => $transition$.params().month,
      history: /* @ngInject */ ($q, iceberg, isLegacyProject, serviceInfos) =>
        !isLegacyProject
          ? iceberg(`/services/${serviceInfos.serviceId}/consumption/history`)
              .query()
              .expand('CachedObjectList-Pages')
              .limit(5000)
              .sort('beginDate', 'desc')
              .execute()
              .$promise.then(({ data }) => data)
              .catch(() => [])
          : $q.resolve([]),
      currentMonthHistory: /* @ngInject */ (history, month, service, year) => {
        const date = moment()
          .utc()
          .month(month)
          .year(year)
          .startOf('month')
          .toISOString();
        return (
          history.find(({ endDate }) => endDate === date) || {
            price: {
              text: formatPrice(service.billing?.pricing?.price, 0),
            },
          }
        );
      },
      monthHistory: /* @ngInject */ (
        catalog,
        coreURLBuilder,
        currentMonthHistory,
        historyDetails,
        projectId,
      ) => ({
        ...currentMonthHistory,
        priceByPlanFamily: currentMonthHistory?.priceByPlanFamily?.map(
          (price) => ({
            ...price,
            details: formatBillingDetails(
              historyDetails,
              price.planFamily,
              catalog,
              currentMonthHistory.price,
            ).map((detail) => {
              const url = getURL(price.planFamily, detail.planCode);
              return {
                ...detail,
                url: url
                  ? coreURLBuilder.buildURL('public-cloud', `#${url}`, {
                      serviceName: projectId,
                      id: detail.serviceId,
                    })
                  : null,
              };
            }),
          }),
        ),
      }),
      historyDetails: /* @ngInject */ (
        $q,
        $http,
        currentMonthHistory,
        isLegacyProject,
        serviceInfos,
      ) =>
        !isLegacyProject
          ? $http
              .get(
                `/services/${serviceInfos.serviceId}/consumption/history/${currentMonthHistory?.id}/element`,
              )
              .then(({ data }) => data)
              .then((details) => groupBy(details, 'planFamily'))
              .catch(() => ({}))
          : $q.resolve({}),
      goToMonth: /* @ngInject */ ($state, projectId) => (month, year) =>
        $state.go('pci.projects.project.billing.history', {
          projectId,
          month,
          year,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cpbc_tab_history'),
    },
  });
};
