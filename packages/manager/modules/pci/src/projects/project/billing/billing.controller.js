export default class CloudProjectBillingConsumptionCurrentCtrl {
  /* @ngInject */
  constructor($filter, $translate, CucCloudMessage) {
    this.$filter = $filter;
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

  getPeriod() {
    return this.$translate.instant(
      'cpbc_billing_control_consumption_current_period',
      {
        from: this.$filter('date')(this.consumption.beginDate),
        to: this.$filter('date')(this.consumption.endDate),
      },
      // Needed to display correctly some UTF-8 characters
      {},
      null,
      'escapeParameters',
    );
  }
}
