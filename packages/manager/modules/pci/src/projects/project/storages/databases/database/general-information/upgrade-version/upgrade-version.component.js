import controller from './upgrade-version.controller';
import template from './upgrade-version.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    onVersionUpgrade: '<',
    versions: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  template,
  controller,
};

export default component;
