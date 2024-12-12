import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    handleSuccess: '<',
    nodeId: '<',
    poweroffNode: '<',
    userSubsidiary: '<',
  },
  template,
  controller,
};
