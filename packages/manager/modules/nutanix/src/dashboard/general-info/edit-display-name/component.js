import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    displayName: '<',
    serviceInfo: '<',
    goBack: '<',
    handleSuccess: '<',
    handleError: '<',
  },
  template,
  controller,
};
