import { DATA_PROCESSING_NOTEBOOKS_STATUSES } from '../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(dataProcessingService, ovhManagerRegionService, atInternet) {
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
  }

  /**
   * Whether current job is in a (pre-)running state
   * @return {boolean} true if job is Submitted, Pending, Running
   */
  isNotebookRunning() {
    return [
      DATA_PROCESSING_NOTEBOOKS_STATUSES.STARTING,
      DATA_PROCESSING_NOTEBOOKS_STATUSES.RUNNING,
    ].includes(this.notebook.status.state);
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
