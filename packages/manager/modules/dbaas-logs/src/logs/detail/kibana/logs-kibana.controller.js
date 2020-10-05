import template from './add/logs-kibana-add.html';

export default class LogsKibanaCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    CucCloudMessage,
    CucControllerHelper,
    LogsKibanaService,
  ) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsKibanaService = LogsKibanaService;
    this.initLoaders();
  }

  initLoaders() {
    this.kibanas = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsKibanaService.getKibanas(this.serviceName),
    });
    this.kibanas.load();
  }

  add(info) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template,
          controller: 'LogsKibanaAddModalCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
          resolve: {
            serviceName: () => this.serviceName,
            kibanaInfo: () => info,
          },
        },
      })
      .then(() => {
        this.initLoaders();
      });
  }

  showDeleteConfirm(info) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsKibanaService.deleteModal(info.name).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsKibanaService.deleteKibana(this.serviceName, info)
            .then(() => this.initLoaders())
            .finally(() => this.CucControllerHelper.scrollPageToTop()),
      });

      this.delete.load();
    });
  }
}
