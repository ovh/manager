import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    regions: '<',
    goBack: '<',
    projectId: '<',
    goToRegistries: '<',
  },
  template,
  controller,
};

export default component;
