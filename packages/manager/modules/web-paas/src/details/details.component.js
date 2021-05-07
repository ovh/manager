import controller from './details.controller';
import template from './template.html';

const component = {
  bindings: {
    catalog: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    plans: '<',
    project: '<',
    projectId: '<',
    serviceLink: '<',
    user: '<',
    userLink: '<',
  },
  template,
  controller,
};

export default component;
