import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToAddStorage: '<',
    goToRemoveStorage: '<',
    serviceName: '<',
    storageUsage: '<',
    storageVolumes: '<',
    trackClick: '<',
    storageHitTracking: '<',
  },
  controller,
  template,
};
