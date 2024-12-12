import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    handleSuccess: '<',
    handleError: '<',
    nodeId: '<',
    poweroffNode: '<',
    userSubsidiary: '<',
  },
  template,
  controller,
};
