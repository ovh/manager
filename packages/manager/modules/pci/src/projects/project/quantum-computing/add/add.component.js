import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    storageAddObjectLink: '<',
    goToQuantumComputing: '<',
    createObjectStorage: '<',
    guideUrl: '<',
    onNotebookAdd: '<',
    trackQuantumComputing: '<',
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
