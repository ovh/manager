import template from './create-datastore.html';
import controller from './create-datastore.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    datastoreType: '<',
    regions: '<',
    currentRegion: '<',
    currentType: '<',
    isS3selected: '<',
    gitAuthentType: '<',
    currentGitAuthent: '<',
    sshSelected: '<',
  },
  template,
  controller,
};

export default component;
