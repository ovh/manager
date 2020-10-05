import keyBy from 'lodash/keyBy';

export default class LogsStreamsFollowService {
  /* @ngInject */
  constructor(
    $websocket,
    $translate,
    OvhApiDbaas,
    LogsStreamsService,
    CucControllerHelper,
    CucCloudMessage,
    CucServiceHelper,
    CucUrlHelper,
    LogsConstants,
  ) {
    this.$websocket = $websocket;
    this.$translate = $translate;
    this.LogsStreamsService = LogsStreamsService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.CucServiceHelper = CucServiceHelper;
    this.CucUrlHelper = CucUrlHelper;
    this.LogsAapiService = OvhApiDbaas.Logs().Aapi();
    this.LogsConstants = LogsConstants;

    this.testTypeEnum = keyBy([
      this.LogsConstants.GELF,
      this.LogsConstants.LTSV,
      this.LogsConstants.RFC5424,
    ]);
    this.webSocket = null;
    this.messages = [];
    this.totalMessages = 0;
    this.connectionClosed = false;
    this.waitingForMessages = true;
    this.lastEvent = 0;

    this.initializeData();
  }

  initializeData() {
    this.alertTypeLabelMap = {
      0: {
        label: 'logs_streams_follow_emergency',
        type: 'error',
      },
      1: {
        label: 'logs_streams_follow_alert',
        type: 'error',
      },
      2: {
        label: 'logs_streams_follow_critical',
        type: 'error',
      },
      3: {
        label: 'logs_streams_follow_error',
        type: 'warning',
      },
      4: {
        label: 'logs_streams_follow_warning',
        type: 'warning',
      },
      5: {
        label: 'logs_streams_follow_notice',
        type: 'primary',
      },
      6: {
        label: 'logs_streams_follow_info',
        type: 'info',
      },
      7: {
        label: 'logs_streams_follow_debug',
        type: 'default',
      },
    };
  }

  /**
   * Makes API call to get LTSV, GELF and RFC client configures URL's
   * Show error on UI if failed to get data from API
   * @param {string} serviceName
   */
  getTestClientUrls(serviceName) {
    return this.LogsAapiService.home({ serviceName }).$promise.catch(
      this.CucServiceHelper.errorHandler('logs_streams_get_command_urls_error'),
    );
  }

  /**
   * Copies websocket URL for a given stream into clipboard.
   * Shows exception message on UI if failed to copy to clipboard.
   * @param {object} stream
   */
  copyWebSocketAddress(stream) {
    const url = this.CucUrlHelper.constructor.findUrl(
      stream,
      this.LogsConstants.WEB_SOCKET_URL,
    );
    if (!url) {
      this.CucCloudMessage.error(
        this.$translate.instant('logs_streams_follow_get_websocket_error', {
          stream: stream.info.title,
        }),
      );
    } else {
      const error = this.CucControllerHelper.constructor.copyToClipboard(url);
      if (error) {
        this.CucCloudMessage.error(
          this.$translate.instant('logs_streams_follow_copy_websocket_error', {
            stream: stream.info.title,
            url,
          }),
        );
      } else {
        this.CucCloudMessage.info(
          this.$translate.instant('logs_streams_follow_copy_websocket_success'),
        );
      }
    }
  }

  getTotalMessages() {
    return this.totalMessages;
  }

  getLastEvent() {
    return this.lastEvent;
  }

  getMessages() {
    return this.messages;
  }

  getAlertType(level) {
    return this.alertTypeLabelMap[level]
      ? this.alertTypeLabelMap[level].type
      : '';
  }

  getAlertLabel(level) {
    return this.alertTypeLabelMap[level]
      ? this.alertTypeLabelMap[level].label
      : '';
  }

  isConnectionClosed() {
    return this.connectionClosed;
  }

  isWaitingForMessages() {
    return this.waitingForMessages;
  }

  /**
   * Close websocket connection
   */
  closeConnection() {
    this.webSocket.close();
  }

  /**
   * Open websocket connection to given stream
   * @param {object} stream
   */
  openConnection(stream) {
    this.waitingForMessages = true;
    this.connectionClosed = false;
    this.messages = [];
    this.totalMessages = 0;
    this.connectToWebSocket(stream);
  }

  /**
   * Copies GELF client command line to clipboard. Shows status message on UI.
   * Shows error if copy failed, success otherwise.
   * @param {Object} stream
   * @param {string} gelfUrl
   */
  copyRFCCommandLine(stream, rfc5424Url) {
    const token = this.LogsStreamsService.getStreamToken(stream);
    if (token) {
      const now = new Date();
      const dateFormatted = now.toISOString();
      const command = `echo -e '<6>1 ${dateFormatted} 149.202.165.20 example.org - - [exampleSDID@8485 user_id="9001"  some_info="foo" some_metric_num="42.0" X-OVH-TOKEN="${token}"] A short RFC 5424 message that helps you identify what is going on'\\n | openssl s_client -quiet -no_ign_eof  -connect ${rfc5424Url}`;
      const error = this.CucControllerHelper.constructor.copyToClipboard(
        command,
      );
      this.handleCommandCopyStatus(
        error,
        stream,
        command,
        this.testTypeEnum.RFC5424,
      );
    }
  }

