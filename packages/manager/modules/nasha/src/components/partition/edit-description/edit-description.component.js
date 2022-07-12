import controller from './edit-description.controller';
import template from './edit-description.template.html';

export default {
  bindings: {
    close: '<',
    partition: '<',
    partitionApiUrl: '<',
  },
  controller,
  template,
};
