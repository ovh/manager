export default class LogsStreamsAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    LogsStreamsService,
    LogsTokensService,
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
    this.LogsTokensService = LogsTokensService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.isEdit = false;
    this.compressionAlgorithms = this.LogsStreamsService.getCompressionAlgorithms();
    this.storageDurations = this.LogsStreamsService.getStorageDurations();
    this.storageTargets = this.LogsStreamsService.getStorageTargets();
    this.storageContents = this.LogsStreamsService.getStorageContents();
    this.coldStoragePrice = { PCS: { price: '' }, PCA: { price: '' } };
    this.indexingStoragePrice = {
      FirstStep: { price: '' },
      SecondStep: { price: '' },
    };
    this.availableRetentions = [];
    this.initLoaders();
  }

  /**
   * initializes options list
   *
   * @memberof LogsStreamsHomeCtrl
   */
  initLoaders() {
    this.defaultCluster = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsTokensService.getDefaultCluster(this.serviceName),
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
        return this.catalog.load();
      })
      .then(() => {
        const selectedCatalog = this.catalog.data.plans.find(
          (plan) => plan.planCode === this.LogsConstants.LDP_PLAN_CODE,
        );
        const selectedFamily = selectedCatalog.addonsFamily.find(
          (addon) => addon.family === this.LogsConstants.ADD_ON_FAMILY.NEW,
        );
        const indexingCapacities = selectedFamily.addons.find(
          (add) =>
            add.plan.planCode ===
            this.LogsConstants.CONSUMPTION_REFERENCE.STREAM,
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
        const indexingFirstStepPrice = indexingCapacities.plan.details.pricings.default.find(
          (capabilities) =>
            capabilities.capacities.includes(
              this.LogsConstants.CONSUMPTION_CAPACITY,
            ) &&
            capabilities.maximumQuantity ===
              this.LogsConstants.INDEXING_TIERING,
        );
        const indexingSecondStepPrice = indexingCapacities.plan.details.pricings.default.find(
          (capabilities) =>
            capabilities.capacities.includes(
              this.LogsConstants.CONSUMPTION_CAPACITY,
            ) &&
            capabilities.minimumQuantity ===
              this.LogsConstants.INDEXING_TIERING + 1,
        );
        const coldstoragePCA = coldstoragePCACapacities.plan.details.pricings.default.find(
          (capabilities) =>
            capabilities.capacities.includes(
              this.LogsConstants.CONSUMPTION_CAPACITY,
            ),
        );
        const coldstoragePCS = coldstoragePCSCapacities.plan.details.pricings.default.find(
          (capabilities) =>
            capabilities.capacities.includes(
              this.LogsConstants.CONSUMPTION_CAPACITY,
            ),
        );
        this.coldStoragePrice.PCA.price = coldstoragePCA.price.text;
        this.coldStoragePrice.PCS.price = coldstoragePCS.price.text;
        this.indexingStoragePrice.FirstStep.price =
          indexingFirstStepPrice.price.text;
        this.indexingStoragePrice.SecondStep.price =
          indexingSecondStepPrice.price.text;
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

      this.defaultCluster.load().then((cluster) => {
        this.availableRetentions = cluster.retentions.reduce(
          (retentionsList, retention) => {
            if (retention.isSupported) {
              const updatedRetention = retention;
              if (updatedRetention.duration) {
                updatedRetention.label = moment
                  .duration(updatedRetention.duration)
                  .humanize();
              } else {
                updatedRetention.label = this.$translate.instant(
                  'streams_disk_full',
                );
              }
              retentionsList.push(updatedRetention);
            }
            return retentionsList;
          },
          [],
        );
        this.stream.data.retentionId = cluster.defaultRetentionId;
      });
      this.stream.data.retentionId = this.defaultCluster.defaultRetentionId;
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

  getIndexingPrices() {
    return this.$translate.instant(
      'logs_streams_enable_indexing_description',
      {
        t0: this.indexingStoragePrice.FirstStep.price,
        t1: this.LogsConstants.INDEXING_TIERING,
        t2: this.indexingStoragePrice.SecondStep.price,
      },
      undefined,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
  }

  getIndexingMaxSizeText() {
    if (this.stream.data.indexingMaxSize === 0) {
      return this.$translate.instant('logs_streams_no_limit');
    }
    return '';
  }

  getIndexingNotificationText() {
    return this.$translate.instant('logs_streams_alert_notification_detail', {
      t0: this.stream.data.indexingMaxSize,
    });
  }

  getIndexingPauseText() {
    return this.$translate.instant('logs_streams_pause_indexing_detail', {
      t0: this.stream.data.indexingMaxSize,
    });
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
          .then(() => this.$state.go('dbaas-logs.detail.streams'))
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
          .then(() => this.$state.go('dbaas-logs.detail.streams'))
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}
