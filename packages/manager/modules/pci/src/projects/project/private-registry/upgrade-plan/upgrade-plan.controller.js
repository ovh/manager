import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectContainerRegistryPlan,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectContainerRegistryPlan = OvhApiCloudProjectContainerRegistryPlan;
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

  changeMethod(value) {
    this.selectedPlan = value;
  }

  onError(error) {
    this.CucCloudMessage.error(
      this.$translate.instant('private_registry_upgrade_plan_error', {
        message: get(error, 'data.message'),
      }),
      'pci.projects.project.private-registry.upgrade-plan',
    );
  }

  upgradeOffer() {
    this.loading = true;
    return this.OvhApiCloudProjectContainerRegistryPlan.v6()
      .update(
        {
          serviceName: this.projectId,
          registryID: this.registryId,
        },
        {
          planID: this.selectedPlan.id,
        },
      )
      .$promise.then(() => this.onSuccess())
      .catch((error) => this.onError({ error }))
      .finally(() => {
        this.loading = false;
      });
  }
}
