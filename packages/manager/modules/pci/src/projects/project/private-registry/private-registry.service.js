import concat from 'lodash/concat';
import map from 'lodash/map';
import template from 'lodash/template';

import { PRIVATE_REGISTRY_STATUS } from './private-registry.constants';

export default class pciPrivateRegistryService {
  /* @ngInject */
  constructor($q, atInternet, OvhApiCloud, OvhApiCloudProject, OvhApiMe) {
    this.$q = $q;
    this.atInternet = atInternet;
    this.OvhApiCloud = OvhApiCloud.v6();
    this.OvhApiPrivateRegistry = OvhApiCloudProject.ContainerRegistry().v6();
    this.OvhApiPrivateRegistryPlan = OvhApiCloudProject.ContainerRegistry()
      .Plan()
      .v6();
    this.OvhApiPrivateRegistryUser = OvhApiCloudProject.ContainerRegistry()
      .Users()
      .v6();
    this.OvhApiPrivateRegistryPlan = OvhApiCloudProject.ContainerRegistry()
      .Plan()
      .v6();
    this.OvhApiAgreements = OvhApiMe.Agreements().v6();
    this.PRIVATE_REGISTRY_STATUS = PRIVATE_REGISTRY_STATUS;
  }

  create(projectId, registry) {
    return this.OvhApiPrivateRegistry.create(
      { serviceName: projectId },
      registry,
    ).$promise;
  }

  delete(projectId, registryID) {
    return this.OvhApiPrivateRegistry.delete({
      serviceName: projectId,
      registryID,
    }).$promise;
  }

  update(projectId, registryID, newRegistryName) {
    return this.OvhApiPrivateRegistry.update(
      {
        serviceName: projectId,
        registryID,
      },
      {
        name: newRegistryName,
      },
    ).$promise;
  }

  getCapabilities(projectId) {
    return this.OvhApiPrivateRegistry.getCapabilities({
      serviceName: projectId,
    }).$promise;
  }

  getRegistryList(projectId, clearCache = false) {
    if (clearCache) {
      this.OvhApiPrivateRegistry.resetCache();
      this.OvhApiPrivateRegistry.resetQueryCache();
    }
    return this.OvhApiPrivateRegistry.query({
      serviceName: projectId,
    }).$promise;
  }

  getRegistry(serviceName, registryID) {
    return this.OvhApiPrivateRegistry.get({
      serviceName,
      registryID,
    }).$promise;
  }

  getRegistryPlan(serviceName, registryID) {
    return this.OvhApiPrivateRegistryPlan.get({
      serviceName,
      registryID,
    }).$promise;
  }

  getAvailableUpgrades(serviceName, registryID) {
    return this.OvhApiPrivateRegistryPlan.getCapabilities({
      serviceName,
      registryID,
    }).$promise;
  }

  generateCredentials(projectId, registryID) {
    return this.OvhApiPrivateRegistryUser.create({
      serviceName: projectId,
      registryID,
    }).$promise;
  }

  getContractInfo(contractId) {
    return this.OvhApiAgreements.contract({
      id: contractId,
    }).$promise;
  }

  getAgreements() {
    return this.OvhApiCloud.agreements({ product: 'registry' }).$promise.then(
      (agreements) =>
        concat(
          map(agreements.agreementsToValidate, (agreement) => ({
            id: agreement,
            validated: false,
          })),
          map(agreements.agreementsValidated, (agreement) => ({
            id: agreement,
            validated: true,
          })),
        ),
    );
  }

  acceptAgreements(contactList = []) {
    const acceptPromises = map(
      contactList,
      ({ id }) =>
        this.OvhApiAgreements.accept(
          {
            id,
          },
          {},
        ).$promise,
    );

    return this.$q.all(acceptPromises);
  }

  static getCompiledLinks(linkTemplate, registryContracts) {
    return map(registryContracts, (contract) => {
      const compile = template(linkTemplate);
      return compile(contract);
    }).join(', ');
  }

  isDeploymentInProgress(registry) {
    return (
      registry.status === this.PRIVATE_REGISTRY_STATUS.SCALING_UP ||
      registry.status === this.PRIVATE_REGISTRY_STATUS.INSTALLING
    );
  }

  trackClick(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
