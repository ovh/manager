import {
  PRIVATE_REGISTRY_STATUS,
  PRIVATE_REGISTRY_STATUS_MAP,
  GUIDE_LINKS,
} from './private-registry.constants';

import { getCriteria } from '../project.utils';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage, pciPrivateRegistryService) {
    this.CucCloudMessage = CucCloudMessage;
    this.GUIDE_LINKS = GUIDE_LINKS;
    this.PRIVATE_REGISTRY_STATUS = PRIVATE_REGISTRY_STATUS;
    this.PRIVATE_REGISTRY_STATUS_MAP = PRIVATE_REGISTRY_STATUS_MAP;
    this.pciPrivateRegistryService = pciPrivateRegistryService;
  }

  $onInit() {
    this.loadMessages();

    this.criteria = getCriteria('id', this.registryId);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.private-registry');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.private-registry',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
