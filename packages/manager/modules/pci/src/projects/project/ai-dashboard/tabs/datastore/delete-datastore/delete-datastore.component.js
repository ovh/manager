import controller from './delete-datastore.controller';
import template from './delete-datastore.html';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    datastoreId: '<',
    regionId: '<',
  },
  template,
  controller,
};

export default component;
