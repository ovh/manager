import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    ip: '<',
    user: '<',
    setAction: '&',
  },
  controller,
  template,
};
