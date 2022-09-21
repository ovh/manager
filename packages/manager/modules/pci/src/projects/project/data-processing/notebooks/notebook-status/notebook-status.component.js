import controller from './notebook-status.controller';
import template from './notebook-status.html';

export default {
  template,
  controller,
  bindings: {
    status: '<',
  },
};
