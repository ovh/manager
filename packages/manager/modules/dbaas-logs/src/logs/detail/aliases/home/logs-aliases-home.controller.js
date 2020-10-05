export default class LogsAliasesHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    LogsAliasesService,
    CucControllerHelper,
    CucCloudMessage,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsAliasesService = LogsAliasesService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;

    this.initLoaders();
  }

  /**
   * initializes aliases object by making API call to get data
   *
   * @memberof LogsAliasesHomeCtrl
   */
  initLoaders() {
    this.aliases = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsAliasesService.getAliases(this.serviceName),
    });
    this.aliases.load();
  }

  /**
   * navigates to add alias page
   *
   * @memberof LogsAliasesHomeCtrl
   */
  add() {
    this.$state.go('dbaas-logs.detail.aliases.home.add', {
      serviceName: this.serviceName,
    });
  }

  /**
   * navigates to edit alias page
   *
   * @param {any} alias
   * @memberof LogsAliasesHomeCtrl
   */
  edit(alias) {
    this.$state.go('dbaas-logs.detail.aliases.home.edit', {
      serviceName: this.serviceName,
      aliasId: alias.aliasId,
    });
  }

  /**
   * navigates to link content page
   *
   * @param {any} aapiAlias
   * @memberof LogsAliasesHomeCtrl
   */
  attachContent(aapiAlias) {
    this.$state.go('dbaas-logs.detail.aliases.link', {
      serviceName: this.serviceName,
      aliasId: aapiAlias.info.aliasId,
      defaultContent:
        aapiAlias.indexes.length > 0
          ? this.LogsAliasesService.contentTypeEnum.INDICES
          : this.LogsAliasesService.contentTypeEnum.STREAMS,
    });
  }

  /**
   * show delete alias confirmation modal
   *
   * @param {any} alias to delete
   * @memberof LogsAliasesHomeCtrl
   */
  showDeleteConfirm(alias) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('logs_aliases_delete_title'),
        textHtml: this.$translate.instant('logs_alias_delete_message', {
          alias: alias.name,
        }),
      })
      .then(() => this.delete(alias));
  }

  /**
   * delete alias
   *
   * @param {any} alias to delete
   * @memberof LogsAliasesHomeCtrl
   */
  delete(alias) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.deleteAlias(this.serviceName, alias)
          .then(() => this.initLoaders())
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    this.delete.load();
  }

  getElasticSearchUrl(alias) {
    return this.LogsAliasesService.getElasticSearchUrl(alias);
  }
}
