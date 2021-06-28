import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    addPrivateNetworksLink: '<',
    databaseGuideUrl: '<',
    engines: '<',
    guideUrl: '<',
    lab: '<',
    onDatabaseAdd: '<',
    projectId: '<',
    privateNetworks: '<',
    trackDatabases: '<',
    user: '<',
  },
  controller,
  template,
};
