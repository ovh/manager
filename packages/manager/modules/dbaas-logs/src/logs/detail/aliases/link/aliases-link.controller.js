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
    this.aliasId = this.$stateParams.aliasId;
    this.LogsAliasesService = LogsAliasesService;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsIndexService = LogsIndexService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucServiceHelper = CucServiceHelper;

    this.availableStreams = [];
    this.attachedStreams = [];
    this.availableIndices = [];
    this.attachedIndices = [];

    this.initLoaders();
  }

  /**
   * load data
   *
   * @memberof LogsAliasesLinkCtrl
   */
  initLoaders() {
    this.alias = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsAliasesService.getAliasWithStreamsAndIndices(
          this.serviceName,
          this.aliasId,
        ).then((alias) => {
          if (alias.data.nbStream > 0) {
            this.selectedContent = this.contents[0].value;
          } else if (alias.data.nbIndex > 0) {
            this.selectedContent = this.contents[1].value;
          }
          this.filterIndices(alias);
          this.filterStreams(alias);
          return alias;
        }),
    });
    this.alias.load();
    this.contents = this.LogsAliasesService.getContents();
    if (this.$stateParams.defaultContent) {
      this.selectedContent = this.$stateParams.defaultContent;
    } else {
      this.selectedContent = this.contents[0].value;
    }
  }

  filterIndices(alias) {
    this.LogsIndexService.getOwnIndices(this.serviceName).then((result) => {
      if (alias.indexes) {
        this.attachedIndices = filter(result, (index) =>
          find(alias.indexes.data, (indexId) => indexId === index.indexId),
        );
        this.availableIndices = filter(
          result,
          (index) =>
            !find(alias.indexes.data, (indexId) => indexId === index.indexId),
        );
      } else {
        this.attachedIndices = [];
        this.availableIndices = result;
      }
    });
  }

  filterStreams(alias) {
    this.LogsStreamsService.getOwnStreams(this.serviceName).then((result) => {
      if (alias.streams) {
        const attached = filter(result, (stream) =>
          find(alias.streams.data, (streamId) => streamId === stream.streamId),
        );
        const available = filter(
          result,
          (stream) =>
            !find(
              alias.streams.data,
              (streamId) => streamId === stream.streamId,
            ),
        );
        this.attachedStreams = attached;
        this.availableStreams = available;
      } else {
        this.attachedStreams = [];
        this.availableStreams = result;
      }
    });
  }

  attachStream(items) {
    this.CucCloudMessage.flushChildMessage();
    this.saveStream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsAliasesService.attachStream(
          this.serviceName,
          this.alias.data,
          items[0],
        )
          .then(() => this.initLoaders())
          .catch(() => {
            this.CucCloudMessage.error(
              this.$translate.instant('logs_aliases_attach_stream_fail', {
                stream: items[0].title,
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
          this.alias.data,
          items[0],
        )
          .then(() => this.initLoaders())
          .catch(() => {
            this.CucCloudMessage.error(
              this.$translate.instant('logs_aliases_detach_stream_fail', {
                stream: items[0].title,
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
          this.alias.data,
          items[0],
        )
          .then(() => this.initLoaders())
          .catch(() => {
            this.CucCloudMessage.error(
              this.$translate.instant('logs_aliases_attach_index_fail', {
                index: items[0].name,
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
          this.alias.data,
          items[0],
        )
          .then(() => this.initLoaders())
          .catch(() => {
            this.CucCloudMessage.error(
              this.$translate.instant('logs_aliases_detach_index_fail', {
                index: items[0].name,
              }),
            );
            this.$q.reject();
          }),
    });
    return this.saveIndex.load();
  }

  isContentDisabled(contentType) {
    if (this.alias.data) {
      switch (contentType) {
        case this.LogsAliasesService.contentTypeEnum.STREAMS:
          return (
            this.alias.data.nbIndex > 0 ||
            (this.saveIndex && this.saveIndex.loading)
          );
        case this.LogsAliasesService.contentTypeEnum.INDICES:
          return (
            this.alias.data.nbStream > 0 ||
            (this.saveStream && this.saveStream.loading)
          );
        default:
          return false;
      }
    }
    return false;
  }
}
