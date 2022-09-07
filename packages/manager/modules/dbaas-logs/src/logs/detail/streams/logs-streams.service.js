import find from 'lodash/find';
import get from 'lodash/get';

export default class LogsStreamsService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    iceberg,
    LogsHomeService,
    LogsStreamsAlertsService,
    LogsStreamsArchivesService,
    LogsOrderService,
    LogsConstants,
    OvhApiDbaas,
    CucUrlHelper,
    LogsHelperService,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.LogsApiService = OvhApiDbaas.Logs().v6();
    this.StreamsApiService = OvhApiDbaas.Logs()
      .Stream()
      .v6();
    this.StreamsAapiService = OvhApiDbaas.Logs()
      .Stream()
      .Aapi();
    this.DetailsAapiService = OvhApiDbaas.Logs()
      .Details()
      .Aapi();
    this.LogsHomeService = LogsHomeService;
    this.LogsStreamsAlertsService = LogsStreamsAlertsService;
    this.LogsStreamsArchivesService = LogsStreamsArchivesService;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsOrderService = LogsOrderService;
    this.CucUrlHelper = CucUrlHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.LogsHelperService = LogsHelperService;

    this.initializeData();
  }

  initializeData() {
    this.compressionAlgorithms = [
      {
        value: this.LogsConstants.GZIP,
        name: this.$translate.instant('logs_stream_compression_gzip'),
      },
      {
        value: this.LogsConstants.DEFLATED,
        name: this.$translate.instant('logs_stream_compression_zip'),
      },
      {
        value: this.LogsConstants.LZMA,
        name: this.$translate.instant('logs_stream_compression_lzma'),
      },
      {
        value: this.LogsConstants.ZSTD,
        name: this.$translate.instant('logs_stream_compression_zstd'),
      },
    ];

    this.storageDurations = [
      {
        value: 1,
        name: this.$translate.instant('logs_stream_retention_1y'),
      },
      {
        value: 2,
        name: this.$translate.instant('logs_stream_retention_2y'),
      },
      {
        value: 5,
        name: this.$translate.instant('logs_stream_retention_5y'),
      },
      {
        value: 10,
        name: this.$translate.instant('logs_stream_retention_10y'),
      },
    ];

    this.storageTargets = [
      {
        value: this.LogsConstants.PCS,
        name: this.$translate.instant('logs_stream_target_pcs'),
      },
      {
        value: this.LogsConstants.PCA,
        name: this.$translate.instant('logs_stream_target_pca'),
      },
    ];

    this.storageContents = [
      {
        value: this.LogsConstants.CONTENT_GELF,
        name: this.$translate.instant('logs_stream_content_gelf'),
      },
      {
        value: this.LogsConstants.CONTENT_PLAIN,
        name: this.$translate.instant('logs_stream_content_plain'),
      },
      {
        value: this.LogsConstants.CONTENT_ALL,
        name: this.$translate.instant('logs_stream_content_all'),
      },
    ];
  }

  /**
   * returns array of streams with details of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of streams.
   *          each stream will have all details populated.
   * @memberof LogsStreamsService
   */
  getStreams(serviceName) {
    return this.getStreamDetails(serviceName);
  }

  /**
   * returns array of owned streams with details of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of streams.
   *          each stream will have all details populated.
   * @memberof LogsStreamsService
   */
  getOwnStreams(serviceName) {
    return this.getStreamDetails(serviceName)
      .then(({ data = [] }) => data.filter((stream) => stream.isEditable))
      .catch((err) =>
        this.LogsHelperService.handleError('logs_streams_get_error', err, {}),
      );
  }

  /**
   * gets stream details for each stream in array
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of streams
   * @memberof LogsStreamsService
   */
  getStreamDetails(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/output/graylog/stream`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  /**
   * returns details of a stream
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @returns promise which will be resolve to stream object
   * @memberof LogsStreamsService
   */
  getStream(serviceName, streamId) {
    return this.StreamsApiService.get({
      serviceName,
      streamId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError('logs_stream_get_error', err, {}),
    );
  }

  /**
   * returns details of a stream making call to Aapi (2api) service
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @returns promise which will be resolve to stream object
   * @memberof LogsStreamsService
   */
  getAapiStream(serviceName, streamId) {
    return this.StreamsAapiService.get({
      serviceName,
      streamId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError('logs_stream_get_error', err, {}),
    );
  }

  /**
   * delete stream
   *
   * @param {any} serviceName
   * @param {any} stream, stream object to be deleted
   * @returns promise which will be resolve to operation object
   * @memberof LogsStreamsService
   */
  deleteStream(serviceName, stream) {
    return this.StreamsApiService.delete(
      { serviceName, streamId: stream.streamId },
      stream,
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_stream_delete_success',
          { streamName: stream.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_stream_delete_error', err, {
          streamName: stream.title,
        }),
      );
  }

  /**
   * create new stream
   *
   * @param {any} serviceName
   * @param {any} stream, stream object to be created
   * @returns promise which will be resolve to operation object
   * @memberof LogsStreamsService
   */
  createStream(serviceName, stream) {
    return this.StreamsApiService.create(
      { serviceName },
      {
        coldStorageCompression: stream.coldStorageCompression,
        coldStorageContent: stream.coldStorageContent,
        coldStorageEnabled: stream.coldStorageEnabled,
        coldStorageNotifyEnabled: stream.coldStorageNotifyEnabled,
        coldStorageRetention: stream.coldStorageRetention,
        coldStorageTarget: stream.coldStorageTarget,
        description: stream.description,
        indexingEnabled: stream.indexingEnabled,
        indexingMaxSize: stream.indexingMaxSize,
        indexingNotifyEnabled: stream.indexingNotifyEnabled,
        pauseIndexingOnMaxSize: stream.pauseIndexingOnMaxSize,
        retentionId: stream.retentionId,
        title: stream.title,
        webSocketEnabled: stream.webSocketEnabled,
        encryptionKeysIds: stream.encryptionKeysIds,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_stream_create_success',
          { streamName: stream.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_stream_create_error', err, {
          streamName: stream.title,
        }),
      );
  }

  /**
   * update stream
   *
   * @param {any} serviceName
   * @param {any} stream, stream object to be updated
   * @returns promise which will be resolve to operation object
   * @memberof LogsStreamsService
   */
  updateStream(serviceName, stream) {
    return this.StreamsApiService.update(
      { serviceName, streamId: stream.streamId },
      {
        coldStorageCompression: stream.coldStorageCompression,
        coldStorageContent: stream.coldStorageContent,
        coldStorageEnabled: stream.coldStorageEnabled,
        coldStorageNotifyEnabled: stream.coldStorageNotifyEnabled,
        coldStorageRetention: stream.coldStorageRetention,
        coldStorageTarget: stream.coldStorageTarget,
        description: stream.description,
        indexingEnabled: stream.indexingEnabled,
        indexingMaxSize: stream.indexingMaxSize,
        indexingNotifyEnabled: stream.indexingNotifyEnabled,
        pauseIndexingOnMaxSize: stream.pauseIndexingOnMaxSize,
        title: stream.title,
        webSocketEnabled: stream.webSocketEnabled,
        encryptionKeysIds: stream.encryptionKeysIds,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_stream_update_success',
          { streamName: stream.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_stream_update_error', err, {
          streamName: stream.title,
        }),
      );
  }

  /**
   * returns array of stream id's of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of stream id's
   * @memberof LogsStreamsService
   */
  getAllStreams(serviceName) {
    return this.LogsApiService.streams({ serviceName }).$promise;
  }

  getCompressionAlgorithms() {
    return this.compressionAlgorithms;
  }

  getStorageDurations() {
    return this.storageDurations;
  }

  getStorageTargets() {
    return this.storageTargets;
  }

  getStorageContents() {
    return this.storageContents;
  }

  /**
   * creates new stream with default values
   *
   * @returns stream object with default values
   * @memberof LogsStreamsService
   */
  getNewStream() {
    return {
      data: {
        coldStorageCompression: this.compressionAlgorithms[0].value,
        coldStorageRetention: this.storageDurations[0].value,
        coldStorageContent: this.storageContents[0].value,
        coldStorageTarget: this.storageTargets[0].value,
        coldStorageNotifyEnabled: true,
        coldStorageEnabled: false,
        webSocketEnabled: true,
        indexingEnabled: true,
        indexingNotifyEnabled: true,
        encryptionKeysIds: [],
      },
      loading: false,
    };
  }

  /**
   * extracts graylog URL from stream. Shows error message on UI if no graylog URL is found.
   *
   * @param {any} stream
   * @returns {string} graylog url, if not found empty string
   * @memberof LogsStreamsService
   */
  getStreamGraylogUrl(serviceName, stream) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${stream.streamId}/url`,
      )
      .then(({ data: urls }) => {
        const url = this.CucUrlHelper.constructor.findUrl(
          { urls },
          this.LogsConstants.GRAYLOG_WEBUI,
        );
        if (stream.indexingEnabled && !url) {
          this.CucCloudMessage.error(
            this.$translate.instant('logs_streams_get_graylog_url_error', {
              stream: stream.title,
            }),
          );
        }
        return url;
      });
  }

  /**
   * extracts and copies stream token to clipboard.
   * Shows error message on UI if no no token found or browser does not support clipboard copy.
   *
   * @param {any} stream
   * @memberof LogsStreamsService
   */
  copyStreamToken(serviceName, stream) {
    return this.iceberg(
      `/dbaas/logs/${serviceName}/output/graylog/stream/${stream.streamId}/rule`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data: rules }) => {
        const { value: token } = rules.find(
          (rule) => rule.field === this.LogsConstants.X_OVH_TOKEN,
        );
        if (token) {
          const error = this.CucControllerHelper.constructor.copyToClipboard(
            token,
          );
          if (error) {
            this.CucCloudMessage.error(
              this.$translate.instant('logs_streams_copy_token_error', {
                stream: stream.title,
                token_value: token,
              }),
            );
          } else {
            this.CucCloudMessage.info(
              this.$translate.instant('logs_streams_copy_token_success'),
            );
          }
        } else {
          this.CucCloudMessage.error(
            this.$translate.instant('logs_streams_find_token_error', {
              stream: stream.title,
            }),
          );
        }
      });
  }

  /**
   * Extracts X-OVH-TOKEN token from given stream.
   * Throws exception on UI if token was not found.
   * @param {object} stream
   * @return {string} stream token if found, empty string otherwise
   */
  getStreamToken(stream) {
    const token = this.findStreamTokenValue(stream);
    if (!token) {
      this.CucCloudMessage.error(
        this.$translate.instant('logs_streams_find_token_error', {
          stream: stream.info.title,
        }),
      );
    }
    return token;
  }

  /**
   * extracts X-OVH-TOKEN token from given stream
   * @param {object} stream
   * @return {string} stream token if found, empty string otherwise
   */
  findStreamTokenValue(stream) {
    const ruleObj = find(
      stream.rules,
      (rule) => rule.field === this.LogsConstants.X_OVH_TOKEN,
    );
    return get(ruleObj, 'value');
  }

  getOrderCatalog(ovhSubsidiary) {
    return this.LogsOrderService.getOrderCatalog(ovhSubsidiary);
  }

  getAccountDetails(serviceName) {
    return this.LogsHomeService.getAccountDetails(serviceName);
  }

  resetAllCache() {
    this.LogsApiService.resetAllCache();
    this.StreamsApiService.resetAllCache();
    this.StreamsAapiService.resetAllCache();
    // refresh home page last modified stream
    this.DetailsAapiService.resetAllCache();
  }
}
