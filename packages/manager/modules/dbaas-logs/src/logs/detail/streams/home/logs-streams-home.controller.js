import find from 'lodash/find';
import datagridToIcebergFilter from '../../logs-iceberg.utils';

export default class LogsStreamsHomeCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $state,
    $stateParams,
    $translate,
    $window,
    ouiDatagridService,
    LogsConstants,
    LogsStreamsService,
    LogsHomeService,
    CucControllerHelper,
    CucCloudMessage,
    CucUrlHelper,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.ouiDatagridService = ouiDatagridService;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsConstants = LogsConstants;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsHomeService = LogsHomeService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.CucUrlHelper = CucUrlHelper;
    this.retentions = [];
    this.bytes = $filter('bytes');
    this.initLoaders();
  }

  /**
   * initializes streams object by making API call to get data
   *
   * @memberof LogsStreamsHomeCtrl
   */
  initLoaders() {
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.getAccountDetails(this.serviceName),
    });
    this.runLoaders().then(() => {
      this.loadRetentions();
    });
  }

  runLoaders() {
    return this.$q.all([this.accountDetails.load()]);
  }

  loadStreams({ offset, pageSize, sort, criteria }) {
    const filters = criteria.map((c) => {
      const name = c.property || 'title';
      return datagridToIcebergFilter(name, c.operator, c.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsStreamsService.getPaginatedStreams(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  /**
   * navigates to add stream page
   *
   * @memberof LogsStreamsHomeCtrl
   */
  add() {
    this.$state.go('dbaas-logs.detail.streams.add', {
      serviceName: this.serviceName,
    });
  }

  /**
   * create stream
   *
   * @memberof LogsStreamsHomeCtrl
   */
  create() {
    this.LogsStreamsService.createStream(this.serviceName).then(() =>
      this.initLoaders(),
    );
  }

  /**
   * navigates to edit stream page
   *
   * @param {any} stream
   * @memberof LogsStreamsHomeCtrl
   */
  edit(stream) {
    this.$state.go('dbaas-logs.detail.streams.stream.edit', {
      serviceName: this.serviceName,
      streamId: stream.streamId,
    });
  }

  /**
   * show delete stream confirmation modal
   *
   * @param {any} stream to delete
   * @memberof LogsStreamsHomeCtrl
   */
  showDeleteConfirm(stream) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('logs_stream_delete_title'),
        textHtml: this.$translate.instant('logs_stream_delete_message', {
          stream: stream.title,
        }),
      })
      .then(() => this.remove(stream));
  }

  /**
   * delete stream
   *
   * @param {any} stream to delete
   * @memberof LogsStreamsHomeCtrl
   */
  remove(stream) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.deleteStream(this.serviceName, stream)
          .then(() => this.initLoaders())
          .finally(() => {
            this.ouiDatagridService.refresh('streams-datagrid', true);
            this.CucControllerHelper.scrollPageToTop();
          }),
    });
    this.delete.load();
  }

  /**
   * navigates to the alerts page
   *
   * @param {any} stream, stream for which alerts should be managed
   * @memberof LogsStreamsHomeCtrl
   */
  manageAlerts(stream) {
    this.CucCloudMessage.flushChildMessage();
    this.$state.go('dbaas-logs.detail.streams.stream.alerts', {
      serviceName: this.serviceName,
      streamId: stream.streamId,
    });
  }

  loadRetentions() {
    this.LogsStreamsService.getRetentions(this.serviceName).then(
      (retentions) => {
        this.retentions = retentions;
      },
    );
  }

  findRetention(stream) {
    return find(
      this.retentions,
      (retention) => retention.retentionId === stream.retentionId,
    );
  }

  retentionInfo(stream) {
    const foundRetention = this.findRetention(stream);
    if (foundRetention?.duration) {
      if (
        foundRetention.duration === this.LogsConstants.RETENTION.FORTY_FIVE_DAYS
      ) {
        // moment convert 45 days to a month and we need to be accurate here
        return this.$translate.instant('streams_45_days');
      }
      return moment.duration(foundRetention.duration).humanize();
    }
    return this.$translate.instant('streams_disk_full');
  }

  /**
   * navigates to the alerts page
   *
   * @param {any} stream, stream for which alerts should be managed
   * @memberof LogsStreamsHomeCtrl
   */
  gotoArchives(stream) {
    this.CucCloudMessage.flushChildMessage();
    this.$state.go('dbaas-logs.detail.streams.stream.archives', {
      serviceName: this.serviceName,
      streamId: stream.streamId,
    });
  }

  /**
   * navigates to follow live stream page
   *
   * @param {any} stream, stream to follow live
   * @memberof LogsStreamsHomeCtrl
   */
  followLive(stream) {
    this.CucCloudMessage.flushChildMessage();
    this.$state.go('dbaas-logs.detail.streams.stream.follow', {
      serviceName: this.serviceName,
      streamId: stream.streamId,
    });
  }

  /**
   * extracts graylog web URL from stream
   *
   * @param {any} stream, stream for which URL needs to be extracted
   * @return {string} graylog url
   * @memberof LogsStreamsHomeCtrl
   */
  openGrayLog(stream) {
    this.LogsStreamsService.getStreamGraylogUrl(this.serviceName, stream).then(
      (url) => {
        this.$window.open(url, '_blank');
      },
    );
  }

  copyToken(stream) {
    this.LogsStreamsService.copyStreamToken(this.serviceName, stream).then(
      () => {
        this.CucControllerHelper.scrollPageToTop();
      },
    );
  }
}
