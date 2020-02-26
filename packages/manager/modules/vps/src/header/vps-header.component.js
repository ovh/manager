import controller from './vps-header.controller';
import template from './vps-header.html';

export default {
  bindings: {
    capabilities: '<',
    hasCloudDatabaseFeature: '<',
    serviceName: '<',
    vps: '<',
  },
  controller,
  name: 'ovhManagerVpsHeader',
  template,
};
