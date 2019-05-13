import { PROCESSING_STATUS } from './constants';

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

  isLegacyCluster(serviceName, kubeId) {
    return this.OvhApiKube.v6().getServiceInfos({
      serviceName,
      kubeId,
    }).$promise
      .then(() => true)
      .catch(error => (error.status === 404 ? false : Promise.reject(error)));
  }


  static isProcessing(status) {
    return PROCESSING_STATUS.includes(status);
  }

  resetNodesCache() {
    this.OvhApiKube.PublicCloud().Node().v6().resetCache();
    this.OvhApiKube.PublicCloud().Node().v6().resetQueryCache();
  }

  formatFlavor(flavor) {
    return this.$translate.instant('kube_flavor', {
      name: flavor.name.toUpperCase(),
      cpuNumber: flavor.vcpus,
      ramCapacity: flavor.ram / 1000,
      diskCapacity: flavor.disk,
    });
  }
}
