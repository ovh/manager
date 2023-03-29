import controller from './snapshots.controller';
import template from './snapshots.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    createSnapshot: '<',
    createVolume: '<',
    deleteSnapshot: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    onListParamChange: '<',
    projectId: '<',
    snapshotId: '<',
    snapshots: '<',
    steins: '<',
    customerRegions: '<',
    snapshotsRegions: '<',
    getStateName: '<',
    goToRegion: '<',
    goToCreateVolumeBackup: '<',
    taskResponse: '<',
  },
};
