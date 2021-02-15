import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectName: '<',
    projectId: '<',
    goBack: '<',
  },
  template,
  controller,
};

export default component;
