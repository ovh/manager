import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToAddStorage: '<',
    goToRemoveStorage: '<',
    serviceName: '<',
    storageUsage: '<',
    storageVolumes: '<',
  },
  controller,
  template,
};
