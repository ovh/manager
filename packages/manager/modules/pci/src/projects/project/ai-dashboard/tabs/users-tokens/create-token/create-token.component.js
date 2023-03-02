import template from './create-token.html';
import controller from './create-token.controller';

const component = {
  bindings: {
    trackingPrefix: '<',
    goBack: '<',
    projectId: '<',
    aiRoles: '<',
    regions: '<',
  },
  template,
  controller,
};

export default component;
