import moment from 'moment';
import { formatLogsDate } from './job-logs.utils';
import { DATA_PROCESSING_ENDED_JOBS } from '../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $timeout,
    $uibModal,
    CucCloudMessage,
    dataProcessingJobLogsService,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.dataProcessingJobLogsService = dataProcessingJobLogsService;
    this.logger = dataProcessingJobLogsService;
    this.formatLogsDate = formatLogsDate;
    this.moment = moment;
    // let's do some binding
    this.downloadLogs = this.downloadLogs.bind(this);
    this.isDownloadButtonDisabled = false;
  }

  $onInit() {
    this.logger.startLogsPolling(this.projectId, this.job.id, 5000, true);
  }

  $onDestroy() {
    this.logger.stopLogsPolling();
  }

  isJobTerminated() {
    return DATA_PROCESSING_ENDED_JOBS.includes(this.job.status.toUpperCase());
  }

  downloadLogs() {
    const re = /https:\/\/storage\.[a-z0-9]+\.cloud.ovh.net\/v1\/AUTH_[a-z0-9]+\/(.*)\/(.*)/;
    const logsUrl = this.logger.logs.logsAddress;
    if (logsUrl) {
      const matches = logsUrl.match(re);
      this.logger.downloadObject(
        this.projectId,
        this.job.region,
        matches[1],
        matches[2],
      );
      this.isDownloadButtonDisabled = true;
      this.$timeout(() => {
        this.isDownloadButtonDisabled = false;
        this.$scope.$apply();
      }, 3000);
    }
  }
}
