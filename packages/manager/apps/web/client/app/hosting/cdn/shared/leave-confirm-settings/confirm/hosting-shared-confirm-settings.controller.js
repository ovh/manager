export default class HostingCdnSharedConfirmController {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  static getSettingsToValidate(model, oldModel) {
    return Object.keys(model)
      .filter((key) => !angular.equals(oldModel[key], model[key]))
      .map((key) => model[key]);
  }

  onConfirm() {
    this.loading = true;
    this.trackClick(
      'web::hosting::cdn::configure::apply-configuration::confirm',
    );
    const settings = HostingCdnSharedConfirmController.getSettingsToValidate(
      this.model,
      this.oldModel,
    );
    return this.applyChanges(settings)
      .then(() => this.refresh())
      .then(() =>
        this.goToHosting(
          this.$translate.instant(
            'hosting_cdn_shared_modal_confirm_btn_validate_success',
          ),
        ),
      )
      .catch((error) => {
        return this.goBack().then(() => {
          this.Alerter.error(
            `${this.$translate.instant(
              'hosting_cdn_shared_modal_confirm_btn_validate_error',
            )} ${error.data?.message || error}`,
            'cdnSharedSettingsError',
          );
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  static getCorsOriginsList(origins) {
    return origins.split(',');
  }
}
