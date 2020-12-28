import set from 'lodash/set';

export default class LogsTokensCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    LogsTokensService,
    CucControllerHelper,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.LogsTokensService = LogsTokensService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;

    this.initLoaders();
  }

  /**
   * load tokens array by making API call to get data
   *
   * @memberof LogsTokensCtrl
   */
  initLoaders() {
    this.tokens = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsTokensService.getTokens(this.serviceName).then((tokens) =>
          tokens.map((token) => {
            set(token, 'isLoadingCluster', true);
            return token;
          }),
        ),
    });
    this.clusters = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsTokensService.getClusters(this.serviceName),
    });
    this.tokens.load();
    this.clusters.load();
    this.$q.all([this.clusters.promise, this.tokens.promise]).then((result) => {
      const clusters = result[0];
      const tokens = result[1];
      tokens.map((token) => {
        set(
          token,
          'cluster',
          clusters.find((cluster) => cluster.clusterId === token.clusterId) ||
            {},
        );
        set(token, 'isLoadingCluster', false);
        return token;
      });
    });
  }

  /**
   * show delete token confirmation modal
   *
   * @param {any} token to delete
   * @memberof LogsTokensCtrl
   */
  showDeleteConfirm(token) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('logs_tokens_delete_title'),
        textHtml: this.$translate.instant('logs_tokens_delete_message', {
          tokenName: token.name,
        }),
      })
      .then(() => this.remove(token));
  }

  goToHomePage() {
    this.$state.go('dbaas-logs.detail', {
      serviceName: this.serviceName,
    });
  }

  /**
   * delete token
   *
   * @param {any} token to delete
   * @memberof LogsTokensCtrl
   */
  remove(token) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsTokensService.deleteToken(this.serviceName, token)
          .then(() => this.initLoaders())
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    this.delete.load();
  }
}
