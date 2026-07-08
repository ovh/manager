import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    cluster: '<',
    goBack: '<',
    goToConfirmRedeploy: '<',
    nodes: '<',
    packType: '<',
    serviceName: '<',
  },
  template,
  controller,
};
