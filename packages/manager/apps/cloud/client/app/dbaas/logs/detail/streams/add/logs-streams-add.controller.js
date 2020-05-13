class LogsStreamsAddCtrl {
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    LogsStreamsService,
    CucControllerHelper,
    CucCloudMessage,
    LogsConstants,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsStreamsService = LogsStreamsService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.isEdit = false;
    this.compressionAlgorithms = this.LogsStreamsService.getCompressionAlgorithms();
    this.storageDurations = this.LogsStreamsService.getStorageDurations();
    this.storageTargets = this.LogsStreamsService.getStorageTargets();
    this.storageContents = this.LogsStreamsService.getStorageContents();
    this.coldStoragePrice = { PCS: { price: '' }, PCA: { price: '' } };
    this.initLoaders();
  }

  /**
   * initializes options list
   *
   * @memberof LogsStreamsHomeCtrl
   */
  initLoaders() {
    this.options = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getSubscribedOptions(this.serviceName),
    });
    this.options.load();

    this.mainOffer = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getMainOffer(this.serviceName),
    });
    this.catalog = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getOrderCatalog(this.ovhSubsidiary),
    });
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getAccountDetails(this.serviceName),
    });

    this.accountDetails
      .load()
      .then(() => {
        this.ovhSubsidiary = this.accountDetails.data.me.ovhSubsidiary;
        return this.$q.all([this.mainOffer.load(), this.catalog.load()]);
      })
      .then(() => {
        if (
          this.mainOffer.data.planCode === this.LogsConstants.basicOffer &&
          !this.isEdit
        ) {
          this.stream.data.webSocketEnabled = false;
        }
        const selectedCatalog = this.catalog.data.plans.find(
          (plan) => plan.planCode === this.mainOffer.data.planCode,
        );
        const selectedFamily = selectedCatalog.addonsFamily.find(
          (addon) =>
            addon.family === this.LogsConstants.ADD_ON_FAMILY.DEPRECATED,
        );
        const coldstoragePCACapacities = selectedFamily.addons.find(
          (add) =>
            add.plan.planCode ===
            this.LogsConstants.CONSUMPTION_REFERENCE.COLDSTORAGE_PCA,
        );
        const coldstoragePCSCapacities = selectedFamily.addons.find(
          (add) =>
            add.plan.planCode ===
            this.LogsConstants.CONSUMPTION_REFERENCE.COLDSTORAGE_PCS,
        );
        const coldstoragePCA = coldstoragePCACapacities.plan.details.pricings.default.find(
          (capa) =>
            capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
        );
        const coldstoragePCS = coldstoragePCSCapacities.plan.details.pricings.default.find(
          (capa) =>
            capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
        );
        this.coldStoragePrice.PCA.price = coldstoragePCA.price.text;
        this.coldStoragePrice.PCS.price = coldstoragePCS.price.text;
      });

    if (this.$stateParams.streamId) {
      this.isEdit = true;
      this.stream = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsStreamsService.getStream(
            this.serviceName,
            this.$stateParams.streamId,
          ),
      });
      this.stream.load();
    } else {
      this.isEdit = false;
      this.stream = this.LogsStreamsService.getNewStream();
    }
  }

  submit() {
    if (this.isEdit) {
      this.updateStream();
    } else {
      this.createStream();
    }
  }

  getColdStoragePrice() {
    return this.$translate.instant(
      'streams_cold_storage_price',
      {
        t0: this.coldStoragePrice[this.stream.data.coldStorageTarget].price,
        t1: this.LogsConstants.COLDSTORAGE_INCREMENT,
      },
      undefined,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
  }

  /**
   * update stream
   *
   * @memberof LogsStreamsHomeCtrl
   */
  updateStream() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.updateStream(this.serviceName, this.stream.data)
          .then(() => this.$state.go('dbaas.logs.detail.streams'))
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  /**
   * create new stream
   *
   * @memberof LogsStreamsHomeCtrl
   */
  createStream() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.createStream(this.serviceName, this.stream.data)
          .then(() => this.$state.go('dbaas.logs.detail.streams'))
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}

angular
  .module('managerApp')
  .controller('LogsStreamsAddCtrl', LogsStreamsAddCtrl);
