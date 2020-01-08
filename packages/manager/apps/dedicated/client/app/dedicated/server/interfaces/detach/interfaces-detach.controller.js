export default class {
  /* @ngInject */
  constructor(OvhApiVrack) {
    this.Vrack = OvhApiVrack;
  }

  $onInit() {
    if (!this.interface) {
      this.goBack();
    }
  }

  detach() {
    return this.Vrack.DedicatedServerInterface()
      .v6()
      .delete({
        serviceName: this.interface.vrack,
        dedicatedServerInterface: this.interface.id,
      })
      .$promise.then(() => {
        this.goBack();
      })
      .catch((error) => {
        this.goBack().then(() =>
          this.alertError('server_error_vrack_detach', error.data),
        );
      });
  }
}
