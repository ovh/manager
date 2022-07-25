import controller from './edit-name.controller';
import template from './edit-name.template.html';

export default {
  bindings: {
    close: '<',
    nasha: '<',
    nashaApiUrl: '<',
  },
  controller,
  template,
};
