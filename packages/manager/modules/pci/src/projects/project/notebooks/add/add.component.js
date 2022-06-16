import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    storageAddObjectLink: '<',
    goToNotebooks: '<',
    createObjectStorage: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    onNotebookAdd: '<',
    trackNotebooks: '<',
    trackClick: '<',
    editors: '<',
    frameworks: '<',
    regions: '<',
    flavors: '<',
    storages: '<',
    prices: '<',
  },
  controller,
  template,
};
