import controller from './credentials.controller';
import template from './credentials.html';

const component = {
  template,
  controller,
  bindings: {
    goBack: '<',
    registry: '<',
    projectId: '<',
    goToList: '<',
    confirmationRequired: '<',
  },
};

export default component;
