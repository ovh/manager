import controller from './error.controller';
import template from './error.html';

export default {
  bindings: {
    cancelLabel: '<',
    cancelLink: '<',
    error: '<',
    image: '<',
    message: '<',
    submitAction: '<',
    submitLink: '<',
    submitLabel: '<',
  },
  controller,
  template,
};
