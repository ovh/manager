import pick from 'lodash/pick';
import set from 'lodash/set';

export default class ServerTerminateCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    constants,
    coreConfig,
    DedicatedServerFeatureAvailability,
    ovhFeatureFlipping,
    Server,
  ) {
    this.$http = $http;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.constants = constants;
    this.$q = $q;
    this.Server = Server;
    this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
    this.Alerter = Alerter;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.region = coreConfig.getRegion();
  }

  $onInit() {
    this.manualRefund = this.DedicatedServerFeatureAvailability.hasDedicatedServerManualRefund();
    this.cancelSubscriptionForm = {
      cancelMethod: null,
      isSubmiting: false,
    };
    this.getTerminationAvailability();
  }

  getTerminationAvailability() {
    this.loading = true;
    this.terminationUnavailable = false;
    return this.ovhFeatureFlipping
      .checkFeatureAvailability('dedicated-server:terminate')
      .then((featureAvailability) => {
        this.terminationUnavailable = !featureAvailability.isFeatureAvailable(
          'dedicated-server:terminate',
        );
      })
      .catch(() => {
        this.terminationUnavailable = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * Submit cancel subscription form.
   * @return {Promise}
   */
  submitCancelSubscription() {
    const serviceInfosRenew = pick(this.serviceInfos, 'renew');
    let promise = this.$q.when(true);
    switch (this.cancelSubscriptionForm.cancelMethod) {
      case 'terminate':
        promise = this.Server.terminate(this.$stateParams.productId)
          .then(() =>
            this.goBack(
              this.$translate.instant('server_close_service_success'),
              'DONE',
            ),
          )
          .catch((err) => {
            return this.goBack(
              `${this.$translate.instant('server_close_service_error')} ${err
                .data?.message || err.message}`,
              'error',
            );
          });
        break;
      case 'deleteAtExpiration':
        set(serviceInfosRenew, 'renew.automatic', true);
        set(serviceInfosRenew, 'renew.deleteAtExpiration', true);

        promise = this.Server.updateServiceInfos(
          this.$stateParams.productId,
          serviceInfosRenew,
        )
          .then(() =>
            this.goBack(
              this.$translate.instant(
                'server_close_service_delete_at_expiration_activate_success',
              ),
              'DONE',
            ),
          )
          .catch((err) => {
            this.goBack(
              `${this.$translate.instant(
                'server_close_service_delete_at_expiration_activate_error',
              )} ${err.data?.message || err.message}`,
              'error',
            );
            return this.$q.reject(err);
          });
        break;
      case 'cancel':
        set(serviceInfosRenew, 'renew.automatic', true);
        set(serviceInfosRenew, 'renew.deleteAtExpiration', false);

        promise = this.Server.updateServiceInfos(
          this.$stateParams.productId,
          serviceInfosRenew,
        )
          .then(() =>
            this.goBack(
              this.$translate.instant('server_close_service_cancel_success'),
              'DONE',
            ),
          )
          .catch((err) =>
            this.goBack(
              `${this.$translate.instant(
                'server_close_service_cancel_error',
              )} ${err.data?.message || err.message}`,
              'error',
            ),
          );
        break;
      default:
        break;
    }

    this.cancelSubscriptionForm.isSubmiting = true;
    return promise.finally(() => {
      this.cancelSubscriptionForm.isSubmiting = false;
    });
  }
}
