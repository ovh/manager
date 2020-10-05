export default class LogsStreamsFollowCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    CucControllerHelper,
    CucUrlHelper,
    CucCloudMessage,
    LogsStreamsService,
    LogsStreamsFollowService,
    LogsConstants,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucUrlHelper = CucUrlHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsStreamsFollowService = LogsStreamsFollowService;
    this.LogsConstants = LogsConstants;

    this.initLoaders();

    $scope.$on('$destroy', () => {
      this.closeConnection();
    });
  }

  initLoaders() {
    this.stream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getAapiStream(
          this.$stateParams.serviceName,
          this.$stateParams.streamId,
        ).then((stream) => {
          this.LogsStreamsFollowService.openConnection(stream);
          return stream;
        }),
    });
    this.stream.load();

    this.testClientUrls = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsFollowService.getTestClientUrls(
          this.$stateParams.serviceName,
        ).then((serviceInfo) => {
          this.rfc5424Url = this.CucUrlHelper.constructor.findUrl(
            serviceInfo,
            this.LogsConstants.RFC_URL,
            false,
          );
          this.ltsvUrl = this.CucUrlHelper.constructor.findUrl(
            serviceInfo,
            this.LogsConstants.LTSV_URL,
            false,
          );
          this.gelfUrl = this.CucUrlHelper.constructor.findUrl(
            serviceInfo,
            this.LogsConstants.GELF_URL,
            false,
          );
        }),
    });
    this.testClientUrls.load();
  }

  getMessages() {
    return this.LogsStreamsFollowService.getMessages();
  }

  getAlertType(level) {
    return this.LogsStreamsFollowService.getAlertType(level);
  }

  getAlertLabel(level) {
    return this.LogsStreamsFollowService.getAlertLabel(level);
  }

  closeConnection() {
    this.CucCloudMessage.flushChildMessage();
    this.LogsStreamsFollowService.closeConnection();
  }

  openConnection() {
    this.CucCloudMessage.flushChildMessage();
    this.LogsStreamsFollowService.openConnection(this.stream.data);
  }

  isConnectionClosed() {
    return this.LogsStreamsFollowService.isConnectionClosed();
  }

  isWaitingForMessages() {
    return this.LogsStreamsFollowService.isWaitingForMessages();
  }

  copyAddress() {
    this.CucCloudMessage.flushChildMessage();
    this.LogsStreamsFollowService.copyWebSocketAddress(this.stream.data);
  }

  testFlow(type) {
    switch (type) {
      case this.LogsStreamsFollowService.testTypeEnum.GELF:
        this.LogsStreamsFollowService.copyGELCommandLine(
          this.stream.data,
          this.gelfUrl,
        );
        break;
      case this.LogsStreamsFollowService.testTypeEnum.LTSV:
        this.LogsStreamsFollowService.copyLTSVCommandLine(
          this.stream.data,
          this.ltsvUrl,
        );
        break;
      case this.LogsStreamsFollowService.testTypeEnum.RFC5424:
        this.LogsStreamsFollowService.copyRFCCommandLine(
          this.stream.data,
          this.rfc5424Url,
        );
        break;
      default:
        break;
    }
  }

  getLastEvent() {
    return this.LogsStreamsFollowService.getLastEvent();
  }

  getTotalMessages() {
    return this.LogsStreamsFollowService.getTotalMessages();
  }
}
