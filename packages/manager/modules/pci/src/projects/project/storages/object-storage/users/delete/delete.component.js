import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    credentials: '<',
    goBack: '<',
    projectId: '<',
    trackingPrefix: '<',
    user: '<',
    userId: '<',
  },
  controller,
  template,
};

export default component;
