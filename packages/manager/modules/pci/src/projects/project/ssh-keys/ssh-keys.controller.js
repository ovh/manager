import some from 'lodash/some';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.sshKeys';

export default class ProjectSshKeysController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectSshKey,
    atInternet,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
    this.atInternet = atInternet;

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

  onAddSshKeyClick() {
    this.atInternet.trackClick({
      name: 'PCI_PROJECTS_SSH_KEYS_ADD',
      type: 'navigation',
    });
    return this.goToAddSshkey();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();

    if (some(this.messages, { type: 'success' })) {
      this.$onInit();
    }
  }
}
