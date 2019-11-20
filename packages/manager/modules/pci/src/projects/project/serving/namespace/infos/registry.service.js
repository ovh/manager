
export default class OvhManagerPciServingRegistryService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo, OvhApiCloudProjectServing) {
    this.$q = $q;
    this.OvhApiCloudProjectServing = OvhApiCloudProjectServing;
  }

  get(serviceName, namespaceId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Registry()
      .v6()
      .get(
        {
          serviceName,
          namespaceId,
        },
      )
      .$promise;
  }

  attach(serviceName, namespaceId, registry) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Registry()
      .v6()
      .save(
        {
          serviceName,
          namespaceId,
        },
        registry,
      )
      .$promise;
  }

  detach(serviceName, namespaceId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Registry()
      .v6()
      .delete({
        serviceName,
        namespaceId,
      })
      .$promise;
  }
}
