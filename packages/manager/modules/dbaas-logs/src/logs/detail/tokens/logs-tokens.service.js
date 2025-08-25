import set from 'lodash/set';

export default class LogsTokensService {
  /* @ngInject */
  constructor($q, $http, iceberg, LogsHelperService) {
    this.$q = $q;
    this.$http = $http;
    this.iceberg = iceberg;
    this.LogsHelperService = LogsHelperService;
  }

  /**
   * returns array of tokens with details
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of tokens.
   *          Each alias will have all details populated.
   * @memberof LogsTokensService
   */
  getPaginatedTokens(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'name', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/token`)
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
    return res.execute().$promise.then((response) => ({
      data: response.data.map((token) =>
        this.transformToken(serviceName, token),
      ),
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  getTokenIds(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/token`)
      .query()
      .execute()
      .$promise.then(({ data }) => data)
      .catch((error) => {
        this.LogsHelperService.handleError('logs_tokens_get_error', error.data);
        return [];
      });
  }

  /**
   * delete token
   *
   * @param {any} serviceName
   * @param {any} token, token object to be deleted
   * @returns promise which will be resolve to operation object
   * @memberof LogsTokensService
   */
  deleteToken(serviceName, token) {
    return this.$http
      .delete(`/dbaas/logs/${serviceName}/token/${token.tokenId}`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_tokens_delete_success',
          { tokenName: token.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_tokens_delete_error', err, {
          tokenName: token.name,
        }),
      );
  }

  /**
   * create new token
   *
   * @param {any} serviceName
   * @param {any} token, token object to be created
   * @returns promise which will be resolve to operation object
   * @memberof LogsTokensService
   */
  createToken(serviceName, token) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/token`, token)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_tokens_create_success',
          { tokenName: token.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_tokens_create_error', err, {
          tokenName: token.name,
        }),
      );
  }

  /**
   * returns array of Input IDs of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of input IDs
   * @memberof LogsInputsService
   */
  getClusters(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/cluster`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute()
      .$promise.catch((error) => {
        this.LogsHelperService.handleError('logs_tokens_get_error', error.data);
        return { data: [] };
      });
  }

  /**
   * returns default cluster associated with user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to default cluster
   * @memberof LogsInputsService
   */
  getDefaultCluster(serviceName) {
    return this.getClusters(serviceName).then((clusters) => {
      const defaultClusters = clusters.data.filter(
        (cluster) => cluster.isDefault,
      );
      return defaultClusters.length > 0 ? defaultClusters[0] : null;
    });
  }

  /**
   * creates new token with default values
   *
   * @returns token object with default values
   * @memberof LogsTokensService
   */
  getNewToken(serviceName) {
    return this.getDefaultCluster(serviceName).then((defaultCluster) => ({
      name: null,
      clusterId: defaultCluster ? defaultCluster.clusterId : null,
    }));
  }

  transformToken(serviceName, token) {
    set(token, 'cluster', {
      isLoadingCluster: true,
      hostname: '-',
    });
    this.getClusters(serviceName).then((clusters) => {
      set(
        token,
        'cluster',
        clusters.data.find(
          (cluster) => cluster.clusterId === token.clusterId,
        ) || {},
      );
    });
    return token;
  }
}
