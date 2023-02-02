import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    credentials: '<',
    goBack: '<',
    projectId: '<',
    user: '<',
    userId: '<',
    trackPage: '<',
    trackClick: '<',
  },
  controller,
  template,
};

export default component;
