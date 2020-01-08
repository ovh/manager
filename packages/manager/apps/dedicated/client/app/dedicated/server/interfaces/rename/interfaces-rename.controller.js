export default class {
  /* @ngInject */
  constructor(OvhApiDedicatedServerVirtualInterface) {
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    this.loading = false;
    if (!this.interface) {
      this.goBack();
    }
  }

  rename() {
    this.loading = true;
    return this.VirtualInterface.v6()
      .update(
        {
          serverName: this.serverName,
          uuid: this.interface.id,
        },
        {
          mode: this.interface.type,
          name: this.interface.name,
        },
      )
      .$promise.then(() => {
        this.VirtualInterface.v6().resetCache();
        this.goBack({}, { reload: true });
      });
  }
}
