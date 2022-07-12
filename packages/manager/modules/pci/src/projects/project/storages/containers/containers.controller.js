import find from 'lodash/find';
import { getCriteria } from '../../project.utils';

import { OBJECT_CONTAINER_OFFERS_TYPES } from './containers.constants';

export default class PciStoragesContainersController {
  /* @ngInject */
  constructor($translate, $http, CucCloudMessage) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucCloudMessage = CucCloudMessage;
    this.publicToggleLoading = false;
    this.OBJECT_CONTAINER_OFFERS_TYPES = OBJECT_CONTAINER_OFFERS_TYPES;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.containerId);
    this.publicToggleLoading = false;
    this.hasHighPerformanceStorage = this.hasHighPerformanceStorage();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.containers',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  hasHighPerformanceStorage() {
    return find(this.containers, { isHighPerfStorage: true });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
