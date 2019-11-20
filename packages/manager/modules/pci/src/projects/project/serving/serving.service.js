import Namespace from './namespace.class';

export default class PciProjectServingService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProjectServing,
  ) {
    this.$q = $q;
    this.OvhApiCloudProjectServing = OvhApiCloudProjectServing;
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then(namespaces => namespaces.map(namespace => new Namespace({ ...namespace })));
  }

  get(projectId, namespaceId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .v6()
      .get({
        serviceName: projectId,
        namespaceId,
      })
      .$promise
      .then(namespace => new Namespace({
        ...namespace,
      }));
  }

  delete(projectId, { id: namespaceId }) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .v6()
      .delete({
        serviceName: projectId,
        namespaceId,
      })
      .$promise;
  }
}
