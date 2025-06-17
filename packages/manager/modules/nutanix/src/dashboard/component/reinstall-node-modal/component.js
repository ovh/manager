import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    commercialRange: '<',
    goBack: '<',
    availableVersions: '<',
    reinstallNode: '<',
    handleSuccess: '<',
    handleError: '<',
  },
  template,
  controller,
};
