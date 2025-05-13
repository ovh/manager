export default class OverTheBoxConfigureCtrl {
  /* @ngInject */
  constructor($translate, OvhApiOverTheBox, TucToastError) {
    this.$translate = $translate;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = true;
    return this.OvhApiOverTheBox.v6()
      .getServices()
      .$promise.then((services) => {
        this.services = services;
        if (services.length === 0) {
          this.goOrderOverTheBox();
        }
        return services;
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.loading = false;
      });
  }
}
