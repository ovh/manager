import controller from './blocks.controller';
import template from './blocks.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    addStorage: '<',
    editStorage: '<',
    attachStorage: '<',
    detachStorage: '<',
    createSnapshot: '<',
    deleteStorage: '<',
  },
};
