export default class {
  /* @ngInject */
  constructor(
    olaService,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.olaService = olaService;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    this.isLoading = false;
  }

  reset() {
    this.isLoading = true;
    this.atTrack(`${this.trackingPrefix}confirm`);
    return this.olaService
      .resetOlaInterfaces(this.serverName, this.ola.interfaces)
      .then(() => {
        this.PhysicalInterface.v6().resetCache();
        this.VirtualInterface.v6().resetCache();
        return this.goBack(true);
      })
      .catch((error) => {
        return this.goBack().then(() =>
          this.alertError(
            'dedicated_server_interfaces_ola_reset_error',
            error?.data || error,
            true,
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.atTrack(`${this.trackingPrefix}cancel`);
    this.goBack();
  }
}
