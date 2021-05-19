import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    notebook: '<',
    projectId: '<',
    trackNotebooks: '<',
  },
  controller,
  template,
};
