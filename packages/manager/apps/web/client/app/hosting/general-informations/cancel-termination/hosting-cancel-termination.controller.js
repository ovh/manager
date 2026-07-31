import {
  EMPTY_TERMINATION_POLICY,
  REACTIVATE_ENGAGEMENT_STRATEGY,
} from './hosting-cancel-termination.constants';

export default class HostingCancelTerminationCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, Alerter) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.isCancelling = false;
  }

  reactivateEngagement() {
    if (!this.hasReactivateStrategy) {
      return this.$q.when(null);
    }

    return this.$http.put(
      `/services/${this.serviceInfos.serviceId}/billing/engagement/endRule`,
      { strategy: REACTIVATE_ENGAGEMENT_STRATEGY },
    );
  }

  onCancelTermination() {
    this.trackClick('confirm');

    this.isCancelling = true;

    return this.reactivateEngagement()
      .then(() =>
        this.$http.put(`/services/${this.serviceInfos.serviceId}`, {
          terminationPolicy: EMPTY_TERMINATION_POLICY,
        }),
      )
      .then(() =>
        this.goBack(
          this.$translate.instant('hosting_cancel_termination_success'),
        ),
      )
      .catch((error) =>
        this.goBack().then(() =>
          this.Alerter.error(
            this.$translate.instant('hosting_cancel_termination_error', {
              message: error.data?.message || error.message || error,
            }),
            this.alerts.main,
          ),
        ),
      )
      .finally(() => {
        this.isCancelling = false;
      });
  }

  onDismiss() {
    this.trackClick('cancel');

    return this.goBack();
  }
}
