export default class {
  /* @ngInject */
  constructor($translate, Alerter, dedicatedCloudZerto) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
  }

  confirm() {
    this.isDeleting = true;
    return this.dedicatedCloudZerto
      .disableZerto(this.zertoInformations)
      .then(() =>
        this.goBackAfterDelete(
          this.$translate.instant(
            'dedicatedCloud_datacenter_zerto_drp_configuration_delete_modal_success',
          ),
        ),
      )
      .catch(() => {
        this.isDeleting = false;
        this.Alerter.error(
          this.$translate.instant(
            'dedicatedCloud_datacenter_zerto_drp_configuration_delete_modal_error',
          ),
          'dedicatedCloud_dashboard_alert',
        );
        this.goBack();
      });
  }
}
