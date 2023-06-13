import datagridToIcebergFilter from '../../logs-iceberg.utils';

export default class LogsAliasesHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    $window,
    ouiDatagridService,
    LogsAliasesService,
    LogsIndexService,
    CucControllerHelper,
    CucCloudMessage,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.$window = $window;
    this.ouiDatagridService = ouiDatagridService;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsAliasesService = LogsAliasesService;
    this.LogsIndexService = LogsIndexService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
  }

  loadAliases({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'name';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsAliasesService.getPaginatedAliases(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
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
    this.$state.go('dbaas-logs.detail.aliases.home.alias.edit', {
      serviceName: this.serviceName,
      aliasId: alias.aliasId,
    });
  }

  /**
   * navigates to link content page
   *
   * @param {any} alias
   * @memberof LogsAliasesHomeCtrl
   */
  attachContent(alias) {
    this.LogsIndexService.getIndicesForAlias(
      this.serviceName,
      alias.aliasId,
    ).then((indexes) =>
      this.$state.go('dbaas-logs.detail.aliases.home.alias.link', {
        serviceName: this.serviceName,
        aliasId: alias.aliasId,
        defaultContent:
          indexes.length > 0
            ? this.LogsAliasesService.contentTypeEnum.INDICES
            : this.LogsAliasesService.contentTypeEnum.STREAMS,
      }),
    );
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
      .then(() => this.remove(alias));
  }

  /**
   * delete alias
   *
   * @param {any} alias to delete
   * @memberof LogsAliasesHomeCtrl
   */
  remove(alias) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.deleteAlias(this.serviceName, alias).finally(
          () => {
            this.ouiDatagridService.refresh('aliases-datagrid', true);
            this.CucControllerHelper.scrollPageToTop();
          },
        ),
    });
    this.delete.load();
  }

  openOpenSearch(alias) {
    this.LogsAliasesService.getOpenSearchUrl(this.serviceName, alias).then(
      (url) => {
        this.$window.open(url, '_blank');
      },
    );
  }
}
