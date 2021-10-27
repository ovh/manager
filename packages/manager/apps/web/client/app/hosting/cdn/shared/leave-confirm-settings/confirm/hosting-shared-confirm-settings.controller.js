export default class HostingCdnSharedConfirmController {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  static getOptions(model) {
    return Object.values(model.options)
      .reduce(
        (options, optionsTypes) =>
          options.concat(Object.values(optionsTypes).map(({ api }) => api)),
        [],
      )
      .filter((option) => option !== null);
  }

  static getSettingsToValidate(model, oldModel) {
    const options = HostingCdnSharedConfirmController.getOptions(model);
    const oldOptions = HostingCdnSharedConfirmController.getOptions(oldModel);

    return options.filter((option, index) => {
      return !angular.equals(option, oldOptions[index]);
    });
  }

  onConfirm() {
    this.trackClick(
      'web::hosting::cdn::configure::apply-configuration::confirm',
    );

    this.loading = true;
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
    return (origins || '').split(',');
  }
}
