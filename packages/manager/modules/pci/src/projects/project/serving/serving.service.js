import Namespace from './namespace.class';

export default class PciProjectServingService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectAi.Serving()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((namespaces) =>
        namespaces.map((namespace) => new Namespace({ ...namespace })),
      );
  }

  get(projectId, namespaceId) {
    return this.OvhApiCloudProjectAi.Serving()
      .v6()
      .get({
        serviceName: projectId,
        namespaceId,
      })
      .$promise.then(
        (namespace) =>
          new Namespace({
            ...namespace,
          }),
      );
  }

  delete(projectId, { id: namespaceId }) {
    return this.OvhApiCloudProjectAi.Serving().v6().delete({
      serviceName: projectId,
      namespaceId,
    }).$promise;
  }
}
