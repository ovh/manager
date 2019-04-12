import controller from './snapshots.controller';
import template from './snapshots.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    createVolume: '<',
    createSnapshot: '<',
    deleteSnapshot: '<',
  },
};
