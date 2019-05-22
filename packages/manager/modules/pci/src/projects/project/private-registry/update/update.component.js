import controller from './update.controller';
import template from './update.html';

const component = {
  template,
  controller,
  bindings: {
    goBack: '<',
    fromState: '@',
  },
};

export default component;
