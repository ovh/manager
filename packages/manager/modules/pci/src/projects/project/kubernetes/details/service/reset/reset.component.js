import controller from './reset.controller';
import template from './reset.html';

const component = {
  bindings: {
    kubeId: '<',
    goBack: '<',
    projectId: '<',
    versions: '<',
    cluster: '<',
    privateNetworks: '<',
    addPrivateNetworksLink: '<',
  },
  template,
  controller,
};

export default component;
