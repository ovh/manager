import controller from './secondary-dns-add.controller';
import template from './secondary-dns-add.template.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
  },
  controller,
  template,
};
