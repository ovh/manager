import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    DedicatedServerInterfacesService,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.InterfaceService = DedicatedServerInterfacesService;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    this.isLoading = false;
  }

  reset() {
    this.isLoading = true;
    return this.InterfaceService.resetOlaInterfaces(
      this.serverName,
      this.ola.interfaces,
    )
      .then(() => {
        this.PhysicalInterface.v6().resetCache();
        this.VirtualInterface.v6().resetCache();
        this.goBack(true);
      })
      .catch((error) => {
        this.goBack().then(() =>
          this.alertError(
            'dedicated_server_interfaces_ola_reset_error',
            get(error, 'data', error),
            true,
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
