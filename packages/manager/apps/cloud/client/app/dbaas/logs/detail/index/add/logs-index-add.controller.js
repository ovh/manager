class LogsIndexAddModalCtrl {
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    CucControllerHelper,
    indexInfo,
    options,
    quota,
    LogsIndexService,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.CucControllerHelper = CucControllerHelper;
    this.indexInfo = indexInfo;
    this.options = options;
    this.quota = quota;
    this.suffixPattern = '^[a-z0-9_-]+$';
    this.LogsIndexService = LogsIndexService;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = $stateParams.serviceName;
    this.index = this.LogsIndexService.getNewIndex();
  }

  $onInit() {
    this.isEdit = this.constructor.checkIsEdit(this.indexInfo);
    if (this.isEdit) {
      this.populateIndex();
    } else {
      this.clearIndex();
    }
  }

  clearIndex() {
    this.title = 'logs_index_modal_add_title';
    this.index.description = '';
    this.index.alertNotifyEnabled = false;
    this.index.suffix = '';
    this.index.optionId = null;
  }

  populateIndex() {
    this.title = 'logs_index_modal_edit_title';
    this.index.description = this.indexInfo.description;
    this.index.alertNotifyEnabled = this.indexInfo.alertNotifyEnabled;
  }

  static checkIsEdit(indexInfo) {
    return indexInfo !== undefined;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  save() {
    if (this.isEdit) {
      return this.editIndex();
    }
    return this.saveIndex();
  }

  saveIndex() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsIndexService.createIndex(this.serviceName, this.index)
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  editIndex() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsIndexService.updateIndex(
          this.serviceName,
          this.indexInfo,
          this.index,
        )
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}

angular
  .module('managerApp')
  .controller('LogsIndexAddModalCtrl', LogsIndexAddModalCtrl);
