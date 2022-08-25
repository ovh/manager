import controller from './edit-size.controller';
import template from './edit-size.template.html';

export default {
  bindings: {
    close: '<',
    nasha: '<',
    partition: '<',
    partitionAllocatedSize: '<',
    partitionApiUrl: '<',
    taskApiUrl: '<',
    trackClick: '<',
  },
  controller,
  template,
};
