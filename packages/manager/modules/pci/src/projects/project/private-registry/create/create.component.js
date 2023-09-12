import controller from './create.controller';
import template from './create.html';

const component = {
  template,
  controller,
  bindings: {
    availableRegions: '<',
    getCredentialsState: '<',
    goBack: '<',
    plans: '<',
    projectId: '<',
    trackClick: '<',
    user: '<',
  },
};

export default component;
