import controller from './view.controller';
import template from './view.html';

export default {
  bindings: {
    goBack: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
