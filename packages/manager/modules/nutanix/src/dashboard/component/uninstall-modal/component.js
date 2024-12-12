import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    handleSuccess: '<',
    handleError: '<',
    nodeId: '<',
    uninstallNode: '<',
    userSubsidiary: '<',
  },
  template,
  controller,
};
