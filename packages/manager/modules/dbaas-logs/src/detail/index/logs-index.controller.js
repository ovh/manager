import addTemplate from './add/logs-index-add.html';

export default class LogsIndexCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    cucBytesFilter,
    CucCloudMessage,
    CucControllerHelper,
    LogsIndexService,
    DbaasLogsConstants,
  ) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsIndexService = LogsIndexService;
    this.DbaasLogsConstants = DbaasLogsConstants;
    this.suffixPattern = this.DbaasLogsConstants.suffixPattern;
    this.cucBytesFilter = cucBytesFilter;
    this.initLoaders();
  }

  initLoaders() {
    this.indexOptions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsIndexService.getSubscribedOptions(this.serviceName),
    });

    this.quota = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsIndexService.getQuota(this.serviceName),
    });

    this.indices = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsIndexService.getIndices(this.serviceName),
    });

    this.quota.load();
    this.indices.load();
    this.indexOptions.load();
  }

  add(info) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template: addTemplate,
          controller: 'LogsIndexAddModalCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
          resolve: {
            serviceName: () => this.serviceName,
            indexInfo: () => info,
            options: () => this.indexOptions,
            quota: () => this.quota,
          },
        },
      })
      .then(() => {
        this.initLoaders();
      });
  }

  storageColor(info) {
    const percentage = parseInt((info.currentStorage * 100) / info.maxSize, 10);
    if (percentage >= 80) {
      return `oui-status_${this.DbaasLogsConstants.indexStorage.error}`;
    }
    if (percentage < 60) {
      return `oui-status_${this.DbaasLogsConstants.indexStorage.success}`;
    }
    if (percentage >= 60 && percentage < 80) {
      return `oui-status_${this.DbaasLogsConstants.indexStorage.warning}`;
    }
    return null;
  }

  showDeleteConfirm(info) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsIndexService.deleteModal(info.name).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsIndexService.deleteIndex(this.serviceName, info)
            .then(() => this.initLoaders())
            .finally(() => this.CucControllerHelper.scrollPageToTop()),
      });

      this.delete.load();
    });
  }
}
