import { PCI_FEATURES } from '../../../projects.constant';

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
    this.PCI_FEATURES = PCI_FEATURES;
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

  get hourlyBillingTitle() {
    return this.isSubsidiaryWithPostPaidUsageBilling
      ? this.$translate.instant('cpbc_hourly_header_post_paid')
      : this.$translate.instant('cpbc_hourly_header');
  }

  get monthlyBillingTitle() {
    return this.isSubsidiaryWithPostPaidUsageBilling
      ? this.$translate.instant('cpbc_monthly_header_post_paid')
      : this.$translate.instant('cpbc_monthly_header');
  }
}
