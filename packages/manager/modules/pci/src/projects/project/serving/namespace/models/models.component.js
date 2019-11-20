import controller from './models.controller';
import template from './models.html';

const component = {
  bindings: {
    addModel: '<',
    namespaces: '<',
    deleteModel: '<',
    generateToken: '<',
    updateModel: '<',
    namespaceId: '<',
    models: '<',
    projectId: '<',
    project: '<',
  },
  template,
  controller,
};

export default component;
