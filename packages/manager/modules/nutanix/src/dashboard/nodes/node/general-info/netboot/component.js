import template from './template.html';

export default {
  bindings: {
    server: '<',
    serviceName: '<',
    goBack: '<',
    handleError: '<',
    handleSuccess: '<',
  },
  template,
};
