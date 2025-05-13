import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    registryId: '<',
    goToRegistries: '<',
  },
  template,
  controller,
};

export default component;
