import some from 'lodash/some';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.sshKeys';

export default class ProjectSshKeysController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectSshKey) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;

    this.messageHandler = CucCloudMessage.subscribe(MESSAGES_CONTAINER_NAME, {
      onMessage: () => this.refreshMessage(),
    });

    this.$onInit();
  }

  $onInit() {
    return this.OvhApiCloudProjectSshKey.v6()
      .query({
        serviceName: this.projectId,
      })
      .$promise.then((keys) => {
        this.keys = keys;
      });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();

    if (some(this.messages, { type: 'success' })) {
      this.$onInit();
    }
  }
}
