import { CONFIG_FILENAME, PROCESSING_STATUS } from './constants';

export default class Kubernetes {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiCloudProject,
    OvhApiCloudProjectFlavor,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectKube,
    OvhApiKube,
    OvhApiCloudProjectQuota,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.OvhApiKube = OvhApiKube;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
  }

  isLegacyCluster(serviceName) {
    return this.OvhApiKube.v6().getServiceInfos({
      serviceName,
    }).$promise
      .then(() => true)
      .catch(error => (error.status === 404 ? false : Promise.reject(error)));
  }


  static isProcessing(status) {
    return PROCESSING_STATUS.includes(status);
  }

  formatFlavor(flavor) {
    return this.$translate.instant('kube_flavor', {
      name: flavor.name.toUpperCase(),
      cpuNumber: flavor.vcpus,
      ramCapacity: flavor.ram / 1000,
      diskCapacity: flavor.disk,
    });
  }

  getKubeConfig(serviceName, kubeId) {
    return this.OvhApiCloudProjectKube.v6().getKubeConfig({
      serviceName,
      kubeId,
    }, {}).$promise
      .then(({ content }) => ({
        content,
        fileName: CONFIG_FILENAME,
      }))
      .catch(error => (error.status === 400 ? false : Promise.reject(error)));
  }
}
