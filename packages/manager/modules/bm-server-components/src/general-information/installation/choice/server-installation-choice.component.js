import controller from './server-installation-choice.controller';
import template from './server-installation-choice.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
  },
  controller,
  template,
};
