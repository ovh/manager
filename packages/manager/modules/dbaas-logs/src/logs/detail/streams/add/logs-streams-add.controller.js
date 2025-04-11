import pull from 'lodash/pull';

export default class LogsStreamsAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    LogsStreamsService,
    LogsTokensService,
    LogsEncryptionKeysService,
    LogsHelperService,
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
    this.LogsEncryptionKeysService = LogsEncryptionKeysService;
    this.LogsHelperService = LogsHelperService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.isEdit = false;
    this.compressionAlgorithms = this.LogsStreamsService.getCompressionAlgorithms();
    this.storageDurations = this.LogsStreamsService.getStorageDurations();
    this.storageContents = this.LogsStreamsService.getStorageContents();
    this.coldStoragePrice = { price: '' };
    this.indexingStoragePrice = {
      FirstStep: { price: '' },
      SecondStep: { price: '' },
    };
    this.availableIndexingRetentions = [];
    this.encryptionEnabled = false;
    this.initLoaders();
  }

  $onInit() {
    this.catalog.load().then((catalog) => {
      const selectedCatalog = catalog.plans.find(
        (plan) => plan.planCode === this.LogsConstants.LDP_PLAN_CODE,
      );
      const selectedFamily = selectedCatalog.addonsFamily.find(
        (addon) => addon.family === this.LogsConstants.ADD_ON_FAMILY.NEW,
      );
      selectedFamily.addons.forEach((add) => {
        if (
          add.plan.planCode === this.LogsConstants.CONSUMPTION_REFERENCE.STREAM
        ) {
          const indexingFirstStepPrice = add.plan.details.pricings.default.find(
            (capabilities) =>
              capabilities.capacities.includes(
                this.LogsConstants.CONSUMPTION_CAPACITY,
              ) &&
              capabilities.maximumQuantity ===
                this.LogsConstants.INDEXING_TIERING,
          );
          const indexingSecondStepPrice = add.plan.details.pricings.default.find(
            (capabilities) =>
              capabilities.capacities.includes(
                this.LogsConstants.CONSUMPTION_CAPACITY,
              ) &&
              capabilities.minimumQuantity ===
                this.LogsConstants.INDEXING_TIERING + 1,
          );
          this.indexingStoragePrice.FirstStep.price =
            indexingFirstStepPrice.price.text;
          this.indexingStoragePrice.SecondStep.price =
            indexingSecondStepPrice.price.text;
        }
        if (
          add.plan.planCode ===
          this.LogsConstants.CONSUMPTION_REFERENCE.COLDSTORAGE
        ) {
          const coldstorage = add.plan.details.pricings.default.find(
            (capabilities) =>
              capabilities.capacities.includes(
                this.LogsConstants.CONSUMPTION_CAPACITY,
              ),
          );
          this.coldStoragePrice.price = coldstorage.price.text;
        }
      });
    });

    this.encryptionKeys.load();

    if (this.$stateParams.streamId) {
      this.isEdit = true;
      this.stream = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsStreamsService.getStream(
            this.serviceName,
            this.$stateParams.streamId,
          ),
      });
      this.stream.load().then(() => {
        if (this.stream.data.encryptionKeysIds.length > 0) {
          this.encryptionEnabled = true;
        }
      });
    } else {
      this.isEdit = false;
      this.stream = this.LogsStreamsService.getNewStream();

      this.LogsStreamsService.getRetentions(this.serviceName).then(
        (retentions) => {
          this.availableIndexingRetentions = retentions.reduce(
            (retentionsList, retention) => {
              if (
                retention.isSupported &&
                retention.retentionType ===
                  this.LogsConstants.RETENTION_TYPE.INDEXING
              ) {
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
        },
      );
      this.defaultCluster.load().then((cluster) => {
        this.stream.data.retentionId = cluster.defaultRetentionId;
      });
    }
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
        this.LogsStreamsService.getOrderCatalog(this.serviceName),
    });
    this.encryptionKeys = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsEncryptionKeysService.getEncryptionKeys(this.serviceName),
    });
  }

  submit() {
    if (this.isEdit) {
      this.updateStream();
    } else {
      this.createStream();
    }
  }

  getColdStoragePrice() {
    const desc = this.$translate.instant(
      'logs_streams_enable_archieve_description',
    );
    const price = this.$translate.instant(
      'streams_cold_storage_price',
      {
        t0: this.coldStoragePrice.price,
        t1: this.LogsConstants.COLDSTORAGE_INCREMENT,
      },
      undefined,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
    return `${desc} ${price}`;
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

  updateSelectedEncryptionKeys(checked, encryptionKeyId) {
    if (checked) {
      this.stream.data.encryptionKeysIds.push(encryptionKeyId);
    } else {
      pull(this.stream.data.encryptionKeysIds, encryptionKeyId);
    }
  }

  updateEncryption(checked) {
    if (checked === false) {
      this.stream.data.encryptionKeysIds = [];
    } else if (
      this.encryptionKeys.data.length <=
      this.LogsConstants.MAX_ENCRYPTION_KEY_PER_STREAM
    ) {
      this.encryptionKeys.data.forEach((entry) => {
        this.stream.data.encryptionKeysIds.push(entry.encryptionKeyId);
      });
    }
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
