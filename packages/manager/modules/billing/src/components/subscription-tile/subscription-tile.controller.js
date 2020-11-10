import { BillingService as ServiceInfos } from '@ovh-ux/manager-models';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(
    $attrs,
    $q,
    $translate,
    BillingSubscriptionService,
    ovhFeatureFlipping,
    RedirectionService,
  ) {
    this.$attrs = $attrs;
    this.$q = $q;
    this.$translate = $translate;
    this.BillingSubscriptionService = BillingSubscriptionService;
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
          : this.BillingSubscriptionService.getServiceInfos(this.servicePath);
      })
      .then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
        this.contactManagementUrl = this.RedirectionService.getURL(
          'contactManagement',
          {
            serviceName: serviceInfos.domain,
          },
        );
        return this.$q.all({
          service: this.BillingSubscriptionService.getService(serviceInfos),
          engagement:
            serviceInfos.hasEngagement() && this.withEngagement
              ? this.BillingSubscriptionService.getEngagement(serviceInfos)
              : this.$q.when(null),
        });
      })
      .then(({ service, engagement }) => {
        this.service = service;
        this.engagement = engagement;
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
