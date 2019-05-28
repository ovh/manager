import controller from './update.controller';
import template from './update.html';

const component = {
  template,
  controller,
  bindings: {
    goBack: '<',
    projectId: '<',
  },
};

export default component;
