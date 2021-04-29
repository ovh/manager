import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    catalog: '<',
    project: '<',
    projectId: '<',
    plans: '<',
    guideUrl: '<',
    currentActiveLink: '<',
    serviceLink: '<',
    user: '<',
    userLink: '<',
  },
  template,
  controller,
};

export default component;
