import template from './members.html';
import controller from './members.controller';

export default {
  template,
  controller,
  bindings: {
    api: '=',
  },
};
