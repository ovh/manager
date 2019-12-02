
export default class OvhManagerPciServingRegistryService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectAiServing) {
    this.$q = $q;
    this.OvhApiCloudProjectAiServing = OvhApiCloudProjectAiServing;
  }

  get(serviceName, namespaceId) {
    return this.OvhApiCloudProjectAiServing
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
    return this.OvhApiCloudProjectAiServing
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
    return this.OvhApiCloudProjectAiServing
      .Registry()
      .v6()
      .delete({
        serviceName,
        namespaceId,
      })
      .$promise;
  }
}
