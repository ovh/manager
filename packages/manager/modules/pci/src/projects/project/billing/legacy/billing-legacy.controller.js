export default class CloudProjectBillingConsumptionCurrentCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    CucCloudMessage,
    CloudProjectBilling,
    OvhApiCloudProjectUsageCurrent,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.data = {};

    this.CucCloudMessage = CucCloudMessage;
    this.CloudProjectBilling = CloudProjectBilling;
    this.OvhApiCloudProjectUsageCurrent = OvhApiCloudProjectUsageCurrent;

    this.loading = true;

    this.loadMessages();
  }

  $onInit() {
    return this.OvhApiCloudProjectUsageCurrent.v6()
      .get({ serviceName: this.projectId })
      .$promise.then((billingInfo) =>
        this.CloudProjectBilling.getConsumptionDetails(
          billingInfo,
          billingInfo,
        ),
      )
      .then((data) => {
        this.data = data;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpb_error_message'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
        return this.$q.reject(err);
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
