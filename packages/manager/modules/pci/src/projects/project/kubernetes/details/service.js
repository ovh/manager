import { PROCESSING_STATUS, REGION } from './constants';

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

  getAssociatedPublicCloudProjects(serviceName) {
    return this.OvhApiKube.PublicCloud().Project().v6().query({ serviceName }).$promise;
  }

  getProject(projectId) {
    return this.OvhApiCloudProject.v6().get({ serviceName: projectId }).$promise;
  }

  getProjectQuota(serviceName) {
    return this.OvhApiCloudProjectQuota
      .v6()
      .query({ serviceName })
      .$promise;
  }

  getNodes(serviceName) {
    return this.OvhApiKube.PublicCloud().Node().v6().query({ serviceName }).$promise;
  }

  addNode(serviceName, name, flavorName) {
    return this.OvhApiKube.PublicCloud().Node().v6().save(
      { serviceName },
      { name, flavorName },
    ).$promise;
  }

  deleteNode(serviceName, nodeId) {
    return this.OvhApiKube.PublicCloud().Node().v6().delete({ serviceName, nodeId }).$promise;
  }

  static isProcessing(status) {
    return PROCESSING_STATUS.includes(status);
  }

  resetNodesCache() {
    this.OvhApiKube.PublicCloud().Node().v6().resetCache();
    this.OvhApiKube.PublicCloud().Node().v6().resetQueryCache();
  }

  getFlavors(serviceName) {
    // Region is constant for now
    return this.OvhApiCloudProjectFlavor
      .v6()
      .query({ serviceName, region: REGION })
      .$promise;
  }

  getFlavorDetails(serviceName, flavorId) {
    return this.OvhApiCloudProjectFlavor.get({ serviceName, flavorId }).$promise;
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
