import controller from './upgrade-storage.controller';
import template from './upgrade-storage.html';
import './style.scss';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    flavor: '<',
    onStorageUpgrade: '<',
    projectId: '<',
    trackDashboard: '<',
    trackDatabases: '<',
  },
  template,
  controller,
};

export default component;
