import controller from './fork.controller';
import template from './fork.html';
import './fork.scss';

const component = {
  bindings: {
    engines: '<',
    backupList: '<',
    restoreMode: '<',
    backupId: '<',
    database: '<',
    goToFork: '<',
    projectId: '<',
    trackDashboard: '<',
    privateNetworks: '<',
    addPrivateNetworksLink: '<',
    user: '<',
    onDatabaseAdd: '<',
  },
  controller,
  template,
};

export default component;
