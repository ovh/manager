export default class LogsStreamsFollowCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    LogsStreamsService,
    LogsStreamsFollowService,
    LogsConstants,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.streamId = this.$stateParams.streamId;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
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
        this.LogsStreamsService.getStream(this.serviceName, this.streamId).then(
          (stream) => {
            this.LogsStreamsFollowService.openConnection(
              this.serviceName,
              stream,
            );
            return stream;
          },
        ),
    });
    this.stream.load();

    this.testClientUrls = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsFollowService.getTestClientUrls(this.serviceName).then(
          (serviceInfo) => {
            this.rfc5424Url = serviceInfo.rfc5424Url;
            this.ltsvUrl = serviceInfo.ltsvUrl;
            this.gelfUrl = serviceInfo.gelfUrl;
            return serviceInfo;
          },
        ),
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
    this.LogsStreamsFollowService.openConnection(this.serviceName, this.stream);
  }

  isConnectionClosed() {
    return this.LogsStreamsFollowService.isConnectionClosed();
  }

  isWaitingForMessages() {
    return this.LogsStreamsFollowService.isWaitingForMessages();
  }

  copyAddress() {
    this.CucCloudMessage.flushChildMessage();
    this.LogsStreamsFollowService.copyWebSocketAddress(
      this.serviceName,
      this.stream.data,
    );
  }

  testFlow(type) {
    switch (type) {
      case this.LogsStreamsFollowService.testTypeEnum.GELF:
        this.LogsStreamsFollowService.copyGELCommandLine(
          this.serviceName,
          this.stream.data,
          this.gelfUrl,
        );
        break;
      case this.LogsStreamsFollowService.testTypeEnum.LTSV:
        this.LogsStreamsFollowService.copyLTSVCommandLine(
          this.serviceName,
          this.stream.data,
          this.ltsvUrl,
        );
        break;
      case this.LogsStreamsFollowService.testTypeEnum.RFC5424:
        this.LogsStreamsFollowService.copyRFCCommandLine(
          this.serviceName,
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
