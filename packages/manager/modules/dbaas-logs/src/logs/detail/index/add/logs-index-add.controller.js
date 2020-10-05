export default class LogsIndexAddModalCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    $translate,
    CucControllerHelper,
    indexInfo,
    LogsIndexService,
    LogsConstants,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.CucControllerHelper = CucControllerHelper;
    this.indexInfo = indexInfo;
    this.suffixPattern = '^[a-z0-9_-]+$';
    this.LogsIndexService = LogsIndexService;
    this.LogsConstants = LogsConstants;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.index = this.LogsIndexService.getNewIndex();
    this.indexPrice = { shard: { price: '' }, volume: { price: '' } };
    this.initLoaders();
  }

  $onInit() {
    this.isEdit = this.constructor.checkIsEdit(this.indexInfo);
    if (this.isEdit) {
      this.populateIndex();
    } else {
      this.clearIndex();
      this.accountDetails
        .load()
        .then(() => {
          this.ovhSubsidiary = this.accountDetails.data.me.ovhSubsidiary;
          return this.catalog.load();
        })
        .then(() => {
          const selectedCatalog = this.catalog.data.plans.find(
            (plan) => plan.planCode === this.LogsConstants.LDP_PLAN_CODE,
          );
          const selectedFamily = selectedCatalog.addonsFamily.find(
            (addon) => addon.family === this.LogsConstants.ADD_ON_FAMILY.NEW,
          );
          const indexShardCapacities = selectedFamily.addons.find(
            (add) =>
              add.plan.planCode ===
              this.LogsConstants.CONSUMPTION_REFERENCE.NB_SHARD,
          );
          const indexVolumeCapacities = selectedFamily.addons.find(
            (add) =>
              add.plan.planCode ===
              this.LogsConstants.CONSUMPTION_REFERENCE.INDEXED_DOCUMENTS,
          );
          const indexVolume = indexVolumeCapacities.plan.details.pricings.default.find(
            (capa) =>
              capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
          );
          const indexShard = indexShardCapacities.plan.details.pricings.default.find(
            (capa) =>
              capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
          );
          this.indexPrice.volume.price = indexVolume.price.text;
          this.indexPrice.shard.price = indexShard.price.text;
        });
    }
  }

  initLoaders() {
    this.catalog = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsIndexService.getOrderCatalog(this.ovhSubsidiary),
    });
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsIndexService.getAccountDetails(this.serviceName),
    });
  }

  showIndexPrices() {
    return this.$translate.instant(
      'logs_index_modal_nb_shard_help',
      {
        t0: this.indexPrice.shard.price,
        t1: this.indexPrice.volume.price,
      },
      undefined,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
  }

  clearIndex() {
    this.title = 'logs_index_modal_add_title';
    this.index.description = '';
    this.index.alertNotifyEnabled = false;
    this.index.suffix = '';
    this.index.nbShard = this.LogsConstants.NB_SHARD_MIN;
  }

  populateIndex() {
    this.title = 'logs_index_modal_edit_title';
    this.index.description = this.indexInfo.description;
    this.index.alertNotifyEnabled = this.indexInfo.alertNotifyEnabled;
    this.index.nbShard = this.indexInfo.nbShard;
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
