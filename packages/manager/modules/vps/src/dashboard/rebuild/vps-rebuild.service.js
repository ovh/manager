export default class VpsRebuild {
  /* @ngInject */
  constructor($q, OvhApiVps) {
    this.$q = $q;
    this.OvhApiVps = OvhApiVps;
  }

  getAvailableImages(serviceName) {
    return this.OvhApiVps.Images()
      .Available()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((imagesId) =>
        this.$q.all(
          imagesId.map(
            (id) =>
              this.OvhApiVps.Images().Available().v6().get({ id, serviceName })
                .$promise,
          ),
        ),
      );
  }

  rebuildVps(serviceName, vpsOptions) {
    return this.OvhApiVps.v6().rebuild(
      {
        serviceName,
      },
      vpsOptions,
    ).$promise;
  }
}
