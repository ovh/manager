import template from './create-user.html';
import controller from './create-user.controller';

const component = {
  bindings: {
    goBack: '<',
    trackingPrefix: '<',
    projectId: '<',
    aiRoles: '<',
  },
  template,
  controller,
};

export default component;
