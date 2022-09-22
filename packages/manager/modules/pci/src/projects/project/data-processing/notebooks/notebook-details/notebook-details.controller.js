import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_STATUSES,
} from '../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $timeout,
    $window,
    CucCloudMessage,
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$window = $window;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
    this.atInternet = atInternet;
  }

  /**
   * Whether current job is in a (pre-)running state
   * @return {boolean} true if job is Submitted, Pending, Running
   */
  isNotebookRunning() {
    return [
      DATA_PROCESSING_STATUSES.PENDING,
      DATA_PROCESSING_STATUSES.RUNNING,
      DATA_PROCESSING_STATUSES.SUBMITTED,
    ].includes(this.notebook.status);
  }

  // eslint-disable-next-line class-methods-use-this
  formatDateToCalendar(dt) {
    // this method needs to use current instance of moment, so it cannot static
    return moment(dt).calendar();
  }

  onNotebookStopClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::job-details::dashboard::kill-job',
      type: 'action',
    });
    this.terminateNotebook();
  }
}
