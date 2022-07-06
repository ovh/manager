import controller from './order.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    createInstanceUrl: '<',
    defaults: '<',
    goBack: '<',
    instances: '<',
    projectId: '<',
    publicCloudCatalog: '<',
  },
};
