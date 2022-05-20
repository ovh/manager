import controller from './add.controller';
import template from './add.html';
import './add.scss';

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
    goToCommand: '<',
    queryParamEngine: '<',
    queryParamOffer: '<',
  },
  controller,
  template,
};
