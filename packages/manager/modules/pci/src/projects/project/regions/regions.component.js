import controller from './regions.controller';
import template from './regions.html';

export default {
  bindings: {
    availableRegions: '<',
    projectId: '<',
    regions: '<',
  },
  controller,
  template,
};
