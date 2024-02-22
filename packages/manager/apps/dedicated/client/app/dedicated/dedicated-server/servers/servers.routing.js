import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.dedicated-server.index';

  $stateProvider.state(name, {
    url: '/server?page&pageSize&sort&sortOrder&filter',
    component: 'dedicatedServerServers',
    params: {
      page: {
        value: '1',
        squash: true,
      },
      pageSize: {
        value: '25',
        squash: true,
      },
      sort: {
        value: 'name',
        squash: true,
      },
      sortOrder: {
        value: 'ASC',
        squash: true,
      },
      filter: {
        value: '[]',
        squash: true,
      },
    },
    resolve: {
      filter: /* @ngInject */ ($transition$) => $transition$.params().filter,
      orderUrl: /* @ngInject */ (User) => User.getUrlOf('dedicatedOrder'),
      orderEcoRangeUrl: /* @ngInject */ (User) =>
        User.getUrlOf('dedicatedEcoRangeOrder'),
      featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability([
          'dedicated-server:order',
          'dedicated-server:ecoRangeOrderSectionDedicated',
          'billing:autorenew2016Deployment',
          'dedicated-server:banner-rbx1-eol',
        ]),
      isOrderAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability?.isFeatureAvailable('dedicated-server:order') ||
        false,
      isEcoRangeOrderAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability?.isFeatureAvailable(
          'dedicated-server:ecoRangeOrderSectionDedicated',
        ) || false,
      getServerDashboardLink: /* @ngInject */ ($state) => (server) =>
        $state.href('app.dedicated-server.server', { productId: server.name }),
      noFiltersServers: /* @ngInject */ (iceberg) =>
        iceberg('/dedicated/server')
          .query()
          .expand('CachedObjectList-Pages')
          .execute(null, true).$promise,
      dedicatedServers: /* @ngInject */ ($transition$, iceberg) => {
        const { filter, pageSize, sort, sortOrder } = $transition$.params();
        let { page } = $transition$.params();
        const filtersParsed = JSON.parse(filter);

        if (filtersParsed.length > 0) {
          page = 1;
        }

        let request = iceberg('/dedicated/server')
          .query()
          .expand('CachedObjectList-Pages')
          .limit(pageSize)
          .offset(page)
          .sort(sort, sortOrder);

        const FILTER_OPERATORS = {
          contains: 'like',
          is: 'eq',
          isAfter: 'gt',
          isBefore: 'lt',
          isNot: 'ne',
          smaller: 'lt',
          bigger: 'gt',
          startsWith: 'like',
          endsWith: 'like',
        };

        filtersParsed.forEach(({ field, comparator, reference }) => {
          request = request.addFilter(
            field,
            get(FILTER_OPERATORS, comparator),
            reference.map((val) => {
              switch (comparator.toUpperCase()) {
                case 'CONTAINS':
                  return `%${val}%`;
                case 'STARTSWITH':
                  return `${val}%`;
                case 'ENDSWITH':
                  return `%${val}`;
                default:
                  return val;
              }
            }),
          );
        });

        return request.execute(null, true).$promise;
      },
      paginationNumber: /* @ngInject */ (dedicatedServers) =>
        parseInt(get(dedicatedServers.headers, 'x-pagination-number'), 10),
      paginationSize: /* @ngInject */ (dedicatedServers) =>
        parseInt(get(dedicatedServers.headers, 'x-pagination-size'), 10),
      paginationTotalCount: /* @ngInject */ (dedicatedServers) =>
        parseInt(get(dedicatedServers.headers, 'x-pagination-elements'), 10),
      schema: /* @ngInject */ (OvhApiDedicatedServer) =>
        OvhApiDedicatedServer.v6().schema().$promise,
      serverStateEnum: /* @ngInject */ (schema) =>
        get(schema.models, 'dedicated.server.StateEnum').enum,

      onListParamsChange: /* @ngInject */ ($state) => (params) =>
        $state.go('.', params, {
          notify: false,
        }),
      sort: /* @ngInject */ (dedicatedServers) =>
        get(dedicatedServers.headers, 'x-pagination-sort'),
      sortOrder: /* @ngInject */ (dedicatedServers) =>
        get(dedicatedServers.headers, 'x-pagination-sort-order'),
      hideBreadcrumb: () => true,

      isAutorenew2016DeploymentBannerAvailable: /* @ngInject */ (
        featureAvailability,
      ) =>
        featureAvailability?.isFeatureAvailable(
          'billing:autorenew2016Deployment',
        ) || false,
      displayRbx1EolBanner: /* @ngInject */ (featureAvailability) => ({
        rbx1Eol:
          featureAvailability?.isFeatureAvailable(
            'dedicated-server:banner-rbx1-eol',
          ) || false,
      }),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFiltersServers')
        .then((noFiltersServers) =>
          noFiltersServers.data.length === 0
            ? 'app.dedicated-server.onboarding'
            : false,
        ),
  });
};
