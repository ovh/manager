import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    customer: '<',
    goBack: '<',
    projectId: '<',
  },
  controller,
  template,
};

export default component;
