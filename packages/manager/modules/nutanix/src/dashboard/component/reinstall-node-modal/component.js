import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    availableVersions: '<',
    reinstallNode: '<',
    handleSuccess: '<',
    handleError: '<',
  },
  template,
  controller,
};
