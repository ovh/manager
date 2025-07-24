export default class VpsForceOutperform2020Controller {
  /* @ngInject */
  constructor($translate, VpsService) {
    this.$translate = $translate;
    this.VpsService = VpsService;
  }

  confirm() {
    this.VpsService.putMigration2020(this.serviceName, new Date().toISOString())
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'vps_dashboard_force_outperform_2020_success_message',
          ),
          'success',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'vps_dashboard_force_outperform_2020_error_message',
            { error: error?.data?.message },
          ),
          'error',
        ),
      );
  }
}
