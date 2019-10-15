export default class {
  /* @ngInject */
  constructor(
    OvhApiVrack,
  ) {
    this.Vrack = OvhApiVrack;
  }

  $onInit() {
    if (!this.interface) {
      this.goBack();
    }
  }

  attach() {
    return this.Vrack.DedicatedServerInterface().v6().post({
      serviceName: this.vrack,
    }, {
      dedicatedServerInterface: this.interface.id,
    }).$promise
      .then(() => {
        this.goBack();
      })
      .catch((error) => {
        this.goBack().then(() => this.alertError('server_error_vrack_attach', error.data));
      });
  }
}
