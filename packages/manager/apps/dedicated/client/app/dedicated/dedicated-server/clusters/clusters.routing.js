import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.dedicated-server.cluster';

  $stateProvider.state(name, {
    url: '/cluster?page&pageSize&sort&sortOrder&filter',
    views: {
      containersView: 'clustersListing',
    },
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
      getClusterDashboardLink: /* @ngInject */ ($state) => ({ iam }) =>
        $state.href('app.dedicated-cluster.cluster', {
          clusterId: iam.displayName,
        }),
      dedicatedClusters: /* @ngInject */ ($transition$, iceberg) => {
        const { filter, pageSize, sort, sortOrder } = $transition$.params();
        let { page } = $transition$.params();
        const filtersParsed = JSON.parse(filter);

        if (filtersParsed.length > 0) {
          page = 1;
        }

        let request = iceberg('/dedicated/cluster')
          .query()
          .expand('CachedObjectList-Pages')
          .limit(pageSize)
          .offset(page)
          .sort(sort, sortOrder);

        filtersParsed.forEach(({ field, comparator, reference }) => {
          request = request.addFilter(
            field,
            ListLayoutHelper.FILTER_OPERATORS[comparator],
            ListLayoutHelper.mapFilterForIceberg(comparator, reference),
          );
        });

        return request.execute(null, true).$promise;
      },
      noFiltersServers: /* @ngInject */ (iceberg) =>
        iceberg('/dedicated/cluster')
          .query()
          .expand('CachedObjectList-Pages')
          .execute(null, true).$promise,
      paginationNumber: /* @ngInject */ (dedicatedClusters) =>
        parseInt(dedicatedClusters.headers['x-pagination-number'], 10),
      paginationSize: /* @ngInject */ (dedicatedClusters) =>
        parseInt(dedicatedClusters.headers['x-pagination-size'], 10),
      paginationTotalCount: /* @ngInject */ (dedicatedClusters) =>
        parseInt(dedicatedClusters.headers['x-pagination-elements'], 10),
      onListParamsChange: /* @ngInject */ ($state) => (params) =>
        $state.go('.', params, {
          notify: false,
        }),
      sort: /* @ngInject */ (dedicatedClusters) =>
        dedicatedClusters.headers['x-pagination-sort'],
      sortOrder: /* @ngInject */ (dedicatedClusters) =>
        dedicatedClusters.headers['x-pagination-sort-order'],
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('noFiltersServers')
        .then((noFiltersServers) =>
          noFiltersServers.data.length === 0
            ? 'app.dedicated-server.index'
            : false,
        ),
  });
};
