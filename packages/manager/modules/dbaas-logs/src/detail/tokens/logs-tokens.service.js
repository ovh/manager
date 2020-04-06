export default class LogsTokensService {
  /* @ngInject */
  constructor($q, OvhApiDbaas, LogsHelperService) {
    this.$q = $q;
    this.TokenApiService = OvhApiDbaas.Logs()
      .Token()
      .v6();
    this.DetailsAapiService = OvhApiDbaas.Logs()
      .Details()
      .Aapi();
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
  getTokens(serviceName) {
    return this.getTokensDetails(serviceName).catch((err) =>
      this.LogsHelperService.handleError('logs_tokens_get_error', err, {}),
    );
  }

  /**
   * gets details for each token in array
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to an array of token objects
   * @memberof LogsTokensService
   */
  getTokensDetails(serviceName) {
    return this.getTokensIds(serviceName).then((tokens) => {
      const promises = tokens.map((tokenId) =>
        this.getToken(serviceName, tokenId),
      );
      return this.$q.all(promises);
    });
  }

  /**
   * returns array of tokens id's of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of tokens id's
   * @memberof LogsTokensService
   */
  getTokensIds(serviceName) {
    return this.TokenApiService.query({ serviceName }).$promise;
  }

  /**
   * returns details of an token
   *
   * @param {any} serviceName
   * @param {any} tokenId
   * @returns promise which will be resolve to token object
   * @memberof LogsTokensService
   */
  getToken(serviceName, tokenId) {
    return this.TokenApiService.get({
      serviceName,
      tokenId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError(
        'logs_tokens_get_detail_error',
        err,
        {},
      ),
    );
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
    return this.TokenApiService.delete({ serviceName, tokenId: token.tokenId })
      .$promise.then((operation) => {
        this.resetAllCache();
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
    return this.TokenApiService.create({ serviceName }, token)
      .$promise.then((operation) => {
        this.resetAllCache();
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
  getClusters(serviceName, errorMessageParam) {
    const errorMessage = errorMessageParam || 'logs_tokens_cluster_get_error';
    return this.DetailsAapiService.me({ serviceName })
      .$promise.then((details) => details.clusters)
      .catch((err) =>
        this.LogsHelperService.handleError(errorMessage, err, {
          accountName: serviceName,
        }),
      );
  }

  /**
   * returns default cluster associated with user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to default cluster
   * @memberof LogsInputsService
   */
  getDefaultCluster(serviceName, errorMessage) {
    return this.getClusters(serviceName, errorMessage).then((clusters) => {
      const defaultClusters = clusters.filter((cluster) => cluster.isDefault);
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

  resetAllCache() {
    this.TokenApiService.resetAllCache();
  }
}
