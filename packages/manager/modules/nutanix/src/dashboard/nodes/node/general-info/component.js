import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    nodeId: '<',
    server: '<',
    user: '<',
    bandwidthInformations: '<',
    specifications: '<',
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
