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
    help: '<',
    instanceLink: '<',
    onListParamChange: '<',
    projectId: '<',
    storageId: '<',
    storages: '<',
  },
};
