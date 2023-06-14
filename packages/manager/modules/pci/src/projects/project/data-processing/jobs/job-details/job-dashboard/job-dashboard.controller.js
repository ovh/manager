import { find } from 'lodash';
import {
  formatDuration,
  getDataProcessingUiUrl,
} from '../../../data-processing.utils';
import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_STATUSES,
  JOB_REFRESH_INTERVAL,
  JOB_TYPE_JAVA,
  JOB_TYPE_PYTHON,
  DATA_PROCESSING_TRACKING_PREFIX_FULL,
} from '../../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $timeout,
    $window,
    CucCloudMessage,
    dataProcessingService,
    ovhManagerRegionService,
    PciStoragesContainersService,
    atInternet,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$window = $window;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
    this.JOB_TYPE_JAVA = JOB_TYPE_JAVA;
    this.JOB_TYPE_PYTHON = JOB_TYPE_PYTHON;
    this.getDataProcessingUiUrl = getDataProcessingUiUrl;
    this.containerService = PciStoragesContainersService;
    this.atInternet = atInternet;
    this.containerId = null;
    this.pollTimer = null;
    this.formatDuration = formatDuration;
  }

  $onInit() {
    // retrieve container id for the job
    this.containerService.getAll(this.projectId).then((containers) => {
      const container = find(
        containers,
        (c) => c.name === this.job.containerName,
      );
      if (container) {
        this.containerId = container.id;
      }
    });
    // start job retrieval
    this.pollData();
  }

  $onDestroy() {
    if (this.pollTimer !== null) {
      this.$timeout.cancel(this.pollTimer);
    }
  }

  /**
   * Query job from OVH backend
   * If job is still running, we query each JOB_REFRESH_INTERVAL to update charts
   */
  pollData() {
    this.queryJob();
    if (!this.job.endDate) {
      this.pollTimer = this.$timeout(
        () => this.pollData(),
        JOB_REFRESH_INTERVAL,
      );
    }
  }

  /**
   * Compute start date and end dates for charts depending on job status.
   * If job is running, we plot the last 5 minutes.
   * If job is not running any more, we plot the last 5 minutes before the end of job
   * @return {{endDate: moment.Moment, startDate: moment.Moment}}
   */
  computeDates() {
    let startDate;
    let endDate;
    if (this.isJobRunning()) {
      startDate = moment().subtract(5, 'minutes');
      endDate = moment();
    } else {
      startDate = moment(this.job.endDate).subtract(5, 'minutes');
      endDate = moment(this.job.endDate);
    }
    return {
      startDate,
      endDate,
    };
  }

  queryJob() {
    this.dataProcessingService
      .getJob(this.projectId, this.job.id)
      .then((job) => {
        this.job = job;
      });
  }

  /**
   * Whether current job is in a (pre-)running state
   * @return {boolean} true if job is Submitted, Pending, Running
   */
  isJobRunning() {
    return [
      DATA_PROCESSING_STATUSES.PENDING,
      DATA_PROCESSING_STATUSES.RUNNING,
      DATA_PROCESSING_STATUSES.SUBMITTED,
    ].includes(this.job.status);
  }

  isJobPending() {
    return [
      DATA_PROCESSING_STATUSES.PENDING,
      DATA_PROCESSING_STATUSES.SUBMITTED,
    ].includes(this.job.status);
  }

  isNotebookDeleted() {
    return !find(this.notebooks, (notebook) => {
      return notebook.id === this.job.notebook;
    });
  }

  onSparkUIClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::job-details::dashboard::job-user-interface`,
      type: 'action',
    });
    this.$window.open(
      getDataProcessingUiUrl(this.job.region, this.job.id),
      '_blank',
    );
  }

  onObjectContainerClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::job-details::dashboard::object-container`,
      type: 'action',
    });
    this.browseObjectStorage(this.containerId);
  }

  onBillingConsoleClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::job-details::dashboard::billing-console`,
      type: 'action',
    });
    this.showBillingConsole();
  }

  onTerminateClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::job-details::dashboard::kill-job`,
      type: 'action',
    });
    this.terminateJob();
  }
}
