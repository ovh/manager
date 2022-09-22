import { DATA_PROCESSING_GUIDE_URL } from '../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name: 'public-cloud::pci::projects::project::data-processing::add-job',
      type: 'action',
    });
    this.submitJob();
  }

  onAddNotebookClick() {
    this.atInternet.trackClick({
      name: 'public-cloud::pci::projects::project::data-processing::add-job',
      type: 'action',
    });
    this.addNotebook();
  }
}
