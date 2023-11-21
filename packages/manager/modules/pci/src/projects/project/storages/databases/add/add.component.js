import controller from './add.controller';
import template from './add.html';
import './add.scss';

export default {
  bindings: {
    addPrivateNetworksLink: '<',
    availableEngines: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    onDatabaseAdd: '<',
    projectId: '<',
    privateNetworks: '<',
    trackDatabases: '<',
    user: '<',
    goToCommand: '<',
    redirectTarget: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
  controller,
  template,
};
