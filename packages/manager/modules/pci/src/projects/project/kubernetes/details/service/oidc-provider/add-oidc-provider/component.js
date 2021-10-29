import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    kubeId: '<',
    oidcProvider: '<',
    oidcProviderModel: '<',
    sendKubeTrack: '<',
  },
  template,
  controller,
};

export default component;
