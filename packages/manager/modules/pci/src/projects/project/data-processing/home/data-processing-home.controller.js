import { DATA_PROCESSING_GUIDE_URL } from '../data-processing.constants';

export default class DataProcessingHomeCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::data-processing::jobs-new',
      type: 'action',
    });
    this.submitJob();
  }

  onShowJobsClick() {
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::data-processing::jobs-all',
      type: 'action',
    });
    this.showJobs();
  }

  onAddNotebookClick() {
    this.atInternet.trackClick({
      name:
        'PublicCloud::pci::projects::project::data-processing::notebooks-new',
      type: 'action',
    });
    this.addNotebook();
  }

  onShowNotebooksClick() {
    this.atInternet.trackClick({
      name:
        'PublicCloud::pci::projects::project::data-processing::notebooks-all',
      type: 'action',
    });
    this.showNotebooks();
  }
}
