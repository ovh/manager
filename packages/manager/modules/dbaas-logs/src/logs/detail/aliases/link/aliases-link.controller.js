import filter from 'lodash/filter';
import find from 'lodash/find';

export default class LogsAliasesLinkCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    LogsAliasesService,
    CucControllerHelper,
    LogsStreamsService,
    LogsIndexService,
    CucCloudMessage,
    CucServiceHelper,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsAliasesService = LogsAliasesService;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsIndexService = LogsIndexService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucServiceHelper = CucServiceHelper;

    this.initLoaders();
  }

  /**
   * load data
   *
   * @memberof LogsAliasesLinkCtrl
   */
  initLoaders() {
    this.availableStreams = this.$q.defer();
    this.attachedStreams = this.$q.defer();
    this.availableIndices = this.$q.defer();
    this.attachedIndices = this.$q.defer();

    this.alias = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.getAliasWithStreamsAndIndices(
          this.serviceName,
          this.$stateParams.aliasId,
        ).then((alias) => {
          if (alias.streams.length > 0) {
            this.selectedContent = this.contents[0].value;
          } else if (alias.indexes.length > 0) {
            this.selectedContent = this.contents[1].value;
          }
          this.attachedStreams.resolve(alias.streams);
          this.attachedIndices.resolve(alias.indexes);
          return alias;
        }),
    });
    this.alias.load();

    this.streams = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getStreams(this.serviceName),
    });
    this.streams.load();

    this.indices = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsIndexService.getIndices(this.serviceName),
    });
    this.indices.load();

    this.contents = this.LogsAliasesService.getContents();
    if (this.$stateParams.defaultContent) {
      this.selectedContent = this.$stateParams.defaultContent;
    } else {
      this.selectedContent = this.contents[0].value;
    }

    this.$q.all([this.alias.promise, this.streams.promise]).then((result) => {
      const diff = filter(
        result[1],
        (aapiStream) =>
          aapiStream.info.isEditable &&
          !find(
            result[0].streams,
            (attachedAapiStream) =>
              attachedAapiStream.info.streamId === aapiStream.info.streamId,
          ),
      );
      this.availableStreams.resolve(diff);
    });

    this.$q.all([this.alias.promise, this.indices.promise]).then((result) => {
      const diff = filter(
        result[1],
        (aapiIndex) =>
          aapiIndex.info.isEditable &&
          !find(
            result[0].indexes,
            (attachedAapiIndex) =>
              attachedAapiIndex.info.indexId === aapiIndex.info.indexId,
          ),
      );
      this.availableIndices.resolve(diff);
    });
  }

  attachStream(items) {
    this.CucCloudMessage.flushChildMessage();
    this.saveStream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.attachStream(
          this.serviceName,
          this.alias.data.info,
          items[0].info,
        ).catch(() => {
          this.CucCloudMessage.error(
            this.$translate.instant('logs_aliases_attach_stream_fail', {
              stream: items[0].info.title,
            }),
          );
          this.$q.reject();
        }),
    });
    return this.saveStream.load();
  }

  detachStream(items) {
    this.CucCloudMessage.flushChildMessage();
    this.saveStream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.detachStream(
          this.serviceName,
          this.alias.data.info,
          items[0].info,
        ).catch(() => {
          this.CucCloudMessage.error(
            this.$translate.instant('logs_aliases_detach_stream_fail', {
              stream: items[0].info.title,
            }),
          );
          this.$q.reject();
        }),
    });
    return this.saveStream.load();
  }

  attachIndex(items) {
    this.CucCloudMessage.flushChildMessage();
    this.saveIndex = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.attachIndex(
          this.serviceName,
          this.alias.data.info,
          items[0].info,
        ).catch(() => {
          this.CucCloudMessage.error(
            this.$translate.instant('logs_aliases_attach_index_fail', {
              index: items[0].info.name,
            }),
          );
          this.$q.reject();
        }),
    });
    return this.saveIndex.load();
  }

  detachIndex(items) {
    this.CucCloudMessage.flushChildMessage();
    this.saveIndex = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.detachIndex(
          this.serviceName,
          this.alias.data.info,
          items[0].info,
        ).catch(() => {
          this.CucCloudMessage.error(
            this.$translate.instant('logs_aliases_detach_index_fail', {
              index: items[0].info.name,
            }),
          );
          this.$q.reject();
        }),
    });
    return this.saveIndex.load();
  }

  isContentDisabled(contentType) {
    switch (contentType) {
      case this.LogsAliasesService.contentTypeEnum.STREAMS:
        return (
          (this.alias.data.indexes && this.alias.data.indexes.length > 0) ||
          (this.saveIndex && this.saveIndex.loading)
        );
      case this.LogsAliasesService.contentTypeEnum.INDICES:
        return (
          (this.alias.data.streams && this.alias.data.streams.length > 0) ||
          (this.saveStream && this.saveStream.loading)
        );
      default:
        return false;
    }
  }
}
