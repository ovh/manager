import controller from './blocks.controller';
import template from './blocks.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    addStorage: '<',
    attachStorage: '<',
    createSnapshot: '<',
    deleteStorage: '<',
    detachStorage: '<',
    editStorage: '<',
    guideUrl: '<',
    help: '<',
    instanceLink: '<',
    onListParamChange: '<',
    projectId: '<',
    storageId: '<',
    storages: '<',
    steins: '<',
    customerRegions: '<',
    storagesRegions: '<',
    getStateName: '<',
    goToRegion: '<',
  },
};
