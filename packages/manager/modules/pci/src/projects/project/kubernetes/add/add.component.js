import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    antiAffinityMaxNodes: '<',
    highestVersion: '<',
    goBack: '<',
    projectId: '<',
    quotas: '<',
    regions: '<',
    versions: '<',
  },
  controller,
  template,
};
