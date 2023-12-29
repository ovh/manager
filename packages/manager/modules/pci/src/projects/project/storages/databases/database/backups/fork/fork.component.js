import controller from './fork.controller';
import template from './fork.html';
import './fork.scss';

const component = {
  bindings: {
    engine: '<',
    availableEngines: '<',
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
    goToCommand: '<',
  },
  controller,
  template,
};

export default component;
