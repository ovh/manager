import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    project: '<',
    projectId: '<',
    guideUrl: '<',
    currentActiveLink: '<',
    serviceLink: '<',
    userLink: '<',
  },
  template,
  controller,
};

export default component;
