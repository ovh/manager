import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    projectName: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
