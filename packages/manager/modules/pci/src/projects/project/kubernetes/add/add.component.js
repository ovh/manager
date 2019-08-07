import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    highestVersion: '<',
    goBack: '<',
    projectId: '<',
    regions: '<',
    versions: '<',
  },
  controller,
  template,
};
