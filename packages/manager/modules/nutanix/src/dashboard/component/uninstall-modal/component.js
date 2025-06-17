import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    handleSuccess: '<',
    handleError: '<',
    commercialRange: '<',
    uninstallNode: '<',
    userSubsidiary: '<',
  },
  template,
  controller,
};
