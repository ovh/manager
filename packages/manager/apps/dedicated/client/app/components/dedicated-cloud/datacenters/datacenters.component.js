import controller from './datacenters.controller';
import template from './datacenters.html';

export default {
  bindings: {
    addDatacenter: '<',
    dedicatedCloud: '<',
    orderDatastore: '<',
    orderHost: '<',
    setMessage: '<',
    usesLegacyOrder: '<',
  },
  controller,
  template,
};
