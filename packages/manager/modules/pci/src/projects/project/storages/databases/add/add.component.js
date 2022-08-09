import controller from './add.controller';
import template from './add.html';
import './add.scss';

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
    goToCommand: '<',
    redirectTarget: '<',
  },
  controller,
  template,
};
