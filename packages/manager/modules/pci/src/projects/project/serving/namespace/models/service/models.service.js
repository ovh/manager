import NamespaceModel from './model.class';

export default class OvhManagerPciServingModelService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  add(serviceName, namespaceId, modelCreation) {
    return this.OvhApiCloudProjectAi.Serving()
      .Model()
      .v6()
      .save(
        {
          serviceName,
          namespaceId,
        },
        modelCreation,
      ).$promise;
  }

  getAll(serviceName, namespaceId) {
    return this.OvhApiCloudProjectAi.Serving()
      .Model()
      .v6()
      .query({
        serviceName,
        namespaceId,
      })
      .$promise.then((models) =>
        models.map((model) => new NamespaceModel({ ...model })),
      );
  }

  get(serviceName, namespaceId, modelId) {
    return this.OvhApiCloudProjectAi.Serving()
      .Model()
      .v6()
      .get({
        serviceName,
        namespaceId,
        modelId,
      })
      .$promise.then(
        (model) =>
          new NamespaceModel({
            ...model,
          }),
      );
  }

  delete(serviceName, namespaceId, { id: modelId }) {
    return this.OvhApiCloudProjectAi.Serving()
      .Model()
      .v6()
      .delete({
        serviceName,
        namespaceId,
        modelId,
      }).$promise;
  }

  update(serviceName, namespaceId, modelId) {
    return this.OvhApiCloudProjectAi.Serving()
      .Model()
      .v6()
      .edit(
        {
          serviceName,
          namespaceId,
          modelId,
        },
        null,
      ).$promise;
  }

  getMetricsToken(projectId, namespaceId) {
    return this.OvhApiCloudProjectAi.Serving()
      .Metrics()
      .v6()
      .query({
        serviceName: projectId,
        namespaceId,
      }).$promise;
  }
}
