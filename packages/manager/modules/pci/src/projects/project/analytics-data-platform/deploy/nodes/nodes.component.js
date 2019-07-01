import controller from './nodes.controller';
import template from './nodes.html';

export default {
  template,
  controller,
  bindings: {
    minimumNodesRequired: '<',
    maximumNodesRequired: '<',
    nodesConfig: '<',
    publicCloud: '<',
    quota: '<',
    selectedCapability: '<',
    selectedRegion: '<',
  },
};
