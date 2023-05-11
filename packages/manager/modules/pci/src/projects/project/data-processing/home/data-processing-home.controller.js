import {
  DATA_PROCESSING_GUIDE_URL,
  DATA_PROCESSING_TRACKING_PREFIX_FULL,
} from '../data-processing.constants';

export default class DataProcessingHomeCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs-new`,
      type: 'action',
    });
    this.submitJob();
  }

  onShowJobsClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs-all`,
      type: 'action',
    });
    this.showJobs();
  }

  onAddNotebookClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::notebooks-new`,
      type: 'action',
    });
    this.addNotebook();
  }

  onShowNotebooksClick() {
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::notebooks-all`,
      type: 'action',
    });
    this.showNotebooks();
  }
}
