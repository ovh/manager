import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    nodeId: '<',
    goBack: '<',
    server: '<',
    handleSuccess: '<',
  },
  controller,
  template,
};
