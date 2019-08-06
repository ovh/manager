import controller from './service.controller';
import template from './service.html';

const component = {
  bindings: {
    changeClusterName: '<',
    cluster: '<',
    clusterMinorVersion: '<',
    highestVersion: '<',
    kubernetesConfig: '<',
    kubeId: '<',
    resetCluster: '<',
    terminate: '<',
    updateCluster: '<',
    updatePolicy: '<',
  },
  template,
  controller,
};

export default component;
