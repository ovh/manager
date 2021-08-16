export default class CloudProjectBillingConsumptionCurrentCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;

    this.CucCloudMessage = CucCloudMessage;

    this.loading = true;

    this.loadMessages();
  }

  $onInit() {
    this.isExpanded = Object.keys(this.consumptionDetails).reduce(
      (acc, planFamily) => ({
        ...acc,
        [planFamily]: false,
      }),
      {},
    );
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.billing',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  expandRow($row) {
    this.isExpanded[$row.planFamily] = !this.isExpanded[$row.planFamily];
  }

  getDescription(detail) {
    const translationKey = `cpbc_billing_control_consumption_plan_${detail.planCode}`;
    const description = this.$translate.instant(translationKey);
    return description === translationKey ? '' : description;
  }
}
