import controller from './delete-token.controller';
import template from './delete-token.html';

const component = {
  bindings: {
    goBack: '<',
    trackingPrefix: '<',
    projectId: '<',
    token: '<',
  },
  template,
  controller,
};

export default component;
