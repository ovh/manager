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
    PciStoragesContainersService,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.dataProcessingJobLogsService = dataProcessingJobLogsService;
    this.PciStoragesContainersService = PciStoragesContainersService;
    this.logger = dataProcessingJobLogsService;
    this.formatLogsDate = formatLogsDate;
    this.moment = moment;
    // let's do some binding
    this.downloadLogs = this.downloadLogs.bind(this);
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
    // Get all the object storages available
    return this.PciStoragesContainersService.getAll(this.projectId, false).then(
      (containers) => {
        // The logs are stored inside the 'odp-logs' storage so we're looking for this one
        const container = containers.find(
          (storage) => storage.name === 'odp-logs',
        );
        // If we find it, we get the id and redirect to the object storage page
        if (container) {
          return this.redirectToObjectStorage(this.projectId, container.id);
        }
        return null;
      },
    );
  }
}
