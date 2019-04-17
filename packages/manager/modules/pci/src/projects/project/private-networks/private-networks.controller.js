import get from 'lodash/get';
import isObject from 'lodash/isObject';

import { VRACK_OPERATION_COMPLETED_STATUS } from './private-networks.constants';

const CONTAINER_NAME = 'pci.projects.project.privateNetwork';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProject, PciPrivateNetworks) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.PciPrivateNetworks = PciPrivateNetworks;
  }

  $onInit() {
    this.loadMessages();
    this.isLoading = true;

    return this.getVrackCreationOperation()
      .then((operation) => {
        if (isObject(operation)) {
          return (VRACK_OPERATION_COMPLETED_STATUS.includes(operation.status)
            ? this.redirectToVlans() : this.redirectToVrack(get(operation, 'id')));
        }

        return this.getVrack()
          .then(() => this.redirectToVlans());
      })
      .catch((error) => {
        if (error.status === 404) {
          return this.redirectToVrack();
        }

        return this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_network_private_error', {
            message: get(error, 'data.message', ''),
          }),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getVrack() {
    return this.OvhApiCloudProject.v6().vrack({
      serviceName: this.projectId,
    }).$promise;
  }

  getVrackCreationOperation() {
    return this.PciPrivateNetworks.getVrackCreationOperation(this.projectId);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(CONTAINER_NAME);
    this.messageHandler = this.CucCloudMessage.subscribe(
      CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
