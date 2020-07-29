export default class OverTheBoxConfigureCtrl {
  /* @ngInject */
  constructor($translate, $state, OvhApiOverTheBox, TucToastError) {
    this.$translate = $translate;
    this.$state = $state;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.orderHash = this.$state.href('order-overTheBox');
    this.loading = true;
    return this.OvhApiOverTheBox.v6()
      .getServices()
      .$promise.then((services) => {
        this.services = services;
        if (services.length === 0) {
          this.$state.go('order-overTheBox');
        }
        return services;
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.loading = false;
      });
  }
}
