import controller from './download-rclone.controller';
import template from './download-rclone.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userId: '<',
    user: '<',
    regions: '<',
    rcloneGuide: '<',
    goBack: '<',
    state: '<',
  },
};
