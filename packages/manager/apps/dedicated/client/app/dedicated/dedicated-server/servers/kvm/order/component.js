import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    user: '<',
    goBack: '<',
    serverType: '<',
  },
  controller,
  template,
};
