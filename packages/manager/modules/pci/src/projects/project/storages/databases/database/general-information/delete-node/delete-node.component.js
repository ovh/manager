import controller from './delete-node.controller';
import template from './delete-node.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    onNodeDelete: '<',
    projectId: '<',
    trackDashboard: '<',
    user: '<',
    price: '<',
  },
  template,
  controller,
};

export default component;