  /**
   * Copies GELF client command line to clipboard. Shows status message on UI.
   * Shows error if copy failed, success otherwise.
   * @param {Object} stream
   * @param {string} gelfUrl
   */
  copyLTSVCommandLine(stream, ltsvUrl) {
    const token = this.LogsStreamsService.getStreamToken(stream);
    if (token) {
      const now = new Date();
      const dateFormatted = now.toISOString();
      const command = `echo -e 'X-OVH-TOKEN:${token}\\thost:example.org\\ttime:${dateFormatted}\\tmessage:A short LTSV message that helps you identify what is going on\\tfull_message:Backtrace here more stuff\\tlevel:1\\tuser_id:9001\\tsome_info:foo\\tsome_metric_num:42.0\\0' | openssl s_client -quiet -no_ign_eof  -connect ${ltsvUrl}`;
      const error = this.CucControllerHelper.constructor.copyToClipboard(
        command,
      );
      this.handleCommandCopyStatus(
        error,
        stream,
        command,
        this.testTypeEnum.LTSV,
      );
    }
  }

  /**
   * Copies GELF client command line to clipboard. Shows status message on UI.
   * Shows error if copy failed, success otherwise.
   * @param {Object} stream
   * @param {string} gelfUrl
   */
  copyGELCommandLine(stream, gelfUrl) {
    const token = this.LogsStreamsService.getStreamToken(stream);
    if (token) {
      const now = new Date();
      const timestamp = Math.round(now.getTime() / 1000);
      const command = `echo -e '{"version":"1.1", "host": "example.org", "short_message": "A short GELF message that helps you identify what is going on", "full_message": "Backtrace here more stuff", "timestamp": ${timestamp}, "level": 1, "_user_id": 9001, "_some_info": "foo", "some_metric_num": 42.0, "_X-OVH-TOKEN":"${token}"}\\0' | openssl s_client -quiet -no_ign_eof  -connect ${gelfUrl}`;
      const error = this.CucControllerHelper.constructor.copyToClipboard(
        command,
      );
      this.handleCommandCopyStatus(
        error,
        stream,
        command,
        this.testTypeEnum.GELF,
      );
    }
  }

  handleCommandCopyStatus(error, stream, command, type) {
    if (error) {
      this.CucCloudMessage.error(
        this.$translate.instant('logs_streams_follow_copy_command_error', {
          stream: stream.info.title,
          command,
          type,
        }),
      );
    } else {
      this.CucCloudMessage.info(
        this.$translate.instant('logs_streams_follow_copy_command_success', {
          type,
        }),
      );
    }
  }

  /**
   * opens websocket connection and connects to given stream URL
   * @param {object} stream
   */
  connectToWebSocket(stream) {
    const url = this.CucUrlHelper.constructor.findUrl(
      stream,
      this.LogsConstants.WEB_SOCKET_URL,
    );
    if (url) {
      this.webSocket = this.$websocket(url);
      let response;
      let message;
      const date = new Date();
      this.lastEvent = date.getTime();
      this.webSocket.onMessage((event) => {
        this.waitingForMessages = false;
        this.totalMessages += 1;
        try {
          response = JSON.parse(event.data);
          message = JSON.parse(response.message);
        } catch (err) {
          response = { username: 'anonymous', message: event.data };
          message = {};
          this.CucServiceHelper.errorHandler(err);
        }
        this.messages.unshift({
          type: this.getAlertType(message.level),
          label: this.getAlertLabel(message.level),
          code: message.level,
          timestamp: message.timestamp * 1000,
          content: response.message,
        });
        this.lastEvent = message.timestamp * 1000;
        if (this.messages.length > 20) {
          this.messages.pop();
        }
        if (this.totalMessages === this.LogsConstants.MESSAGE_THRESHOLD) {
          this.closeConnection();
        }
      });

      this.webSocket.onError((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant('logs_streams_follow_connection_error', {
            message: err,
          }),
        );
      });

      this.webSocket.onClose(() => {
        this.connectionClosed = true;
        this.waitingForMessages = false;
      });

      this.webSocket.onOpen(() => {
        this.connectionClosed = false;
        this.waitingForMessages = true;
        this.messages = [];
        this.totalMessages = 0;
      });
    } else {
      this.CucCloudMessage.error(
        this.$translate.instant('logs_streams_follow_get_websocket_error', {
          stream: stream.info.title,
        }),
      );
    }
  }
}
