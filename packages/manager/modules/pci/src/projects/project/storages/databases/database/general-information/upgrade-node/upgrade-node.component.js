import controller from './upgrade-node.controller';
import template from './upgrade-node.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    onVersionUpgrade: '<',
    versions: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  template,
  controller,
};

export default component;
