import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    publicBandwidthOrderLink: '<',
    server: '<',
    existingBandwidth: '<',
  },
  controller,
  template,
};
