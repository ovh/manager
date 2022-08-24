import controller from './zfs-options.controller';
import template from './zfs-options.template.html';

export default {
  bindings: {
    close: '<',
    partition: '<',
    partitionApiUrl: '<',
    recordsizeEnum: '<',
    syncEnum: '<',
    trackClick: '<',
  },
  controller,
  template,
};
