import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    nodeId: '<',
    server: '<',
    user: '<',
    technicalDetails: '<',
    goToNameEdit: '<',
    goToNetboot: '<',
    goToNutanixNode: '<',
    goToOsInstallProgress: '<',
    goToOsInstallChooseSource: '<',
  },
  controller,
  template,
};
