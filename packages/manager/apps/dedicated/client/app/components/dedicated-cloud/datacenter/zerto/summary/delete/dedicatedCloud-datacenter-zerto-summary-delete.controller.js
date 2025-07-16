import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($timeout, $translate, Alerter, dedicatedCloudZerto) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
  }

  confirm() {
    this.isDeleting = true;
    return this.dedicatedCloudZerto
      .disableZerto(this.zertoInformations)
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
