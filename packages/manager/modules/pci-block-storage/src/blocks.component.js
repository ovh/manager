import controller from './blocks.controller';
import template from './blocks.html';

export default {
  controller,
  template,
  bindings: {
    addStorage: '<',
    attachStorage: '<',
    createSnapshot: '<',
    deleteStorage: '<',
    detachStorage: '<',
    editStorage: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    help: '<',
    onListParamChange: '<',
    projectId: '<',
    storageId: '<',
    storages: '<',
    steins: '<',
    customerRegions: '<',
    storagesRegions: '<',
    getStateName: '<',
    goToRegion: '<',
    goToBlockStorage: '<',
    goToCreateVolumeBackup: '<',
    taskResponse: '<',
  },
};
