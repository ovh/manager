import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    addPrivateNetworksLink: '<',
    engines: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
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
