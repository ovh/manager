import controller from './vps-additional-disk.controller';
import template from './vps-additional-disk.html';

export default {
  bindings: {
    serviceName: '<',
    tabSummary: '<',
  },
  controller,
  name: 'ovhManagerVpsAdditionnalDisk',
  template,
};
