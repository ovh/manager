export default class OvhManagerPciServingRegistryService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  get(serviceName, namespaceId) {
    return this.OvhApiCloudProjectAi.Serving().Registry().v6().get({
      serviceName,
      namespaceId,
    }).$promise;
  }

  attach(serviceName, namespaceId, registry) {
    return this.OvhApiCloudProjectAi.Serving().Registry().v6().save(
      {
        serviceName,
        namespaceId,
      },
      registry,
    ).$promise;
  }

  detach(serviceName, namespaceId) {
    return this.OvhApiCloudProjectAi.Serving().Registry().v6().delete({
      serviceName,
      namespaceId,
    }).$promise;
  }
}
