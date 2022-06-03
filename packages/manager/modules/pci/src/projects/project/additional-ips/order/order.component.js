import controller from './order.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    instances: '<',
    createInstanceUrl: '<',
    projectId: '<',
    goBack: '<',
    publicCloudCatalog: '<',
  },
};
