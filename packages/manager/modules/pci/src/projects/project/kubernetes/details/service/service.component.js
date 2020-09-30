import controller from './service.controller';
import template from './service.html';

const component = {
  bindings: {
    changeClusterName: '<',
    cluster: '<',
    clusterMinorVersion: '<',
    createNodePool: '<',
    highestVersion: '<',
    kubernetesConfig: '<',
    getKubeConfig: '<',
    kubeId: '<',
    resetCluster: '<',
    resetKubeconfig: '<',
    terminate: '<',
    updateCluster: '<',
    updatePolicy: '<',
    isVersionSupported: '<',
  },
  template,
  controller,
};

export default component;
