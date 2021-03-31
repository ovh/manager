import controller from './update.controller';
import template from './update.html';

const component = {
  bindings: {
    clusterMinorVersion: '<',
    isMinorVersionUpgrade: '<',
    goBack: '<',
    kubeId: '<',
    kubeTrackPrefix: '<',
    nextMinorVersion: '<',
    projectId: '<',
    trackClick: '<',
  },
  template,
  controller,
};

export default component;
