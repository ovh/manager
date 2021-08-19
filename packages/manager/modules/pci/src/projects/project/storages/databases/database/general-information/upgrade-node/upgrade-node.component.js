import controller from './upgrade-node.controller';
import template from './upgrade-node.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    currentFlavor: '<',
    onNodeUpgrade: '<',
    flavors: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  template,
  controller,
};

export default component;
