import controller from './credentials.controller';
import template from './credentials.html';

const component = {
  template,
  controller,
  bindings: {
    goBack: '<',
    getRegistry: '<',
    projectId: '<',
    goToList: '<',
  },
};

export default component;
