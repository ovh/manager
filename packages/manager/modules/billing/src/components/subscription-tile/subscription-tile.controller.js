import { BillingService as ServiceInfos } from '@ovh-ux/manager-models';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(
    $attrs,
    $q,
    $translate,
    BillingService,
    ovhFeatureFlipping,
    RedirectionService,
  ) {
    this.$attrs = $attrs;
    this.$q = $q;
    this.$translate = $translate;
    this.BillingService = BillingService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.withEngagement =
      this.withEngagement || this.$attrs.withEngagement === '';
    this.isLoading = true;
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(['contact', 'contact:management'])
      .then((contactAvailability) => {
        this.contactAvailability = contactAvailability;
        return this.serviceInfos
          ? this.$q.when(new ServiceInfos(this.serviceInfos))
          : this.BillingService.getServiceInfos(this.servicePath);
      })
      .then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
        this.contactManagementUrl = this.RedirectionService.getURL(
          'contactManagement',
          {
            serviceName: serviceInfos.domain,
          },
        );
        this.serviceManagementUrl = this.RedirectionService.getURL(
          'serviceManagement',
          {
            serviceName: serviceInfos.domain,
          },
        );
        return this.$q.all({
          service: this.BillingService.getService(serviceInfos.serviceId),
          engagement:
            serviceInfos.hasEngagement() && this.withEngagement
              ? this.BillingService.getEngagement(serviceInfos.serviceId)
              : this.$q.when(null),
          canBeEngaged: this.withEngagement
            ? this.BillingService.getAvailableEngagement(serviceInfos.serviceId)
                .then((availableEngagements) => availableEngagements.length > 0)
                .catch(() => false)
            : this.$q.when(false),
          hasPendingEngagement: this.withEngagement
            ? this.BillingService.getPendingEngagement(serviceInfos.serviceId)
                .then(() => true)
                .catch(() => false)
            : this.$q.when(false),
        });
      })
      .then(({ canBeEngaged, service, engagement, hasPendingEngagement }) => {
        this.service = service;
        this.engagement = engagement;
        this.canBeEngaged = canBeEngaged;
        this.hasPendingEngagement = hasPendingEngagement;
      })
      .catch((error) =>
        this.onError({
          error: this.$translate.instant('manager_billing_subscription_error', {
            message: (error.data && error.data.message) || error.message,
          }),
        }),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
