import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    cluster: '<',
    nodes: '<',
    powerOnNode: '<',
    goToAddNode: '<',
    powerOffNode: '<',
    installNode: '<',
    reinstallNode: '<',
    uninstallNode: '<',
    terminateNode: '<',
    handleSuccess: '<',
    handleError: '<',
  },
  controller,
  template,
};
