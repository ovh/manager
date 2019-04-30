import controller from './edit.controller';
import template from './edit.html';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    instanceId: '<',
    instance: '<',
    goBack: '<',
  },
};
