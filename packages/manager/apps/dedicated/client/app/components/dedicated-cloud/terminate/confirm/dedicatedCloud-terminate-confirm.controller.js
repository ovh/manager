import head from 'lodash/head';

export default class {
  /* @ngInject */
  constructor($state, $translate, OvhApiDedicatedCloud) {
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;

    this.terminateConfirmForm = null;
    this.reasons = [
      'LACK_OF_PERFORMANCES',
      'TOO_EXPENSIVE',
      'TOO_HARD_TO_USE',
      'NOT_RELIABLE',
      'NOT_NEEDED_ANYMORE',
      'MIGRATED_TO_COMPETITOR',
      'MIGRATED_TO_ANOTHER_OVH_PRODUCT',
      'OTHER',
    ];

    this.loading = {
      confirm: false,
    };

    this.model = {
      reason: head(this.reasons),
      commentary: null,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onTerminateConfirmFormSubmit() {
    if (!this.terminateConfirmForm.$valid) {
      return false;
    }

    this.loading.confirm = true;

    return this.OvhApiDedicatedCloud.v6()
      .confirmTermination(
        {
          serviceName: this.productId,
        },
        {
          commentary: this.model.commentary,
          reason: this.model.reason,
          token: this.token,
        },
      )
      .$promise.then(() =>
        this.goBack(
          this.$translate.instant('dedicatedCloud_confirm_close_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_confirm_close_error',
          )} ${error.message || error}`,
          'danger',
        ),
      );
  }

  /* -----  End of EVENTS  ------ */
}
