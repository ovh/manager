import Model from './model.class';

export default class OvhManagerPciServingModelService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectAiServing) {
    this.$q = $q;
    this.OvhApiCloudProjectAiServing = OvhApiCloudProjectAiServing;
  }

  add(serviceName, namespaceId, modelCreation) {
    return this.OvhApiCloudProjectAiServing
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
    return this.OvhApiCloudProjectAiServing
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
    return this.OvhApiCloudProjectAiServing
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
    return this.OvhApiCloudProjectAiServing
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
    return this.OvhApiCloudProjectAiServing
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
