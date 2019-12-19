export default class CloudProjectBillingConsumptionCurrentCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    CucCloudMessage,
    CloudProjectBilling,
    guideUrl,
    OvhApiCloudProjectUsageCurrent,
    projectId,
  ) {
    this.$state = $state;
    this.projectId = projectId;
    this.data = {};

    this.CucCloudMessage = CucCloudMessage;
    this.guideUrl = guideUrl;

    this.loading = true;

    this.loadMessages();
    OvhApiCloudProjectUsageCurrent
      .v6()
      .get({ serviceName: projectId })
      .$promise
      .then((billingInfo) => CloudProjectBilling.getConsumptionDetails(
        billingInfo,
        billingInfo,
      ))
      .then((data) => {
        this.data = data;
      })
      .catch((err) => {
        this.CucCloudMessage.error([$translate.instant('cpb_error_message'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
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

  switchToMonthly({ instanceId }) {
    return this.$state.go('pci.projects.project.billing.monthly', {
      projectId: this.projectId,
      instanceId,
    });
  }
}
