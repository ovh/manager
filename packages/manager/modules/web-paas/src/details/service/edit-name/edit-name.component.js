import controller from './edit-name.controller';
import template from './edit-name.html';

const component = {
  bindings: {
    project: '<',
    projectId: '<',
    goBack: '<',
  },
  template,
  controller,
};

export default component;
