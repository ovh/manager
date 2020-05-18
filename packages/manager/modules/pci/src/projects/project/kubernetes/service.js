import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import NodePool from './details/node-pool/node-pool.class'

import { CONFIG_FILENAME, ERROR_STATUS, PROCESSING_STATUS } from './details/constants';

export default class Kubernetes {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    OvhApiCloudProject,
    PciProjectFlavors,
    OvhApiCloudProjectKube,
    OvhApiKube,
    OvhApiCloudProjectQuota,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.PciProjectFlavors = PciProjectFlavors;
    this.OvhApiCloudProjectInstance = OvhApiCloudProject.Instance();
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.OvhApiKube = OvhApiKube;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
  }

  isLegacyCluster(serviceName) {
    return this.OvhApiKube.v6()
      .getServiceInfos({
        serviceName,
      })
      .$promise.then(() => true)
      .catch((error) => (error.status === 404 ? false : Promise.reject(error)));
  }

  static isProcessing(status) {
    return PROCESSING_STATUS.includes(status);
  }

  static isError(status) {
    return ERROR_STATUS.includes(status);
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
    return this.OvhApiCloudProjectKube.v6()
      .getKubeConfig(
        {
          serviceName,
          kubeId,
        },
        {},
      )
      .$promise.then(({ content }) => ({
        content,
        fileName: CONFIG_FILENAME,
      }))
      .catch((error) => (error.status === 400 ? false : Promise.reject(error)));
  }

  createCluster(projectId, name, region, version, desiredNodes, flavorName) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/kube`,
        {
          region,
          name,
          version,
          nodepool: {
            desiredNodes,
            flavorName,
          }
        },
      )
  }

  createNodePool(projectId, kubeId, desiredNodes, flavorName, name) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/kube/${kubeId}/nodepool`,
        {
          name,
          desiredNodes,
          flavorName,
        },
      )
  }

  deleteNodePool(projectId, kubeId, nodePoolId) {
    return this.$http
      .delete(`/cloud/project/${projectId}/kube/${kubeId}/nodepool/${nodePoolId}`)
  }

  resizeNodePool(projectId, kubeId, nodePoolId, desiredNodes) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/kube/${kubeId}/nodepool/${nodePoolId}`,
        {
          desiredNodes,
        },
      )
  }

  getNodes(projectId, kubeId, nodePoolId) {
    return this.$http
      .get(`/cloud/project/${projectId}/kube/${kubeId}/nodepool/${nodePoolId}/nodes`)
      .then((nodes) => nodes.data);
  }

  getNodePools(projectId, kubeId) {
    return this.$http
      .get(`/cloud/project/${projectId}/kube/${kubeId}/nodepool`)
      .then((pools) => map(pools.data, (pool) => new NodePool(pool)));
  }

  getNodePool(projectId, kubeId, nodePoolId) {
    return this.$http
      .get(`/cloud/project/${projectId}/kube/${kubeId}/nodepool/${nodePoolId}`)
      .then((nodePool) => new NodePool(nodePool.data));
  }

  getAvailableFlavors(region, projectId) {
    if (this.availableFlavors) {
      return this.$q.when(this.availableFlavors);
    }
    return this.$q.all({
      flavors: this.getAllFlavors(region, projectId),
      kubeFlavors: this.getKubeFlavors(region, projectId)
    }).then(({ flavors, kubeFlavors }) => {
      const availableFlavors = map(kubeFlavors, (flavor) => {
        const pciFlavor = flavors.find(
          (flavorDetails) => flavorDetails.name === flavor.name,
        );
        return pciFlavor;
      });
      this.availableFlavors = sortBy(availableFlavors, 'ram');
      return this.availableFlavors;
    });
  }

  getKubeFlavors(region, projectId) {
    return this.$http.get(
      `/cloud/project/${projectId}/capabilities/kube/flavors`,
      {
        params: {
          region,
        },
      },
    ).then((response) => response.data);
  }

  getAllFlavors(region, projectId) {
    return this.PciProjectFlavors.getFlavors(
      projectId,
      region,
    );
  }

  getProjectInstances(projectId) {
    return this.OvhApiCloudProjectInstance.v6().query({
      serviceName: projectId,
    }).$promise;
  }

  switchToMonthlyBilling(serviceName, nodeId) {
    return this.OvhApiCloudProjectInstance.v6().activeMonthlyBilling({
      serviceName,
      instanceId: nodeId,
    }).$promise;
  }

  resetInstancesCache() {
    this.OvhApiCloudProjectInstance.v6().resetCache();
  }
}
