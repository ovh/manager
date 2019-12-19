export default /* @ngInject */ function
($translate, $state, OvhApiOverTheBox, TucToast, TucToastError) {
  const self = this;

  this.orderHash = $state.href('order-overTheBox');

  function init() {
    self.loading = true;
    return OvhApiOverTheBox.v6().getServices().$promise.then((services) => {
      self.services = services;
      if (services.length === 0) {
        $state.go('order-overTheBox');
      }
      return services;
    }, (err) => new TucToastError(err)).finally(() => {
      self.loading = false;
    });
  }

  init();
}
