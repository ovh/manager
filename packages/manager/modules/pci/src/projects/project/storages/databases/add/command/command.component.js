import controller from './command.controller';
import template from './command.html';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    data: '<',
    user: '<',
  },
  template,
  controller,
};

export default component;
