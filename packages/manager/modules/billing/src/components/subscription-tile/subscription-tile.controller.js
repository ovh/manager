import { BillingService as ServiceInfos } from '@ovh-ux/manager-models';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(
    $attrs,
    $q,
    $translate,
    atInternet,
    BillingService,
    ovhFeatureFlipping,
  ) {
    this.$attrs = $attrs;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
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
        this.contactManagementUrl = buildURL(
          'dedicated',
          '#/contacts/services',
          {
            serviceName: serviceInfos.domain,
          },
        );
        return this.$q.all({
          serviceInfos,
          service: this.BillingService.getService(serviceInfos.serviceId),
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
      .then(({ canBeEngaged, service, serviceInfos, hasPendingEngagement }) => {
        this.service = service;
        this.serviceInfos = new ServiceInfos({
          ...serviceInfos,
          id: serviceInfos.serviceId,
          serviceId: serviceInfos.domain,
          canBeEngaged: canBeEngaged && serviceInfos.canCommit(),
          engagementDetails: service.billing.engagement,
          hasPendingEngagement,
        });
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

  commit() {
    this.trackClick('commit');
    return this.goToCommit();
  }

  cancelCommit() {
    this.trackClick('cancel-commit');
    return this.goToCancelCommit();
  }

  trackClick(action) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${action}`,
      type: 'action',
    });
  }
}
