import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    project: '<',
    projectId: '<',
    currentActiveLink: '<',
    serviceLink: '<',
  },
  template,
  controller,
};

export default component;
