import moment from 'moment';
import { formatLogsDate } from './job-logs.utils';
import { DATA_PROCESSING_ENDED_JOBS } from '../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $timeout,
    dataProcessingJobLogsService,
    PciStoragesContainersService,
    $window,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.dataProcessingJobLogsService = dataProcessingJobLogsService;
    this.PciStoragesContainersService = PciStoragesContainersService;
    this.logger = dataProcessingJobLogsService;
    this.formatLogsDate = formatLogsDate;
    this.moment = moment;
    this.$window = $window;
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

  downloadObject(object) {
    this.PciStoragesContainersService.downloadObject(
      this.projectId,
      this.logContainer.id,
      object,
    ).then((url) => {
      this.$window.location = url;
    });
  }
}
