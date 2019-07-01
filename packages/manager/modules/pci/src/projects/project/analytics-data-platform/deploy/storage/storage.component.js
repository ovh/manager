import controller from './storage.controller';
import template from './storage.html';

export default {
  template,
  controller,
  bindings: {
    edgeNodeStorage: '<',
    nodesConfig: '<',
    selectedCapability: '<',
    storage: '<',
    onDataChange: '&',
  },
};
