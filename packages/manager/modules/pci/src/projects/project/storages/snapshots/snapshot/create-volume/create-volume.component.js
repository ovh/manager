import controller from './create-volume.controller';
import template from './create-volume.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    snapshotId: '<',
    snapshot: '<',
    catalogEndpoint: '<',
    goBack: '<',
  },
};
