import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.private-registry.upgrade-plan',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.private-registry.upgrade-plan',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onSuccess() {
    this.goBackToList(
      this.$translate.instant('private_registry_upgrade_plan_success'),
    );
  }

  onError(error) {
    this.CucCloudMessage.error(
      this.$translate.instant('private_registry_upgrade_plan_error', {
        message: get(error, 'data.message'),
      }),
      'pci.projects.project.private-registry.upgrade-plan',
    );
  }
}
