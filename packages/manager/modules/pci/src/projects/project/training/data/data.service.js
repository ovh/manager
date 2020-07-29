import Data from './data.class';

export default class PciProjectTrainingDataService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  attach(projectId, dataSpec) {
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .save({ serviceName: projectId }, dataSpec)
      .$promise.then(
        (data) =>
          new Data({
            ...data,
          }),
      );
  }

  sync(projectId, dataId, direction) {
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .sync(
        {
          serviceName: projectId,
          dataId,
        },
        { direction },
      ).$promise;
  }

  getAll(projectId) {
    // Uncomment when iceberg proded
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((allData) => allData.map((data) => new Data({ ...data })));
  }

  get(projectId, dataId) {
    // Uncomment when iceberg proded
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .get({
        serviceName: projectId,
        dataId,
      })
      .$promise.then(
        (data) =>
          new Data({
            ...data,
          }),
      );
  }
}
