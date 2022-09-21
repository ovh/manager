import template from './data-processing-notebooks.html';
import controller from './data-processing-notebooks.controller';

export default {
  template,
  controller,
  bindings: {
    pciFeatureRedirect: '<',
    notebooks: '<',
    addNotebook: '<',
    showNotebook: '<',
    showNotebooks: '<',
    projectId: '<',
    terminateNotebook: '<',
    deleteNotebook: '<',
    getPricesFromCatalog: '<',
    notebookId: '<',
    onListParamChange: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
};
