import controller from './credentials.controller';
import template from './credentials.html';

const component = {
  template,
  controller,
  bindings: {
    confirmationRequired: '<',
    goBack: '<',
    goToList: '<',
    projectId: '<',
    registry: '<',
    trackClick: '<',
  },
};

export default component;
