import controller from './download-rclone.controller';
import template from './download-rclone.html';

export default {
  controller,
  template,
  bindings: {
    userId: '<',
    user: '<',
    regions: '<',
    rcloneGuide: '<',
    goBack: '<',
    file: '<',
    downloadRCloneConfig: '<',
    checkGlobalRegionCallBack: '<',
    storageS3Regions: '<',
    trackPage: '<',
    trackClick: '<',
  },
};
