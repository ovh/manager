import set from 'lodash/set';

export default class LogsListService {
  /* @ngInject */
  constructor($q, iceberg, LogsHelperService, LogsTokensService) {
    this.$q = $q;
    this.iceberg = iceberg;
    this.LogsHelperService = LogsHelperService;
    this.LogsTokensService = LogsTokensService;
  }

  /**
   * returns array of accounts with details
   *
   * @returns promise which will be resolve to array of accounts.
   *          Each account will have all details populated.
   * @memberof LogsListService
   */
  getPaginatedServices(
    offset = 0,
    pageSize = 25,
    sort = { name: 'serviceName', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.name, sort.dir);
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }

    return res
      .execute(null, { headers: { Pragma: 'no-cache' } })
      .$promise.then((response) => ({
        data: response.data.map((service) => this.transformService(service)),
        meta: {
          totalCount:
            parseInt(response.headers['x-pagination-elements'], 10) || 0,
        },
      }));
  }

  /**
   * returns default cluster associated with user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to default cluster
   * @memberof LogsInputsService
   */
  getDefaultCluster(serviceName) {
    return this.LogsTokensService.getDefaultCluster(
      serviceName,
      'logs_accounts_get_entry_point_error',
    );
  }

  transformService(service) {
    set(service, 'name', service.displayName || service.serviceName);
    if (this.LogsHelperService.isAccountDisabled(service)) {
      set(service, 'isDisabled', true);
    } else {
      set(service, 'isDisabled', false);
    }
    set(service, 'cluster', {
      isLoadingCluster: true,
      hostname: '-',
    });
    this.getDefaultCluster(service.serviceName)
      .then((cluster) => {
        set(service, 'cluster.hostname', cluster.hostname);
      })
      .finally(() => {
        set(service, 'cluster.isLoadingCluster', false);
      });
    return service;
  }
}
