import controller from './update.controller';
import template from './update.html';

const component = {
  template,
  controller,
  bindings: {
    goBack: '<',
    projectId: '<',
    trackClick: '<',
  },
};

export default component;
