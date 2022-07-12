import controller from './edit-name.controller';
import template from './edit-name.template.html';

export default {
  bindings: {
    close: '<',
    partition: '<',
    partitionApiUrl: '<',
    partitionNames: '<',
  },
  controller,
  template,
};
