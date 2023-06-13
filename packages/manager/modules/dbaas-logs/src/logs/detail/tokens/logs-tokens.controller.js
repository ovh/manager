import datagridToIcebergFilter from '../logs-iceberg.utils';

export default class LogsTokensCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    ouiDatagridService,
    LogsTokensService,
    CucControllerHelper,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
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
    this.clusters = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsTokensService.getClusters(this.serviceName),
    });
    this.clusters.load();
  }

  loadTokens({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'name';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsTokensService.getPaginatedTokens(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
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
          .finally(() => {
            this.ouiDatagridService.refresh('tokens-datagrid', true);
            this.CucControllerHelper.scrollPageToTop();
          }),
    });
    this.delete.load();
  }
}
