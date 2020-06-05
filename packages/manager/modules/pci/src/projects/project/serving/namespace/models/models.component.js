import controller from './models.controller';
import template from './models.html';

export default {
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
    details: '<',
    modelLink: '<',
  },
  template,
  controller,
};
