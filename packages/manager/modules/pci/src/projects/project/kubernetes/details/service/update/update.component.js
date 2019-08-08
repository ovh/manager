import controller from './update.controller';
import template from './update.html';

const component = {
  bindings: {
    clusterMinorVersion: '<',
    isMinorVersionUpgrade: '<',
    goBack: '<',
    kubeId: '<',
    nextMinorVersion: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
