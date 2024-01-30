import controller from './datacenters.controller';
import template from './datacenters.html';

export default {
  bindings: {
    addDatacenter: '<',
    dedicatedCloud: '<',
    goToDatacenter: '<',
    trackClick: '<',
    orderDatastore: '<',
    orderHost: '<',
    setMessage: '<',
    usesLegacyOrder: '<',
    migrationBannerAvailable: '<',
    addVdcAvailable: '<',
  },
  controller,
  template,
};
