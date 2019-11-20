import Model from './model.class';

export default class OvhManagerPciServingModelService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo, OvhApiCloudProjectServing) {
    this.$q = $q;
    this.OvhApiCloudProjectServing = OvhApiCloudProjectServing;
  }

  add(serviceName, namespaceId, modelCreation) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Model()
      .v6()
      .save(
        {
          serviceName,
          namespaceId,
        },
        modelCreation,
      )
      .$promise;
  }

  getAll(serviceName, namespaceId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Model()
      .v6()
      .query({
        serviceName,
        namespaceId,
      })
      .$promise
      .then(models => models.map(model => new Model({ ...model })));
  }

  get(serviceName, namespaceId, modelId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Model()
      .v6()
      .get({
        serviceName,
        namespaceId,
        modelId,
      })
      .$promise
      .then(model => new Model({
        ...model,
      }));
  }

  delete(serviceName, namespaceId, { id: modelId }) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Model()
      .v6()
      .delete({
        serviceName,
        namespaceId,
        modelId,
      })
      .$promise;
  }

  update(serviceName, namespaceId, modelId) {
    return this.OvhApiCloudProjectServing
      .Namespace()
      .Model()
      .v6()
      .edit(
        {
          serviceName,
          namespaceId,
          modelId,
        },
        null,
      )
      .$promise;
  }
}
