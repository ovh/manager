import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    nodeId: '<',
    goBack: '<',
    availableVersions: '<',
    reinstallNode: '<',
    handleSuccess: '<',
    handleError: '<',
  },
  template,
  controller,
};
