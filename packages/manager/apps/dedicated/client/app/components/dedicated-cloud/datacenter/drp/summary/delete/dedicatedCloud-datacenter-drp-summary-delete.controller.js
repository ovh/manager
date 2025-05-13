import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($timeout, $translate, Alerter, dedicatedCloudDrp) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
  }

  confirm() {
    this.isDeleting = true;
    return this.dedicatedCloudDrp
      .disableDrp(this.drpInformations)
      .then(() =>
        this.goBackToDashboard(
          this.$translate.instant(
            'dedicatedCloud_datacenter_drp_confirm_delete_drp_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBackToDashboard(
          this.$translate.instant(
            `${this.$translate.instant(
              'dedicatedCloud_datacenter_drp_confirm_delete_drp_error',
            )} ${get(error, 'message', '')}`,
          ),
          'danger',
        ),
      );
  }
}
