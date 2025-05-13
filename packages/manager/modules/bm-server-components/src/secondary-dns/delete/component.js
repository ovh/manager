import controller from './secondary-dns-delete.controller';
import template from './secondary-dns-delete.template.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
    domain: '<',
  },
  controller,
  template,
};
