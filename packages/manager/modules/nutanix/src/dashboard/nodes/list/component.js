import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    cluster: '<',
    nodes: '<',
    goToAddNode: '<',
    powerOnNode: '<',
    powerOffNode: '<',
    installNode: '<',
    reinstallNode: '<',
    uninstallNode: '<',
    terminateNode: '<',
  },
  controller,
  template,
};
