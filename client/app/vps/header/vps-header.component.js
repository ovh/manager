import controller from './vps-header.controller';
import template from './vps-header.html';

export default {
  bindings: {
    capabilities: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerVpsHeader',
  template,
};
