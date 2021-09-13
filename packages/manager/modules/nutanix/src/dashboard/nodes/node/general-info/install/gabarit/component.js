import template from './template.html';

export default {
  bindings: {
    server: '<',
    user: '<',
    goBack: '<',
    installSource: '<',
    installProgressHref: '<',
    handleError: '<',
    handleSuccess: '<',
  },
  template,
};
